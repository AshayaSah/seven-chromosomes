from flask import request, jsonify, Blueprint
from datetime import datetime
from src.config import logger
import traceback
from langchain_core.messages import HumanMessage, AIMessage
from src.services.content_loader import load_content, get_text_chunks
from src.services.vector_store import get_vector_store
from src.services.llm_processor import get_conversational_chain
from src.services.history_manager import (
    get_session_chat_history,
    save_session_chat_history,
    save_conversation_to_redis,
)


content_bp = Blueprint("content", __name__)


@content_bp.route("/process-content", methods=["POST"])
def process_content():
    data = request.get_json()
    source = data.get("source")
    source_type = data.get("source_type")
    user_question = data.get("question")
    user_name = data.get("username")

    if not user_name:
        logger.warning("No username provided in request.")
        return jsonify({"error": "Please provide a username."}), 400
    if not user_question:
        logger.warning("No question provided in request.")
        return jsonify({"error": "Please provide a question."}), 400

    user_name = user_name.lower()
    try:
        logger.info(
            f"Processing content for question: {user_question} by user: {user_name}"
        )

        # Load text chunks if source is provided
        text_chunks = []
        if source:
            logger.info(
                f"Loading content from source: {source} (type: {source_type or 'unknown'})"
            )
            documents = load_content(source, source_type or "unknown")
            if not documents:
                logger.warning(f"No content loaded from source: {source}")
                return jsonify({"error": "No content loaded from the source."}), 400

            text_chunks = get_text_chunks(documents)
            if not text_chunks:
                logger.warning(f"No text chunks created from source: {source}")
                return jsonify(
                    {"error": "No text chunks created from the source."}
                ), 400
            logger.info(f"Loaded {len(text_chunks)} text chunks for user: {user_name}")

        # Get vector store
        vector_store = get_vector_store(text_chunks, user_name)
        if not vector_store:
            logger.error("Failed to retrieve vector store.")
            return jsonify({"error": "Failed to retrieve vector store."}), 500

        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        chain = get_conversational_chain(retriever)

        # Load chat history
        chat_history = get_session_chat_history(user_name)
        logger.info(
            f"Loaded chat history with {len(chat_history.messages)} messages for {user_name}"
        )

        # Invoke the chain
        result = chain.invoke(
            {"input": user_question, "chat_history": chat_history.messages}
        )
        answer = result["answer"]
        logger.info(f"Answer generated: {answer}")

        # Update chat history
        chat_history.add_message(HumanMessage(content=user_question))
        chat_history.add_message(AIMessage(content=answer))
        save_session_chat_history(user_name, chat_history)

        # Save to global history
        conversation_entry = (
            user_question,
            answer,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            str(source) if source else "existing_vector_store",
            source_type if source_type else "unknown",
        )
        save_conversation_to_redis(conversation_entry)
        logger.info(f"Conversation saved to Redis for user: {user_name}")

        return jsonify(
            {
                "question": user_question,
                "answer": answer,
                "source": source or "existing_vector_store",
                "source_type": source_type or "unknown",
                "timestamp": conversation_entry[2],
            }
        ), 200
    except Exception as e:
        error_msg = f"Error: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500

from flask import request, jsonify, Blueprint
from src.services.content_loader import load_content, get_text_chunks
from src.services.vector_store import get_vector_store
from src.services.llm_processor import get_conversational_chain
from src.services.history_manager import (
    get_session_chat_history, save_session_chat_history, save_conversation_to_redis
)
from werkzeug.utils import secure_filename
from datetime import datetime
from langchain_core.messages import HumanMessage, AIMessage
from src.config import logger
import traceback
from pathlib import Path
import re

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
        logger.info(f"Processing content for question: {user_question} by user: {user_name}")
        
        # Load text chunks if source is provided
        text_chunks = []
        if source:
            logger.info(f"Loading content from sourceMyth: {source} (type: {source_type or 'unknown'})")
            documents = load_content(source, source_type or "unknown")
            if not documents:
                logger.warning(f"No content loaded from source: {source}")
                return jsonify({"error": "No content loaded from the source."}), 400
            
            text_chunks = get_text_chunks(documents)
            if not text_chunks:
                logger.warning(f"No text chunks created from source: {source}")
                return jsonify({"error": "No text chunks created from the source."}), 400
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
        logger.info(f"Loaded chat history with {len(chat_history.messages)} messages for {user_name}")

        # Invoke the chain
        result = chain.invoke({"input": user_question, "chat_history": chat_history.messages})
        answer = result["answer"]
        logger.info(f"Answer generated: {answer}")

        # Update chat history
        chat_history.add_message(HumanMessage(content=user_question))
        chat_history.add_message(AIMessage(content=answer))
        save_session_chat_history(user_name, chat_history)

        # Save to user-specific conversation history
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        conversation_entry = (
            user_question,
            answer,
            timestamp,
            str(source) if source else "existing_vector_store",
            source_type if source_type else "unknown"
        )
        save_conversation_to_redis(user_name, conversation_entry)
        logger.info(f"Conversation saved to Redis for user: {user_name}")

        return jsonify({
            "question": user_question,
            "answer": answer,
            "source": source or "existing_vector_store",
            "source_type": source_type or "unknown",
            "timestamp": timestamp
        }), 200
    except Exception as e:
        error_msg = f"Error: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500


@content_bp.route("/process-file-content", methods=["POST"])
def process_file_content():
    # Set data directory
    data_dir = Path(__file__).parent.parent.parent / "data"  # Resolves to llm_flask_app/data
    data_dir.mkdir(exist_ok=True)

    # Ensure multipart/form-data
    if not request.content_type.startswith("multipart/form-data"):
        logger.warning("Expected multipart/form-data")
        return jsonify({"error": "Use multipart/form-data"}), 400

    # Get form data
    if "file" not in request.files or not request.files["file"].filename:
        logger.warning("No file provided")
        return jsonify({"error": "File required"}), 400

    file = request.files["file"]
    username = request.form.get("username", "").lower()
    question = request.form.get("question")
    source_type = request.form.get("source_type")

    # Validate inputs
    if not username or not re.match(r"^[a-zA-Z0-9_-]+$", username):
        logger.warning(f"Invalid username: {username}")
        return jsonify({"error": "Valid username required"}), 400
    if not question:
        logger.warning("No question")
        return jsonify({"error": "Question required"}), 400
    if source_type not in ["pdf", "docx", "text", "raw"]:
        logger.warning(f"Invalid source_type: {source_type}")
        return jsonify({"error": "Source type must be pdf, docx, text, or raw"}), 400

    # Save file
    filename = secure_filename(file.filename)
    user_dir = data_dir / username
    user_dir.mkdir(exist_ok=True, parents=True)
    source = user_dir / f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
    logger.info(f"Saving file to: {source}")
    try:
        file.save(source)
        logger.info(f"File saved: {source}")
    except Exception as e:
        logger.error(f"Failed to save file: {str(e)}")
        return jsonify({"error": f"Failed to save file: {str(e)}"}), 500

    # Process file
    try:
        documents = load_content(str(source), source_type)
        if not documents:
            logger.warning(f"No content from {source}")
            return jsonify({"error": "Failed to load content"}), 400

        text_chunks = get_text_chunks(documents)
        if not text_chunks:
            logger.warning(f"No chunks from {source}")
            return jsonify({"error": "Failed to create chunks"}), 400
        logger.info(f"Loaded {len(text_chunks)} chunks for {username}")

        vector_store = get_vector_store(text_chunks, username)
        if not vector_store:
            logger.error("Failed to create vector store")
            return jsonify({"error": "Failed to create vector store"}), 500

        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        chain = get_conversational_chain(retriever)
        chat_history = get_session_chat_history(username)

        result = chain.invoke({"input": question, "chat_history": chat_history.messages})
        answer = result["answer"]

        chat_history.add_message(HumanMessage(content=question))
        chat_history.add_message(AIMessage(content=answer))
        save_session_chat_history(username, chat_history)

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        conversation_entry = (
            question,
            answer,
            timestamp,
            str(source),
            source_type
        )
        save_conversation_to_redis(username, conversation_entry)
        logger.info(f"Conversation saved to Redis for user: {username}")

        return jsonify({
            "status": "success",
            "data": {
                "question": question,
                "answer": answer,
                "source": str(source),
                "source_type": source_type
            },
            "timestamp": timestamp
        }), 200

    except Exception as e:
        logger.error(f"Error: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "Internal server error"}), 500
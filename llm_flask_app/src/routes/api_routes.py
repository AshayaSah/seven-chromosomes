from flask import request, jsonify
from src.services.content_loader import load_content, get_text_chunks
from src.services.vector_store import get_vector_store, clear_user_vector_store

from src.services.llm_processor import get_conversational_chain
from src.services.history_manager import (
    save_conversation_to_redis,
    get_conversation_history_from_redis,
    save_history_to_csv,
    clear_conversation_history_in_redis,
    get_session_chat_history,
    save_session_chat_history,
)
import os
from datetime import datetime
import traceback
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.chat_message_histories import RedisChatMessageHistory
from src.config import logger, api_bp, REDIS_HISTORY_URL


@api_bp.route("/process-content", methods=["POST"])
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
            logger.info(f"Loading content from source: {source} (type: {source_type or 'unknown'})")
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

        # Save to global history
        conversation_entry = (
            user_question,
            answer,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            str(source) if source else "existing_vector_store",
            source_type if source_type else "unknown"
        )
        save_conversation_to_redis(conversation_entry)
        logger.info(f"Conversation saved to Redis for user: {user_name}")

        return jsonify({
            "question": user_question,
            "answer": answer,
            "source": source or "existing_vector_store",
            "source_type": source_type or "unknown",
            "timestamp": conversation_entry[2]
        }), 200
    except Exception as e:
        error_msg = f"Error: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 500


@api_bp.route("/conversation-history", methods=["GET"])
def get_conversation_history():
    try:
        logger.info("Fetching conversation history.")
        history = get_conversation_history_from_redis()
        logger.info(f"Retrieved {len(history)} history entries.")
        return jsonify(
            [
                {
                    "question": q,
                    "answer": a,
                    "timestamp": t,
                    "source": s,
                    "source_type": st,
                }
                for q, a, t, s, st in history
            ]
        ), 200
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/save-history", methods=["POST"])
def save_history(filename=None):
    data = request.get_json(silent=True) or {}
    if not filename:
        filename = data.get("filename", "conversation_history.csv")
    try:
        logger.info(f"Saving history to {filename}")
        result = save_history_to_csv(filename)
        logger.info(result)
        return jsonify({"message": result}), 200
    except Exception as e:
        logger.error(f"Error saving history to {filename}: {str(e)}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/clear-redis", methods=["DELETE"])
def clear_history():
    try:
        logger.info("Clearing conversation history.")
        result = clear_conversation_history_in_redis()
        logger.info(result)
        return jsonify({"message": result}), 200
    except Exception as e:
        logger.error(f"Error clearing history: {str(e)}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/clear-history/<username>", methods=["DELETE"])
def clear_vector_store(username):
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or username).lower()
    if not username:
        logger.error("Invalid or missing username")
        return jsonify({"error": "Username is required"}), 400
    try:
        logger.info(f"Clearing history for user: {username}")
        
        # Clear Redis chat history
        session_id = f"chat_history:{username}"
        redis_history = RedisChatMessageHistory(
            session_id=session_id,
            url=REDIS_HISTORY_URL
        )
        message_count = len(redis_history.messages)
        logger.info(f"Found {message_count} messages in Redis for {username}")
        
        redis_history.clear()
        
        if redis_history.messages:
            remaining_count = len(redis_history.messages)
            logger.error(f"Failed to clear Redis history for {username}, {remaining_count} messages remain")
            return jsonify({"error": f"Failed to clear Redis history for {username}"}), 500
        
        # Clear vector store (if still needed for embeddings)
        vector_result = clear_user_vector_store(username)
        logger.info(f"Vector store cleared: {vector_result}")
        
        logger.info(f"Successfully cleared history for user: {username}")
        return jsonify({
            "message": f"Chat history and vector store cleared for user {username} (had {message_count} messages)"
        }), 200
    except Exception as e:
        logger.error(f"Error clearing history for {username}: {str(e)}")
        return jsonify({"error": str(e)}), 500
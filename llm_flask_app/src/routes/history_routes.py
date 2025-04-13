from flask import request, jsonify, Blueprint
from src.services.history_manager import (
    get_conversation_history_from_redis, save_history_to_csv,
    clear_conversation_history_in_redis
)
from src.services.vector_store import clear_user_vector_store
from src.config import logger, REDIS_HISTORY_URL
from langchain_community.chat_message_histories import RedisChatMessageHistory

history_bp = Blueprint("history", __name__)

@history_bp.route("/conversation-history", methods=["GET"])
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


@history_bp.route("/save-history", methods=["POST"])
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


@history_bp.route("/clear-history-text", methods=["DELETE"])
def clear_history():
    try:
        logger.info("Clearing conversation history.")
        result = clear_conversation_history_in_redis()
        logger.info(result)
        return jsonify({"message": result}), 200
    except Exception as e:
        logger.error(f"Error clearing history: {str(e)}")
        return jsonify({"error": str(e)}), 500


@history_bp.route("/clear-history/<username>", methods=["DELETE"])
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


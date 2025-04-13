from flask import request, jsonify, Blueprint
from src.services.history_manager import (
    get_conversation_history_from_redis,
    save_history_to_csv,
    clear_conversation_history_in_redis,
)
from src.services.vector_store import clear_user_vector_store
from src.config import logger, REDIS_HISTORY_URL
from langchain_community.chat_message_histories import RedisChatMessageHistory

history_bp = Blueprint("history", __name__)

@history_bp.route("/conversation-history/<username>", methods=["GET"])
def get_conversation_history(username):
    try:
        if not username:
            logger.error("Username is required")
            return jsonify({"error": "Username is required"}), 400
        
        logger.info(f"Fetching conversation history for user: {username}")
        history = get_conversation_history_from_redis(username)
        logger.info(f"Retrieved {len(history)} history entries for user: {username}")
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
        logger.error(f"Error fetching history for {username}: {str(e)}")
        return jsonify({"error": str(e)}), 500


@history_bp.route("/save-history/<username>", methods=["POST"])
def save_history(username):
    try:
        if not username:
            logger.error("Username is required")
            return jsonify({"error": "Username is required"}), 400
        
        data = request.get_json(silent=True) or {}
        filename = data.get("filename", f"conversation_history_{username}.csv")
        
        logger.info(f"Saving history for user {username} to {filename}")
        result = save_history_to_csv(username, filename)
        logger.info(result)
        return jsonify({"message": result}), 200
    except Exception as e:
        logger.error(f"Error saving history for {username} to {filename}: {str(e)}")
        return jsonify({"error": str(e)}), 500


@history_bp.route("/clear-history-text/<username>", methods=["DELETE"])
def clear_history(username):
    try:
        if not username:
            logger.error("Username is required")
            return jsonify({"error": "Username is required"}), 400
        
        logger.info(f"Clearing conversation history for user: {username}")
        result = clear_conversation_history_in_redis(username)
        logger.info(result)
        return jsonify({"message": result}), 200
    except Exception as e:
        logger.error(f"Error clearing history for {username}: {str(e)}")
        return jsonify({"error": str(e)}), 500


@history_bp.route("/clear-history/<username>", methods=["DELETE"])
def clear_vector_store(username):
    try:
        if not username:
            logger.error("Username is required")
            return jsonify({"error": "Username is required"}), 400
        
        username = username.lower()
        logger.info(f"Clearing history and vector store for user: {username}")
        
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
        
        # Clear conversation history (optional, if you want to clear both)
        clear_conversation_history_in_redis(username)
        
        # Clear vector store
        vector_result = clear_user_vector_store(username)
        logger.info(f"Vector store cleared: {vector_result}")
        
        logger.info(f"Successfully cleared history for user: {username}")
        return jsonify({
            "message": f"Chat history, conversation history, and vector store cleared for user {username} (had {message_count} messages)"
        }), 200
    except Exception as e:
        logger.error(f"Error clearing history for {username}: {str(e)}")
        return jsonify({"error": str(e)}), 500
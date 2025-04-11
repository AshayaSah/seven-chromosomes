import json
import pandas as pd
from typing import List
import redis
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from config import REDIS_HISTORY_URL, logger


redis_history_client = redis.Redis.from_url(REDIS_HISTORY_URL, decode_responses=True)


def save_conversation_to_redis(conversation_entry: tuple):
    try:
        entry_dict = {
            "question": conversation_entry[0],
            "answer": conversation_entry[1],
            "timestamp": conversation_entry[2],
            "source": conversation_entry[3],
            "source_type": conversation_entry[4],
        }
        redis_history_client.rpush("conversation_history", json.dumps(entry_dict))
        logger.info(f"Conversation entry saved to Redis: {entry_dict['question']}")
    except Exception as e:
        logger.error(f"Error saving to Redis: {str(e)}")
        raise Exception(f"Error saving to Redis: {e}")


def get_conversation_history_from_redis() -> List[tuple]:
    try:
        logger.info("Retrieving conversation history from Redis.")
        history = redis_history_client.lrange("conversation_history", 0, -1)
        logger.info(f"Retrieved {len(history)} entries from Redis.")
        return [tuple(json.loads(entry).values()) for entry in history]
    except Exception as e:
        logger.error(f"Error retrieving from Redis: {str(e)}")
        raise Exception(f"Error retrieving from Redis: {e}")


def clear_conversation_history_in_redis():
    try:
        logger.info("Clearing conversation history in Redis.")
        redis_history_client.delete("conversation_history")
        redis_history_client.delete("chat_history:*")  # Clear all chat histories
        logger.info("Conversation history cleared in Redis.")
        return "Conversation history reset in Redis."
    except Exception as e:
        logger.error(f"Error clearing Redis history: {str(e)}")
        raise Exception(f"Error clearing Redis history: {e}")


def save_history_to_csv(filename: str = "conversation_history.csv"):
    try:
        logger.info(f"Saving conversation history to {filename}")
        conversation_history = get_conversation_history_from_redis()
        if not conversation_history:
            logger.warning("No conversation history to save.")
            raise Exception("No conversation history to save.")
        df = pd.DataFrame(
            conversation_history,
            columns=["Question", "Answer", "Timestamp", "Source", "Source Type"],
        )
        df.to_csv(filename, index=False)
        logger.info(f"Conversation history saved to {filename}")
        return f"Conversation history saved to {filename}"
    except Exception as e:
        logger.error(f"Error saving history to CSV: {str(e)}")
        raise


def get_session_chat_history(user_id: str) -> ChatMessageHistory:
    """Retrieve or initialize chat history for a user."""
    key = f"chat_history:{user_id}"
    try:
        history_data = redis_history_client.lrange(key, 0, -1)
        chat_history = ChatMessageHistory()
        if history_data:
            for entry in history_data:
                msg = json.loads(entry)
                if msg["type"] == "human":
                    chat_history.add_message(HumanMessage(content=msg["content"]))
                elif msg["type"] == "ai":
                    chat_history.add_message(AIMessage(content=msg["content"]))
            logger.info(f"Loaded {len(history_data)} messages for user {user_id}")
        return chat_history
    except Exception as e:
        logger.error(f"Error loading chat history for {user_id}: {str(e)}")
        raise


def save_session_chat_history(user_id: str, chat_history: ChatMessageHistory):
    """Save chat history to Redis for a user."""
    key = f"chat_history:{user_id}"
    try:
        redis_history_client.delete(key)  # Clear existing history
        for msg in chat_history.messages:
            entry = {
                "type": "human" if isinstance(msg, HumanMessage) else "ai",
                "content": msg.content,
            }
            redis_history_client.rpush(key, json.dumps(entry))
        logger.info(f"Saved {len(chat_history.messages)} messages for user {user_id}")
    except Exception as e:
        logger.error(f"Error saving chat history for {user_id}: {str(e)}")
        raise

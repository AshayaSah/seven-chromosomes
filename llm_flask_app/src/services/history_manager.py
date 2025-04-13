import json
import pandas as pd
from typing import List
from langchain_community.chat_message_histories import RedisChatMessageHistory, ChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from src.config import REDIS_HISTORY_URL, logger


def save_conversation_to_redis(user_id: str, conversation_entry: tuple):
    """Save a conversation entry to Redis for a specific user."""
    try:
        # Use a user-specific session_id
        session_id = f"conversation_history:{user_id}"
        redis_history = RedisChatMessageHistory(
            session_id=session_id, url=REDIS_HISTORY_URL
        )
        
        # Unpack the tuple
        question, answer, timestamp, source, source_type = conversation_entry
        
        # Store question as HumanMessage, answer as AIMessage with metadata
        redis_history.add_message(HumanMessage(content=question))
        redis_history.add_message(
            AIMessage(
                content=answer,
                additional_kwargs={
                    "timestamp": timestamp,
                    "source": source,
                    "source_type": source_type
                }
            )
        )
        
        logger.info(f"Conversation entry saved to Redis for user {user_id}: {question}")
    except Exception as e:
        logger.error(f"Error saving to Redis for user {user_id}: {str(e)}")
        raise Exception(f"Error saving to Redis: {e}")


def get_conversation_history_from_redis(user_id: str) -> List[tuple]:
    """Retrieve conversation history for a specific user from Redis."""
    try:
        session_id = f"conversation_history:{user_id}"
        redis_history = RedisChatMessageHistory(
            session_id=session_id, url=REDIS_HISTORY_URL
        )
        
        logger.info(f"Retrieving conversation history for user {user_id} from Redis.")
        messages = redis_history.messages
        history = []
        
        # Assume messages are stored as pairs (Human, AI)
        for i in range(0, len(messages), 2):
            if i + 1 < len(messages):
                human_msg = messages[i]
                ai_msg = messages[i + 1]
                if isinstance(human_msg, HumanMessage) and isinstance(ai_msg, AIMessage):
                    entry = (
                        human_msg.content,
                        ai_msg.content,
                        ai_msg.additional_kwargs.get("timestamp", ""),
                        ai_msg.additional_kwargs.get("source", ""),
                        ai_msg.additional_kwargs.get("source_type", "")
                    )
                    history.append(entry)
        
        logger.info(f"Retrieved {len(history)} entries for user {user_id} from Redis.")
        return history
    except Exception as e:
        logger.error(f"Error retrieving from Redis for user {user_id}: {str(e)}")
        raise Exception(f"Error retrieving from Redis: {e}")


def clear_conversation_history_in_redis(user_id: str = None):
    """Clear conversation history in Redis for a specific user or all users."""
    try:
        logger.info("Clearing conversation history in Redis.")
        
        if user_id:
            # Clear user-specific conversation history
            session_id = f"conversation_history:{user_id}"
            user_history = RedisChatMessageHistory(
                session_id=session_id, url=REDIS_HISTORY_URL
            )
            user_history.clear()
            logger.info(f"Cleared conversation history for user {user_id}")
            return f"Conversation history reset for user {user_id} in Redis."
        else:
            # Optionally, implement logic to clear all user histories
            # This would require Redis key pattern matching (e.g., "conversation_history:*")
            logger.warning("Clearing all histories not implemented for safety.")
            return "Please specify a user_id to clear history."
            
    except Exception as e:
        logger.error(f"Error clearing Redis history: {str(e)}")
        raise Exception(f"Error clearing Redis history: {e}")


def save_history_to_csv(user_id: str, filename: str = None):
    """Save conversation history for a specific user to a CSV file."""
    try:
        if not filename:
            filename = f"conversation_history_{user_id}.csv"
        logger.info(f"Saving conversation history for user {user_id} to {filename}")
        conversation_history = get_conversation_history_from_redis(user_id)
        if not conversation_history:
            logger.warning(f"No conversation history to save for user {user_id}.")
            raise Exception(f"No conversation history to save for user {user_id}.")
        
        df = pd.DataFrame(
            conversation_history,
            columns=["Question", "Answer", "Timestamp", "Source", "Source Type"],
        )
        df.to_csv(filename, index=False)
        logger.info(f"Conversation history saved to {filename} for user {user_id}")
        return f"Conversation history saved to {filename} for user {user_id}"
    except Exception as e:
        logger.error(f"Error saving history to CSV for user {user_id}: {str(e)}")
        raise


def get_session_chat_history(user_id: str) -> ChatMessageHistory:
    """Retrieve or initialize chat history for a user."""
    try:
        session_id = f"chat_history:{user_id}"
        redis_history = RedisChatMessageHistory(
            session_id=session_id, url=REDIS_HISTORY_URL
        )
        
        chat_history = ChatMessageHistory()
        messages = redis_history.messages
        if messages:
            for msg in messages:
                chat_history.add_message(msg)
            logger.info(
                f"Loaded {len(messages)} messages for user {user_id}. "
                f"First 3: {[msg.content[:50] + '...' for msg in messages[:3]]}"
            )
        else:
            logger.info(f"No chat history found for user {user_id}")
        
        return chat_history
    except Exception as e:
        logger.error(f"Error loading chat history for {user_id}: {str(e)}")
        raise


def save_session_chat_history(user_id: str, chat_history: ChatMessageHistory):
    """Save chat history to Redis for a user."""
    try:
        session_id = f"chat_history:{user_id}"
        redis_history = RedisChatMessageHistory(
            session_id=session_id, url=REDIS_HISTORY_URL
        )
        
        if not chat_history.messages:
            logger.info(f"No messages to save for user {user_id}")
            return
        
        redis_history.clear()  # Clear existing history
        for msg in chat_history.messages:
            redis_history.add_message(msg)
        
        logger.info(f"Saved {len(chat_history.messages)} messages for user {user_id}")
    except Exception as e:
        logger.error(f"Error saving chat history for {user_id}: {str(e)}")
        raise
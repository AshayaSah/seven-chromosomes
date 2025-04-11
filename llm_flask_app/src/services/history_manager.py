import json
import pandas as pd
from datetime import datetime
from typing import List
import redis
from config import Config

redis_history_client = redis.Redis.from_url(Config.REDIS_HISTORY_URL, decode_responses=True)

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
    except Exception as e:
        raise Exception(f"Error saving to Redis: {e}")

def get_conversation_history_from_redis() -> List[tuple]:
    try:
        history = redis_history_client.lrange("conversation_history", 0, -1)
        return [tuple(json.loads(entry).values()) for entry in history]
    except Exception as e:
        raise Exception(f"Error retrieving from Redis: {e}")

def clear_conversation_history_in_redis():
    try:
        redis_history_client.delete("conversation_history")
        return "Conversation history reset in Redis."
    except Exception as e:
        raise Exception(f"Error clearing Redis history: {e}")

def save_history_to_csv(filename: str = "conversation_history.csv"):
    conversation_history = get_conversation_history_from_redis()
    if not conversation_history:
        raise Exception("No conversation history to save.")
    df = pd.DataFrame(
        conversation_history,
        columns=["Question", "Answer", "Timestamp", "Source", "Source Type"],
    )
    df.to_csv(filename, index=False)
    return f"Conversation history saved to {filename}"
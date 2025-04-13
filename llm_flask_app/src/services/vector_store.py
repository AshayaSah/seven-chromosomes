import os
from typing import List
from langchain_community.vectorstores import FAISS
from src.services.llm_processor import get_embeddings
import shutil
from src.config import logger


def get_vector_store(text_chunks: List[str], user_name: str | None = None):
    embeddings = get_embeddings()
    try:
        logger.info(
            f"Creating vector store with {len(text_chunks)} chunks for user: {user_name or 'anonymous'}"
        )
        vector_store = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
        user_folder = user_name if user_name else "anonymous"
        save_path = os.path.join("llm_flask_app/faissdb", user_folder)

        os.makedirs(save_path, exist_ok=True)
        vector_store.save_local(save_path)
        logger.info(f"Vector store saved to {save_path}")
        return vector_store
    except Exception as e:
        logger.error(f"Error creating vector store: {str(e)}")
        raise Exception(f"Error creating vector store: {e}")


def clear_user_vector_store(user_name: str):
    try:
        user_folder = os.path.join("llm_flask_app/faissdb", user_name)
        if os.path.exists(user_folder):
            logger.info(f"Clearing vector store for user: {user_name}")
            shutil.rmtree(user_folder)
            logger.info(f"Vector store cleared for {user_name}")
            return f"Vector store for {user_name} cleared."
        logger.info(f"No vector store found for user: {user_name}")
        return f"No vector store found for {user_name}."
    except Exception as e:
        logger.error(f"Error clearing vector store for {user_name}: {str(e)}")
        raise Exception(f"Error clearing vector store: {e}")

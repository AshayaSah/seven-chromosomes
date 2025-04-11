import os
from typing import List
from langchain_community.vectorstores import FAISS
from .llm_processor import get_embeddings

def get_vector_store(text_chunks: List[str], api_key: str, user_name: str = None):
    embeddings = get_embeddings(api_key)
    try:
        vector_store = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
        user_folder = user_name if user_name else "anonymous"
        save_path = os.path.join("faissdb", user_folder)
        os.makedirs(save_path, exist_ok=True)
        vector_store.save_local(save_path)
        return vector_store
    except Exception as e:
        raise Exception(f"Error creating vector store: {e}")

def clear_user_vector_store(user_name: str):
    import shutil
    user_folder = os.path.join("faissdb", user_name)
    if os.path.exists(user_folder):
        shutil.rmtree(user_folder)
        return f"Vector store for {user_name} cleared."
    return f"No vector store found for {user_name}."
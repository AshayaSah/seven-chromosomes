from flask import Blueprint, request, jsonify
from src.services.content_loader import load_content, get_text_chunks
from src.services.vector_store import get_vector_store, clear_user_vector_store
from src.services.llm_processor import get_conversational_chain
from src.services.history_manager import (
    save_conversation_to_redis,
    get_conversation_history_from_redis,
    save_history_to_csv,
    clear_conversation_history_in_redis,
)
from datetime import datetime
from config import Config
import traceback

api_bp = Blueprint("api", __name__)

@api_bp.route("/process-content", methods=["POST"])
def process_content():
    data = request.get_json()
    source = data.get("source")
    source_type = data.get("source_type")
    user_question = data.get("question")
    user_name = data.get("username")

    if not source:
        return jsonify({"error": "Please provide a valid source."}), 400
    if not user_name:
        return jsonify({"error": "Please provide a username."}), 400
    if not user_question:
        return jsonify({"error": "Please provide a question."}), 400

    try:
        documents = load_content(source, source_type)
        if not documents:
            return jsonify({"error": "No content loaded from the source."}), 400

        text_chunks = get_text_chunks(documents)
        vector_store = get_vector_store(text_chunks, Config.GOOGLE_API_KEY, user_name) # type: ignore
        if not vector_store:
            return jsonify({"error": "Failed to create/load vector store."}), 500

        # Search for relevant documents
        docs = vector_store.similarity_search(user_question, k=4)
        if not docs:
            return jsonify({"error": "No relevant documents found for the question."}), 400

        # Get the conversational chain and generate answer
        chain = get_conversational_chain(Config.GOOGLE_API_KEY)
        answer = chain.invoke({"context": docs, "question": user_question})
    
        conversation_entry = (
            user_question,
            answer,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            str(source),
            source_type,
        )
        save_conversation_to_redis(conversation_entry)

        return jsonify({
            "question": user_question,
            "answer": answer,
            "source": source,
            "source_type": source_type,
            "timestamp": conversation_entry[2]
        }), 200
    except Exception as e:
        error_msg = f"Error: {str(e)}\n{traceback.format_exc()}"
        return jsonify({"error": str(error_msg)}), 500

@api_bp.route("/conversation_history", methods=["GET"])
def get_conversation_history():
    try:
        history = get_conversation_history_from_redis()
        return jsonify([{
            "question": q,
            "answer": a,
            "timestamp": t,
            "source": s,
            "source_type": st
        } for q, a, t, s, st in history]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/save_history", methods=["POST"])
def save_history():
    data = request.get_json()
    filename = data.get("filename", "conversation_history.csv")
    try:
        result = save_history_to_csv(filename)
        return jsonify({"message": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/clear_history", methods=["DELETE"])
def clear_history():
    try:
        result = clear_conversation_history_in_redis()
        return jsonify({"message": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/clear_history/<user_name>", methods=["DELETE"])
def clear_vector_store(user_name):
    try:
        result = clear_user_vector_store(user_name)
        return jsonify({"message": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
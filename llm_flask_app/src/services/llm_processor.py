from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from src.config import logger
import os

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def get_embeddings():
    try:
        logger.info("Initializing embeddings model.")
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", google_api_key=GOOGLE_API_KEY
        )
        logger.info("Embeddings model initialized.")
        return embeddings
    except Exception as e:
        logger.error(f"Failed to initialize embeddings: {str(e)}")
        raise



def get_chat_model():
    try:
        logger.info("Initializing chat model.")
        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash", temperature=0.3, google_api_key=GOOGLE_API_KEY
        )
        logger.info("Chat model initialized.")
        return model
    except Exception as e:
        logger.error(f"Failed to initialize chat model: {str(e)}")
        raise


def get_conversational_chain(retriever):
    """Create a conversational chain with chat history support."""
    try:
        logger.info("Creating conversational chain with history support.")
        model = get_chat_model()

            # Contextualize question prompt
        contextualize_q_system_prompt = """Given a chat history and the latest user question \
                which might reference context in the chat history, formulate a standalone question \
                which can be understood without the chat history. Do NOT answer the question, \
                just reformulate it if needed and otherwise return it as is."""
        contextualize_q_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", contextualize_q_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )
        history_aware_retriever = create_history_aware_retriever(
            model, retriever, contextualize_q_prompt
        )
        logger.info("History-aware retriever created.")

        # QA prompt with chat history for medical assistance
        qa_system_prompt = """You are a medical assistant specialized in providing health-related information. \
        Use the following pieces of retrieved context to answer the user's medical question. \
        Ensure that your response is accurate, concise, and limited to three sentences. \
        If you are unsure about the answer or if the information is not available, clearly state that you do not know. \
        Always prioritize the user's health and safety in your responses.\n\n{context}"""

        qa_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", qa_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ]
        )
        question_answer_chain = create_stuff_documents_chain(model, qa_prompt)
        logger.info("Question-answer chain created.")

        # Full retrieval chain
        chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
        logger.info("Conversational chain created.")
        return chain
    except Exception as e:
        logger.error(f"Failed to create conversational chain: {str(e)}")
        raise

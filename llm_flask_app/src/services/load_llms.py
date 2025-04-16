from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from src.config import logger
import os

def get_chat_model():
    """Initialize Google Generative AI chat model."""
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        logger.error("GOOGLE_API_KEY environment variable is not set.")
        raise ValueError("GOOGLE_API_KEY is required.")
    
    try:
        logger.info("Initializing chat model: gemini-1.5-flash")
        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash", temperature=0.3, google_api_key=google_api_key
        )
        logger.info("Chat model initialized successfully.")
        return model
    except Exception as e:
        logger.error(f"Unexpected error initializing chat model: {str(e)}")
        raise


def get_conversational_chain():
    """Create a conversational chain for medical assistance with chat history support."""
    try:
        logger.info("Creating medical conversational chain.")
        model = get_chat_model()

        # Medical assistant prompt
        qa_system_prompt = (
            "You are a medical assistant. The user has reported the following symptoms: {symptoms}. "
            "Based on these symptoms, suggest possible conditions (e.g., {diseases}) in a concise manner. "
            "Keep the answer to three sentences or less. If unsure, say so. Do not provide a definitive diagnosis."
        )
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "Symptoms: {symptoms}"),
        ])

        # Simple chain for direct invocation
        chain = model | qa_prompt
        logger.info("Medical conversational chain created successfully.")
        return chain
    except Exception as e:
        logger.error(f"Unexpected error creating conversational chain: {str(e)}")
        raise


def invoke_conversational_chain(chain, symptoms, chat_history=None):
    """
    Invoke the conversational chain with user-provided symptoms.
    
    Args:
        chain: The conversational chain from get_conversational_chain.
        symptoms: The user's reported symptoms (str).
        chat_history: List of previous messages for context (optional).
    
    Returns:
        The chain's response.
    """
    if not symptoms:
        logger.error("Symptoms input is empty.")
        raise ValueError("Symptoms are required.")
    
    try:
        logger.info("Invoking medical conversational chain.")
        chat_history = chat_history or []
        
        response = chain.invoke({
            "symptoms": symptoms,
            "chat_history": chat_history,
            "diseases": "common conditions"  # Placeholder for prompt compatibility
        })
        logger.info("Chain invoked successfully.")
        return response.content
    except Exception as e:
        logger.error(f"Error invoking conversational chain: {str(e)}")
        raise
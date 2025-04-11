from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

def get_embeddings(api_key: str):
    return GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)

def get_chat_model(api_key: str):
    return ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3, google_api_key=api_key)

def get_conversational_chain(api_key: str):
    prompt_template = """
    Answer the question as detailed as possible from the provided context. If the answer is not in the context, say "Answer is not available in the context." Do not provide incorrect information.

    Context:
    {context}

    Question:
    {question}

    Answer:
    """
    model = get_chat_model(api_key)
    prompt = ChatPromptTemplate.from_template(prompt_template)
    chain = create_stuff_documents_chain(model, prompt)
    return chain
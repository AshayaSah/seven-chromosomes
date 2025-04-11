from typing import List
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader, TextLoader
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

def load_content(source: str, source_type: str) -> List[Document]:
    try:
        if source_type == "pdf":
            loader = PyPDFLoader(source)
            return loader.load()
        elif source_type == "web":
            # if isinstance(source, list):
            #     loader = WebBaseLoader(source)
            # else:
            loader = WebBaseLoader([source])
            return loader.load()
        elif source_type == "text":
            loader = TextLoader(source)
            return loader.load()
        elif source_type == "raw":
            return [Document(page_content=source, metadata={"source": "raw_input"})]
        else:
            raise ValueError(f"Unsupported source type: {source_type}")
    except Exception as e:
        raise Exception(f"Error loading content: {e}")

def get_text_chunks(documents: List[Document]) -> List[str]:
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_documents(documents)
    return [chunk.page_content for chunk in chunks]
from typing import List, Union
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader, TextLoader
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from src.config import logger

def load_content(source: Union[str, List[str]], source_type: str) -> List[Document]:
    try:
        logger.info(f"Loading content from {source_type}: {source}")
        sources = [source] if isinstance(source, str) else source
        if not isinstance(sources, list):
            logger.error("Source must be a string or list of strings")
            raise ValueError("Source must be a string or list of strings")
        
        documents = []
        if source_type == "pdf":
            for src in sources:
                logger.info(f"Loading PDF from: {src}")
                loader = PyPDFLoader(src)
                loaded_docs = loader.load()
                if not loaded_docs:
                    logger.warning(f"No documents loaded from {src}")
                documents.extend(loaded_docs)
        elif source_type == "web":
            logger.info(f"Loading web content from: {sources}")
            loader = WebBaseLoader(sources)
            documents.extend(loader.load())
        elif source_type == "text":
            for src in sources:
                logger.info(f"Loading text from: {src}")
                loader = TextLoader(src)
                documents.extend(loader.load())
        elif source_type == "raw":
            for src in sources:
                logger.info(f"Processing raw content: {src}")
                documents.append(
                    Document(page_content=src, metadata={"source": "raw_input"})
                )
        else:
            logger.error(f"Unsupported source type: {source_type}")
            raise ValueError(f"Unsupported source type: {source_type}")
        
        logger.info(f"Loaded {len(documents)} documents from {source_type} source(s)")
        return documents

    except Exception as e:
        logger.error(f"Error loading content: {str(e)}")
        raise Exception(f"Error loading content: {e}")
    
def get_text_chunks(documents: List[Document]) -> List[str]:
    try:
        logger.info(f"Splitting {len(documents)} documents into chunks")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
        chunks = text_splitter.split_documents(documents)
        logger.info(f"Created {len(chunks)} text chunks")
        return [chunk.page_content for chunk in chunks]
    except Exception as e:
        logger.error(f"Error splitting documents: {str(e)}")
        raise Exception(f"Error splitting documents: {e}")



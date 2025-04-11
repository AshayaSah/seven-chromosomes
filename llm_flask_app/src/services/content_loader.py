from typing import List, Union
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader, TextLoader
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter



def load_content(source: Union[str, List[str]], source_type: str) -> List[Document]:
    try:
        # Ensure sources is a list
        sources = [source] if isinstance(source, str) else source
        if not isinstance(sources, list):
            raise ValueError("Source must be a string or list of strings")
        documents = []
        if source_type == "pdf":
            for src in sources:
                loader = PyPDFLoader(src)
                documents.extend(loader.load())
        elif source_type == "web":
            loader = WebBaseLoader(
                sources
            )
            documents.extend(loader.load())
        elif source_type == "text":
            for src in sources:
                loader = TextLoader(src)
                documents.extend(loader.load())
        elif source_type == "raw":
            for src in sources:
                documents.append(
                    Document(page_content=src, metadata={"source": "raw_input"})
                )
        else:
            raise ValueError(f"Unsupported source type: {source_type}")
        return documents

    except Exception as e:
        raise Exception(f"Error loading content: {e}")


def get_text_chunks(documents: List[Document]) -> List[str]:
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_documents(documents)
    return [chunk.page_content for chunk in chunks]

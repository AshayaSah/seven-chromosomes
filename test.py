import os
os.environ["USER_AGENT"] = "TestAgent/1.0"
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://example.com")
docs = loader.load()
print("Loaded:", len(docs))
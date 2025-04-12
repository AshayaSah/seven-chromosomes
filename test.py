# import os
# os.environ["USER_AGENT"] = "TestAgent/1.0"
# from langchain_community.document_loaders import WebBaseLoader
# loader = WebBaseLoader("https://example.com")
# docs = loader.load()
# print("Loaded:", len(docs))


# def ensure_faissdb_directory():
#     faissdb_path = os.path.join("llm_flask_app", "faissdb")
#     os.makedirs(faissdb_path, exist_ok=True)
#     print(f"Directory ensured: {faissdb_path}")

# ensure_faissdb_directory()

import requests

url = "http://localhost:5000/api/process-file-content"
# file_path = "/home/rabindra/seven-chromosomes/er.2017-00234.pdf"
file_path = "/home/rabindra/seven-chromosomes/SIGMOD24_VecDB_Tutorial.pdf"

# Prepare the form data
data = {
    "username": "user1",
    "question": "What is this document about? find how how can i understand about the vector database",
    "source_type": "pdf"
}

# Prepare the file for upload
files = {
    "file": open(file_path, "rb")
}

try:
    # Send the POST request
    response = requests.post(url, data=data, files=files)
    
    # Print the response
    print("Status Code:", response.status_code)
    # print("Response JSON:", response.json())
    answer = response.json()["data"]["answer"]
    print(answer)

except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
finally:
    # Close the file
    files["file"].close()
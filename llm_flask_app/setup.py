from setuptools import setup, find_packages

# Read the requirements from requirements.txt
with open("requirements.txt", "r") as f:
    requirements = f.read().splitlines()

setup(
    name="llm_flask_app",
    version="0.1.0",
    description="A Flask-base application with the medicine prediction model",
    author="Seven Chromosome",
    author_email="rabindraabasnet@gmail.com", 
    packages=find_packages(where="."),  
    package_dir={"": "."},  
    install_requires=requirements,  
    include_package_data=True,
    entry_points={
        "console_scripts": [
            "llm-flask-app=app:create_app" 
        ]
    },
    python_requires=">=3.12",  
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License", 
        "Operating System :: OS Independent",
    ],
)
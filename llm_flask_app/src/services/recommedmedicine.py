import numpy as np
import pandas as pd
import pickle
from src.utils.sym_disease import symptoms_dict, diseases_list, symptom_mapping
from src.config import logger
import os
import re


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def load_data():
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../trainingdata'))
    logger.info(f"Loading data from: {base_path}")
    
    def read_csv_safe(filename):
        path = os.path.join(base_path, filename)
        if not os.path.exists(path):
            logger.error(f"Missing file: {path}")
            raise FileNotFoundError(f"Missing file: {path}")
        logger.info(f"Reading file: {path}")
        return pd.read_csv(path)

    sym_des = read_csv_safe("symtoms_df.csv")  
    precautions = read_csv_safe("precautions_df.csv")
    workout = read_csv_safe("workout_df.csv")
    description = read_csv_safe("description.csv")
    medications = read_csv_safe("medications.csv")
    diets = read_csv_safe("diets.csv")
    
    logger.info("Data loading completed successfully.")
    return sym_des, precautions, workout, description, medications, diets

def load_model():
    current_dir = "llm_flask_app"
    model_path = os.path.join(current_dir, 'picklemodel', 'svc.pkl')
    if not os.path.exists(model_path):
        logger.error(f"Model file not found at {model_path}")
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    logger.info(f"Loading model from: {model_path}")
    with open(model_path, 'rb') as f:
        model = pickle.load(f)   
    logger.info("Model loaded successfully.")
    return model

def identification_helper(dis, description, precautions, medications, diets, workout):
    logger.info(f"Identifying information for disease: {dis}")
    
    desc = description[description['Disease'] == dis]['Description'].values
    desc = " ".join(desc) if len(desc) > 0 else "No description available."
    logger.info(f"Description found: {desc}")

    pre = precautions[precautions['Disease'] == dis][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']]
    pre = pre.values.tolist()
    pre = pre[0] if pre else ["No precautions found."]
    logger.info(f"Precautions found: {pre}")

    med = medications[medications['Disease'] == dis]['Medication'].values.tolist()
    die = diets[diets['Disease'] == dis]['Diet'].values.tolist()
    wrkout = workout[workout['disease'] == dis]['workout'].values.tolist()

    logger.info(f"Medications found: {med}")
    logger.info(f"Diets found: {die}")
    logger.info(f"Workouts found: {wrkout}")

    return desc, pre, med, die, wrkout



def get_predicted_value(patient_symptoms, svc):
    logger.info(f"Getting predicted value for symptoms: {patient_symptoms}")
    input_vector = np.zeros(len(symptoms_dict))
    for item in patient_symptoms:
        if item in symptoms_dict:
            input_vector[symptoms_dict[item]] = 1
    prediction = diseases_list[svc.predict([input_vector])[0]]
    logger.info(f"Predicted disease: {prediction}")
    return prediction

def extract_symptoms_from_text(text):
    """Extract symptoms from free text input using simple pattern matching"""
    logger.info(f"Extracting symptoms from text: {text}")
    text = text.lower()
    extracted_symptoms = []
    
    # Check for multi-word symptoms first - create a pattern from the mapping keys
    multi_word_symptoms = [k for k in symptom_mapping.keys() if ' ' in k]
    for symptom in multi_word_symptoms:
        if symptom in text:
            mapped_symptom = symptom_mapping[symptom]
            if mapped_symptom in symptoms_dict and mapped_symptom not in extracted_symptoms:
                extracted_symptoms.append(mapped_symptom)
                logger.info(f"Extracted multi-word symptom: {mapped_symptom}")
    
    # Check for single word symptoms and direct matches
    words = re.findall(r'\b\w+\b', text)
    
    for word in words:
        if word in symptom_mapping:
            mapped_symptom = symptom_mapping[word]
            if mapped_symptom in symptoms_dict and mapped_symptom not in extracted_symptoms:
                extracted_symptoms.append(mapped_symptom)
                logger.info(f"Extract ed single-word symptom: {mapped_symptom}")
        elif word in symptoms_dict and word not in extracted_symptoms:
            extracted_symptoms.append(word)
            logger.info(f"Extracted symptom: {word}")
    
    for symptom in symptoms_dict:
        if symptom in text and symptom not in extracted_symptoms:
            extracted_symptoms.append(symptom)
            logger.info(f"Directly matched symptom: {symptom}")
    
    logger.info(f"Final extracted symptoms: {extracted_symptoms}")
    return extracted_symptoms

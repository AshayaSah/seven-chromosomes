from flask import request, jsonify, Blueprint
from src.services.recommedmedicine import (
    load_data, load_model, get_predicted_value, identification_helper, extract_symptoms_from_text
)
from src.config import logger

medical_bp = Blueprint("medical_bp", __name__)

@medical_bp.route('/test-predict-medicine', methods=['POST'])
def main():
    try:
        data = request.get_json()
        logger.info("Received data for test-predict-medicine: %s", data)

        symptoms = data.get('symptoms')

        if not symptoms or not isinstance(symptoms, list):
            logger.warning("Invalid input format. 'symptoms' must be a list.")
            return jsonify({"error": "Invalid input format. 'symptoms' must be a list."}), 400

        sym_des, precautions, workout, description, medications, diets = load_data()
        svc = load_model()

        predicted_disease = get_predicted_value(symptoms, svc)
        logger.info("Predicted disease: %s", predicted_disease)

        dis_des, precautions_list, medications_list, rec_diet, workout_list = identification_helper(
            predicted_disease, description, precautions, medications, diets, workout
        )

        return jsonify({
            "predicted_disease": predicted_disease,
            "description": dis_des,
            "precautions": precautions_list[0] if precautions_list else [],
            "medications": medications_list,
            "diet": rec_diet,
            "workout": workout_list
        })

    except Exception as e:
        logger.error("Error in test-predict-medicine: %s", str(e))
        return jsonify({"error": str(e)}), 500

    
@medical_bp.route('/predict-medicine', methods=['POST'])
def predict_medicine_model():
    try:
        data = request.get_json()
        logger.info("Received data for predict-medicine: %s", data)

        # Validate input
        if not data:
            logger.warning("No input data provided.")
            return jsonify({"error": "No input data provided."}), 400

        # Check if symptoms are provided directly or extract from text
        if 'symptoms' in data and isinstance(data['symptoms'], list):
            symptoms = data['symptoms']
        elif 'text' in data and isinstance(data['text'], str):
            text = data['text'].strip()
            if not text:
                logger.warning("Empty text provided.")
                return jsonify({"error": "Empty text provided."}), 400
            symptoms = extract_symptoms_from_text(text)
            logger.info("Extracted symptoms from text: %s", symptoms)
        else:
            logger.warning("Invalid input. Provide either 'symptoms' as a list or 'text' as a string.")
            return jsonify({
                "error": "Invalid input. Provide either 'symptoms' as a list or 'text' as a string."
            }), 400

        # Check if any symptoms were extracted
        if not symptoms:
            logger.warning("No symptoms detected in the provided input.")
            return jsonify({"error": "No symptoms detected in the provided input."}), 400

        # Load supporting data
        sym_des, precautions, workout, description, medications, diets = load_data()

        # Load model
        svc = load_model()

        # Predict disease
        predicted_disease = get_predicted_value(symptoms, svc)
        logger.info("Predicted disease: %s", predicted_disease)

        # Get associated information
        dis_des, precautions_list, medications_list, rec_diet, workout_list = identification_helper(
            predicted_disease, description, precautions, medications, diets, workout
        )

        # Send response
        return jsonify({
            "detected_symptoms": symptoms,
            "predicted_disease": predicted_disease,
            "description": dis_des,
            "precautions": precautions_list,
            "medications": medications_list,
            "diet": rec_diet,
            "workout": workout_list
        })

    except Exception as e:
        logger.error("Error in predict-medicine: %s", str(e))
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
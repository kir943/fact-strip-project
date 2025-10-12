from flask import Flask, request, jsonify
from dotenv import load_dotenv
import openai
import replicate
import os
import json
from flask_cors import CORS
import traceback
import base64
from io import BytesIO
from PIL import Image

# Import our comic generator
from comic_generator import comic_generator
from story_processor import story_processor

# --- Load Environment Variables ---
load_dotenv()  # This will load your .env file
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")

# --- Initialize the Flask app ---
app = Flask(__name__)
CORS(app)  # Enable React connection

# --- Initialize API keys ---
openai.api_key = OPENAI_API_KEY
os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_TOKEN

# --- Enhanced AI Analysis Functions ---
def analyze_statement(statement):
    """Use OpenAI GPT for fact-checking analysis"""
    try:
        print(f"🔍 Analyzing statement with OpenAI: {statement}")
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are a professional fact-checker. Analyze statements and return ONLY valid JSON:
                {
                    "verdict": "true/false/unverified",
                    "confidence": 0-100,
                    "description": "brief factual explanation",
                    "story": "engaging story for comic panels"
                }"""},
                {"role": "user", "content": f"Fact-check: \"{statement}\""}
            ],
            temperature=0.3,
            max_tokens=400
        )
        
        result = response.choices[0].message.content.strip()
        print(f"✅ OpenAI Response: {result}")
        return result
        
    except Exception as e:
        print(f"❌ OpenAI API error: {e}")
        # Fallback response
        return json.dumps({
            "verdict": "unverified",
            "confidence": 50,
            "description": "Unable to verify at this time.",
            "story": f"Let's explore the statement: '{statement}'. We're checking facts and sources to determine the truth."
        })


def detect_mood(statement):
    """Use OpenAI for mood detection"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Analyze mood. Return JSON: {\"mood\": \"neutral/positive/negative/serious\", \"confidence\": 0-100}"},
                {"role": "user", "content": f"Statement: \"{statement}\""}
            ],
            temperature=0.1,
            max_tokens=80
        )
        
        mood_data = json.loads(response.choices[0].message.content.strip())
        return mood_data.get("mood", "neutral"), mood_data.get("confidence", 75)
        
    except Exception as e:
        print(f"❌ Mood detection error: {e}")
        return "neutral", 75


def generate_comic(story, style, verdict, confidence, statement):
    """Generate a single comic image with 4 panels"""
    try:
        # Split into 4 panels with actual dialogue
        panels = story_processor.split_into_panels(statement, verdict, confidence, story)
        print(f"📝 Generated panel dialogues: {panels}")
        
        # Generate single comic image with 4 panels
        panel_images = comic_generator.generate_comic_panels(style, panels, statement)
        
        # Return the single comic image (first element in array)
        return panel_images[0] if panel_images else None
        
    except Exception as e:
        print(f"❌ Comic generation error: {e}")
        traceback.print_exc()
        # Fallback - create single fallback image
        try:
            fallback_image = comic_generator._create_fallback_panel_image("Comic generation failed", style, 0)
            fallback_base64 = comic_generator.image_to_base64(fallback_image)
            return f"data:image/png;base64,{fallback_base64}"
        except:
            return None


# --- API Routes ---
@app.route("/")
def home():
    return jsonify({
        "message": "Fact-Strip Backend API",
        "status": "running",
        "endpoints": {
            "POST /api/generate": "Check facts and generate comics",
            "GET /health": "Health check"
        }
    })


@app.route("/api/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        statement = data.get("statement", "").strip()
        style = data.get("style", "normal")

        if not statement:
            return jsonify({"error": "Statement is required"}), 400

        print(f"\n🎯 New Request: '{statement}' | Style: {style}")

        # Run AI analysis
        analysis = analyze_statement(statement)
        if not analysis:
            return jsonify({"error": "Analysis failed"}), 500

        # Parse response
        try:
            result = json.loads(analysis)
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            return jsonify({"error": "Invalid analysis format"}), 500

        # Validate fields
        required_fields = ["verdict", "description", "story", "confidence"]
        for field in required_fields:
            if field not in result:
                return jsonify({"error": f"Missing field: {field}"}), 500

        # Mood analysis
        mood, mood_confidence = detect_mood(statement)
        print(f"🎭 Mood: {mood} ({mood_confidence}%)")

        # Generate comic - NOW RETURNS SINGLE IMAGE
        comic_image = generate_comic(
            result["story"],
            style,
            result["verdict"],
            result["confidence"],
            statement
        )

        # Prepare response data matching frontend expectations
        response_data = {
            "verdict": result["verdict"],
            "confidence": result["confidence"],
            "description": result["description"],
            "mood": mood,
            "moodConfidence": mood_confidence,  # Changed to match frontend
            "comicImage": comic_image,  # Single image for frontend
            "success": True
        }

        print("✅ Request completed successfully!")
        return jsonify(response_data)

    except Exception as e:
        print(f"❌ Server error: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "success": False}), 500


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy", 
        "openai_configured": bool(OPENAI_API_KEY),
        "replicate_configured": bool(REPLICATE_API_TOKEN)
    })


if __name__ == "__main__":
    print("🚀 Starting Fact-Strip Backend...")
    print(f"🔑 OpenAI configured: {bool(OPENAI_API_KEY)}")
    print(f"🔑 Replicate configured: {bool(REPLICATE_API_TOKEN)}")
    app.run(debug=True, host="0.0.0.0", port=5000)
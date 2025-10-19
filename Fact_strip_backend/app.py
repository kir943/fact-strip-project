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
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
  # Enable React connection

# --- Initialize API keys ---
openai.api_key = OPENAI_API_KEY
os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_TOKEN

# --- Enhanced AI Analysis Functions ---
def analyze_statement(statement):
    """Use OpenAI GPT for fact-checking analysis AND image prompt generation"""
    try:
        print(f"🔍 Analyzing statement with OpenAI: {statement}")
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are a professional fact-checker and visual storyteller. 
                For each statement, return EXACTLY this JSON format:
                {
                    "verdict": "true/false/unverified",
                    "confidence": 0-100,
                    "description": "brief factual explanation",
                    "story": "engaging story for comic panels",
                    "image_prompts": [
                        "Detailed visual description for panel 1 - include characters, actions, setting, emotions. Show curiosity and questioning.",
                        "Detailed visual description for panel 2 - include characters, scientific investigation, tools, discovery moment.",
                        "Detailed visual description for panel 3 - include characters explaining evidence, visual aids, teaching moment.",
                        "Detailed visual description for panel 4 - include characters presenting conclusion, confident expressions, summary."
                    ]
                }

                IMAGE PROMPT REQUIREMENTS:
                - Be VERY specific about characters, actions, emotions, settings
                - Make it visually accurate to the scientific topic
                - Include descriptive details about appearance, clothing, environment
                - Ensure consistency across all 4 panels (same characters)
                - Leave space for speech bubbles at top
                - Make it educational but visually engaging

                EXAMPLE for "Bees communicate by dance":
                "image_prompts": [
                    "Cartoon bee with curious expression watching another bee return to honeycomb hive. Sunny day, flowers in background. Bee has antennae perked up, wondering expression.",
                    "Bee performing waggle dance on honeycomb floor. Other bees gathered around watching. Arrows showing dance pattern. Sunlight coming through hive entrance.",
                    "Close-up of bee dance showing angle relative to sun diagram. Educational illustration style. Bees taking notes with tiny notebooks.",
                    "Group of bees flying successfully toward flowers in correct direction. Happy bee expressions. Sun and flowers in distance showing successful communication."
                ]"""},
                {"role": "user", "content": f"Fact-check and create comic prompts for: \"{statement}\""}
            ],
            temperature=0.7,
            max_tokens=1200
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
            "story": f"Let's explore the statement: '{statement}'. We're checking facts and sources to determine the truth.",
            "image_prompts": [
                f"Curious character wondering about {statement}, educational setting",
                f"Character researching {statement} with scientific tools",
                f"Character explaining evidence about {statement}",
                f"Character presenting conclusion about {statement}"
            ]
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


def generate_comic(analysis_result, style, statement):
    """Generate comic using GPT-crafted image prompts AND scientific explanations"""
    try:
        # Use the image prompts from GPT analysis
        image_prompts = analysis_result["image_prompts"]
        verdict = analysis_result["verdict"]
        confidence = analysis_result["confidence"]
        
        print(f"🎨 Generating comic with scientific explanations...")
        
        # 🆕 NEW: Generate scientific explanations for the speech bubbles
        explanation = story_processor.generate_fact_explanation(statement)
        
        # 🆕 Use the scientific explanations as dialogues
        if explanation:
            dialogues = [
                explanation.get("step1", f"Let's examine: {statement}"),
                explanation.get("step2", "Researching the scientific evidence..."),
                explanation.get("step3", "Analyzing the findings..."),
                explanation.get("step4", f"Conclusion based on evidence...")
            ]
            print(f"✅ Using scientific explanations for speech bubbles")
        else:
            # Fallback to original dialogues if explanation fails
            dialogues = [
                f"Fact: {statement}",
                "Researching scientific evidence...",
                "Analyzing the data and studies...",
                f"Verdict: {verdict.upper()}! ({confidence}% confidence)"
            ]
            print(f"⚠️ Using fallback dialogues")
        
        # Generate comic using the precise GPT image prompts with scientific dialogues
        panel_images = comic_generator.generate_comic_panels(style, dialogues, image_prompts, statement)
        
        return panel_images[0] if panel_images else None
        
    except Exception as e:
        print(f"❌ Comic generation error: {e}")
        traceback.print_exc()
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
            "POST /api/generate-explanation": "Generate scientific explanations for facts",
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

        # Run AI analysis (now includes image prompts)
        analysis = analyze_statement(statement)
        if not analysis:
            return jsonify({"error": "Analysis failed"}), 500

        # Parse response
        try:
            result = json.loads(analysis)
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            return jsonify({"error": "Invalid analysis format"}), 500

        # Validate fields (including new image_prompts)
        required_fields = ["verdict", "description", "story", "confidence", "image_prompts"]
        for field in required_fields:
            if field not in result:
                return jsonify({"error": f"Missing field: {field}"}), 500

        # Mood analysis
        mood, mood_confidence = detect_mood(statement)
        print(f"🎭 Mood: {mood} ({mood_confidence}%)")
        print(f"🖼️  Using GPT-generated image prompts: {result['image_prompts']}")

        # 🆕 NEW: Generate scientific explanation first
        explanation = story_processor.generate_fact_explanation(statement)
        print(f"🔬 Generated explanation: {explanation}")

        # Generate comic - USING GPT IMAGE PROMPTS AND SCIENTIFIC EXPLANATIONS
        comic_image = generate_comic(result, style, statement)

        # Prepare response - 🆕 NOW INCLUDES EXPLANATION
        response_data = {
            "verdict": result["verdict"],
            "confidence": result["confidence"],
            "description": result["description"],
            "mood": mood,
            "moodConfidence": mood_confidence,
            "comicImage": comic_image,
            "explanation": explanation,  # 🆕 Add explanation to response
            "success": True
        }

        print("✅ Request completed successfully!")
        return jsonify(response_data)

    except Exception as e:
        print(f"❌ Server error: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error", "success": False}), 500

@app.route("/api/generate-explanation", methods=["POST"])
def generate_explanation():
    """Generate four-step scientific explanation for a fact"""
    try:
        data = request.get_json()
        fact = data.get('fact', '').strip()
        
        if not fact:
            return jsonify({'error': 'No fact provided'}), 400
        
        print(f"🔬 Generating explanation for: {fact}")
        
        # Call the explanation generator from story_processor
        explanation = story_processor.generate_fact_explanation(fact)
        
        if explanation:
            return jsonify({
                'success': True,
                'fact': fact,
                'explanation': explanation
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to generate explanation'
            }), 500
            
    except Exception as e:
        print(f"❌ Explanation generation error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


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
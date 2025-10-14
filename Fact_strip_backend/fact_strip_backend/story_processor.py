import openai
import os
import json

class StoryProcessor:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
    
    def split_into_panels(self, statement, verdict, confidence, story):
        """Generate specific, factual dialogues for each panel"""
        try:
            print(f"🎭 Generating specific dialogues for: {statement}")
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"""You arSe a science educator creating comic dialogues. Create 4 specific, factual panels:

Statement: "{statement}"
Verdict: {verdict} ({confidence}% confidence)
Scientific Facts: {story}

Return EXACTLY 4 dialogue panels as a JSON array. Each should be:
- Panel 1: Question/curiosity about the statement
- Panel 2: Scientific investigation/explanation
- Panel 3: Specific evidence/findings
- Panel 4: Clear conclusion with verdict

Make dialogues:
- Specific to the scientific topic
- Educational and accurate
- Natural conversational tone
- Short (1-2 sentences max per panel)
- Include the confidence percentage in the conclusion

Example format: ["dialogue 1", "dialogue 2", "dialogue 3", "dialogue 4"]"""},
                    {"role": "user", "content": f"Create comic dialogues for: {statement}"}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            result = response.choices[0].message.content.strip()
            print(f"✅ Generated dialogues: {result}")
            
            # Parse the JSON response
            dialogues = json.loads(result)
            
            # Ensure we have exactly 4 panels
            if len(dialogues) == 4:
                return dialogues
            else:
                # Fallback if wrong format
                return self._create_fallback_panels(statement, verdict, confidence)
                
        except Exception as e:
            print(f"❌ Dialogue generation failed: {e}")
            return self._create_fallback_panels(statement, verdict, confidence)
    
    def generate_fact_explanation(self, fact):
        """
        Generates four sequential explanation steps for a given fact using OpenAI GPT
        Returns: {step1, step2, step3, step4} or None if error
        """
        try:
            print(f"🔬 Generating explanation for: {fact}")
            
            prompt = f"""
You are a science educator creating content for a comic strip. Your task is to explain why a given fact is true or false in exactly four short, sequential, and easy-to-understand steps. Each step should be one sentence and fit inside a small speech bubble.

Fact: "{fact}"

Provide the explanation as a JSON object with four properties, labeled "step1" to "step4".

Example for "Water is blue":
{{
  "step1": "Sunlight contains a full spectrum of colors.",
  "step2": "Water molecules absorb the warmer red and yellow light wavelengths.",
  "step3": "The cooler blue light is scattered back in all directions.",
  "step4": "This scattered blue light is what our eyes perceive."
}}

Provide only the JSON response, no other text.
"""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful science educator that outputs only JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            # Extract the JSON response
            content = response.choices[0].message.content.strip()
            explanation_data = json.loads(content)
            
            print(f"✅ Generated explanation: {explanation_data}")
            return explanation_data
            
        except Exception as e:
            print(f"❌ Explanation generation failed: {e}")
            return None
    
    def _create_fallback_panels(self, statement, verdict, confidence):
        """Create better fallback panels"""
        return [
            f"Is it true that {statement}? Let's investigate!",
            f"Researching the scientific facts about this claim...",
            f"Here's what the evidence shows us about this topic",
            f"VERDICT: {verdict.upper()}! {confidence}% confident based on scientific evidence"
        ]

# Create global instance
story_processor = StoryProcessor()
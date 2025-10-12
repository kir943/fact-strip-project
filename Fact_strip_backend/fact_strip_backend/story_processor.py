import openai
import os

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
                    {"role": "system", "content": f"""You are a science educator creating comic dialogues. Create 4 specific, factual panels:

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
            import json
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
    
    def _create_fallback_panels(self, statement, verdict, confidence):
        """Create better fallback panels"""
        return [
            f"Is it true that {statement}? Let's investigate!",
            f"Researching the scientific facts about this claim...",
            f"Here's what the evidence shows us about this topic",
            f"VERDICT: {verdict.upper()}! {confidence}% confident based on scientific evidence"
        ]
class StoryProcessor:
    def split_into_panels(self, statement, verdict, confidence, description):
        """Create 4-panel story flow with actual dialogue explaining facts"""
        
        # Extract key facts for dialogue
        facts = self._extract_facts_from_description(description)
        
        # Panel 1: Introduction with question
        panel1 = f"Did you know? {statement}"
        
        # Panel 2: First fact explanation  
        panel2 = f"{facts[0] if facts else 'This is actually really interesting!'}"
        
        # Panel 3: Detailed explanation
        panel3 = f"{facts[1] if len(facts) > 1 else 'The evidence clearly supports this!'}"
        
        # Panel 4: Conclusion with verdict
        verdict_text = "✅ TRUE" if verdict == "true" else "❌ FALSE" if verdict == "false" else "❓ NEEDS MORE INFO"
        confidence_text = f"{confidence}% confident" if confidence > 70 else "needs verification"
        panel4 = f"{verdict_text}! {confidence_text}. {facts[2] if len(facts) > 2 else 'Learning new things every day!'}"
        
        return [panel1, panel2, panel3, panel4]
    
    def _extract_facts_from_description(self, description):
        """Extract key facts for dialogue from the description"""
        # Split into sentences and take the most important ones
        sentences = [s.strip() for s in description.split('. ') if s.strip()]
        
        # Filter out very short sentences and select key facts
        facts = []
        for sentence in sentences:
            if len(sentence) > 15 and len(facts) < 3:
                # Make it more conversational
                conversational = sentence.replace("Bees", "Bees actually").replace("This", "This amazing fact")
                facts.append(conversational)
        
        # Ensure we have at least 3 facts
        while len(facts) < 3:
            facts.append("This shows how amazing nature can be!")
        
        return facts

story_processor = StoryProcessor()
from PIL import Image, ImageDraw, ImageFont
import textwrap
import base64
from io import BytesIO
import requests

class ComicGenerator:
    def __init__(self):
        self.panel_width = 400
        self.panel_height = 400
        self.comic_width = 800
        self.comic_height = 800
    
    def generate_comic_panels(self, style, dialogues, image_prompts, statement):
        """Generate comic using SINGLE comic strip approach for consistency"""
        print(f"🎨 Generating comic with SINGLE-STRIP approach...")
        
        try:
            # Try the single-strip approach first
            comic_image = self.generate_single_comic_strip(style, dialogues, image_prompts, statement)
            if comic_image:
                return comic_image
            else:
                # Fallback to individual panels
                return self._generate_individual_panels(style, dialogues, image_prompts, statement)
                
        except Exception as e:
            print(f"❌ Comic generation failed: {e}")
            return self._create_fallback_comic(style, dialogues)

    def generate_single_comic_strip(self, style, dialogues, image_prompts, statement):
        """Generate ONE single comic strip image and divide into 4 panels"""
        try:
            # Create ONE comprehensive prompt for the entire comic strip
            comic_prompt = self._create_single_comic_prompt(style, dialogues, image_prompts, statement)
            print(f"📝 Single comic prompt: {comic_prompt[:150]}...")
            
            # Generate ONE image containing all 4 panels
            image_url = self._generate_single_comic_image(comic_prompt, style)
            
            if image_url:
                response = requests.get(image_url, timeout=30)
                if response.status_code == 200:
                    full_comic = Image.open(BytesIO(response.content))
                    
                    # Divide the single image into 4 panels
                    panels = self._divide_into_panels(full_comic)
                    
                    # Add speech bubbles to each panel
                    final_panels = []
                    for i, (panel, dialogue) in enumerate(zip(panels, dialogues)):
                        panel_with_bubble = self._add_speech_bubble_to_panel(panel, dialogue)
                        final_panels.append(panel_with_bubble)
                    
                    # Create final comic grid
                    final_comic = self._create_2x2_comic_layout(final_panels)
                    comic_base64 = self.image_to_base64(final_comic)
                    
                    print("✅ Single comic strip generated successfully!")
                    return [f"data:image/png;base64,{comic_base64}"]
            
            return None
            
        except Exception as e:
            print(f"❌ Single comic strip failed: {e}")
            return None

    def _create_single_comic_prompt(self, style, dialogues, image_prompts, statement):
        """Create ONE prompt for a complete 4-panel comic strip"""
        
        style_descriptions = {
            'anime/manga': "Japanese anime manga style, vibrant colors, consistent cartoon characters",
            'newspaper': "Black and white newspaper comic strip, classic comic style, grayscale", 
            'normal': "Educational comic strip, clear visual storytelling, professional artwork, bright colors"
        }
        
        base_style = style_descriptions.get(style, "Educational comic strip")
        
        # Combine all image prompts into one coherent story
        story_summary = " | ".join([prompt for prompt in image_prompts])
        
        single_prompt = f"""
        Create a complete 4-panel educational comic strip in one horizontal image.
        
        Topic: {statement}
        Style: {base_style}
        
        Requirements:
        - All 4 panels in one horizontal image
        - Consistent characters throughout all panels
        - Clear sequential storytelling from left to right
        - Bright, clear colors (unless black and white style)
        - Educational comic style
        - Simple backgrounds
        - Clear visual storytelling
        
        Story flow: {story_summary}
        
        Format: Four equal panels arranged horizontally in one image
        """
        
        return single_prompt.strip()

    def _generate_single_comic_image(self, prompt, style):
        """Generate one single comic strip image"""
        try:
            from replicate import Client
            import os
            
            client = Client(api_token=os.environ.get("REPLICATE_API_TOKEN"))
            
            # Use a model that might handle comics better
            model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
            
            # Wider image for 4 panels
            input_params = {
                "prompt": f"clear comic strip, 4 panels horizontal, consistent characters, {prompt}",
                "width": 1600,  # Wide enough for 4 panels
                "height": 400,
                "num_outputs": 1,
                "guidance_scale": 7.5,
                "num_inference_steps": 30,
                "negative_prompt": "blurry, text, watermark, signature, ugly, deformed, inconsistent characters, multiple images, vertical"
            }
            
            if style == "newspaper":
                input_params["negative_prompt"] += ", color, colorful"
            
            print(f"🤖 Generating single comic strip...")
            output = client.run(model, input=input_params)
            
            return output[0] if output else None
            
        except Exception as e:
            print(f"❌ Single comic generation error: {e}")
            return None

    def _divide_into_panels(self, full_comic_image):
        """Divide a wide comic strip into 4 equal panels"""
        width, height = full_comic_image.size
        panel_width = width // 4
        
        panels = []
        for i in range(4):
            left = i * panel_width
            right = left + panel_width
            panel = full_comic_image.crop((left, 0, right, height))
            # Resize to standard panel size
            panel = panel.resize((self.panel_width, self.panel_height), Image.Resampling.LANCZOS)
            panels.append(panel)
        
        return panels

    def _generate_individual_panels(self, style, dialogues, image_prompts, statement):
        """Fallback: Generate individual panels (original approach)"""
        print("🔄 Using individual panel generation...")
        
        panel_images = []
        for i, (dialogue, gpt_image_prompt) in enumerate(zip(dialogues, image_prompts)):
            print(f"  Generating Panel {i+1}...")
            
            # Enhance GPT's prompt with style and comic format
            final_prompt = self._enhance_prompt_with_style(gpt_image_prompt, style, i)
            
            image_url = self._generate_single_panel(final_prompt, style)
            if image_url:
                try:
                    response = requests.get(image_url, timeout=30)
                    if response.status_code == 200:
                        image = Image.open(BytesIO(response.content))
                        image_with_bubble = self._add_speech_bubble_to_panel(image, dialogue)
                        panel_images.append(image_with_bubble)
                    else:
                        panel_images.append(self._create_fallback_panel_image(dialogue, style, i))
                except:
                    panel_images.append(self._create_fallback_panel_image(dialogue, style, i))
            else:
                panel_images.append(self._create_fallback_panel_image(dialogue, style, i))
        
        # Create final comic
        final_comic = self._create_2x2_comic_layout(panel_images)
        comic_base64 = self.image_to_base64(final_comic)
        
        return [f"data:image/png;base64,{comic_base64}"]

    def _create_fallback_comic(self, style, dialogues):
        """Create a simple fallback comic"""
        print("🔄 Using basic fallback comic...")
        panels = []
        for i, dialogue in enumerate(dialogues):
            panel = self._create_fallback_panel_image(dialogue, style, i)
            panels.append(panel)
        
        final_comic = self._create_2x2_comic_layout(panels)
        comic_base64 = self.image_to_base64(final_comic)
        return [f"data:image/png;base64,{comic_base64}"]

    def _enhance_prompt_with_style(self, gpt_prompt, style, panel_index):
        """Enhance GPT's prompt with style-specific details"""
        
        style_enhancements = {
            'anime/manga': "Japanese anime manga style, vibrant colors, expressive characters",
            'newspaper': "Black and white newspaper comic style, grayscale, classic comic art",
            'normal': "Educational comic style, clear visual storytelling, professional artwork"
        }
        
        base_style = style_enhancements.get(style, style_enhancements['normal'])
        
        final_prompt = f"{gpt_prompt}. {base_style}. Single comic panel. Clear space at top for speech bubble."
        
        if style == "newspaper":
            final_prompt += " Black and white, grayscale only, no color."
        elif style == "anime/manga":
            final_prompt += " Anime style, vibrant colors, expressive emotions."
        
        return final_prompt

    def _generate_single_panel(self, prompt, style):
        """Generate a single panel using Replicate"""
        try:
            from replicate import Client
            import os
            
            client = Client(api_token=os.environ.get("REPLICATE_API_TOKEN"))
            
            model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
            
            input_params = {
                "prompt": prompt,
                "width": self.panel_width,
                "height": self.panel_height,
                "num_outputs": 1,
                "guidance_scale": 7.5,
                "num_inference_steps": 30,
            }
            
            negative_prompt = "blurry, low quality, text, watermark, signature, ugly, deformed"
            if style == "newspaper":
                negative_prompt += ", color, colorful"
            
            input_params["negative_prompt"] = negative_prompt
            
            output = client.run(model, input=input_params)
            return output[0] if output else None
                
        except Exception as e:
            print(f"❌ Replicate error: {e}")
            return None

    # KEEP ALL EXISTING HELPER METHODS (they remain the same)
    def _add_speech_bubble_to_panel(self, image, text):
        # ... keep existing implementation ...
        if image.size != (self.panel_width, self.panel_height):
            image = image.resize((self.panel_width, self.panel_height), Image.Resampling.LANCZOS)
        
        draw = ImageDraw.Draw(image)
        
        try:
            font_size = 16 if len(text) < 100 else 14
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("Arial.ttf", 16)
            except:
                font = ImageFont.load_default()
        
        clean_text = self._clean_panel_text(text)
        wrapped_text = textwrap.fill(clean_text, width=25)
        
        bbox = draw.textbbox((0, 0), wrapped_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        bubble_width = min(text_width + 40, self.panel_width - 40)
        bubble_height = min(text_height + 30, 120)
        
        bubble_x = (self.panel_width - bubble_width) // 2
        bubble_y = 15
        
        draw.rounded_rectangle(
            [bubble_x, bubble_y, bubble_x + bubble_width, bubble_y + bubble_height],
            radius=12, 
            fill="white", 
            outline="black", 
            width=2
        )
        
        pointer_x = bubble_x + (bubble_width // 2)
        draw.polygon([
            (pointer_x - 8, bubble_y + bubble_height),
            (pointer_x + 8, bubble_y + bubble_height),
            (pointer_x, bubble_y + bubble_height + 10)
        ], fill="white", outline="black", width=2)
        
        lines = wrapped_text.split('\n')
        line_height = text_height // len(lines) if lines else text_height
        
        for i, line in enumerate(lines):
            line_bbox = draw.textbbox((0, 0), line, font=font)
            line_width = line_bbox[2] - line_bbox[0]
            text_x = bubble_x + (bubble_width - line_width) // 2
            text_y = bubble_y + 15 + (i * line_height)
            
            draw.text((text_x, text_y), line, fill="black", font=font, align="center")
        
        return image

    def _create_fallback_panel_image(self, panel_text, style, panel_index):
        # ... keep existing implementation ...
        image = Image.new('RGB', (self.panel_width, self.panel_height), color=(240, 240, 240))
        draw = ImageDraw.Draw(image)
        
        bg_colors = {
            'anime/manga': (255, 240, 245),
            'newspaper': (220, 220, 220),
            'normal': (235, 245, 255)
        }
        
        bg_color = bg_colors.get(style, (240, 240, 240))
        draw.rectangle([0, 0, self.panel_width, self.panel_height], fill=bg_color)
        
        draw.rectangle([5, 5, self.panel_width-5, self.panel_height-5], outline="black", width=2)
        
        font_large = self._load_best_font(20)
        draw.text((self.panel_width//2 - 30, 20), f"Panel {panel_index + 1}", fill="black", font=font_large)
        
        image_with_bubble = self._add_speech_bubble_to_panel(image, panel_text)
        return image_with_bubble

    def _create_2x2_comic_layout(self, panel_images):
        # ... keep existing implementation ...
        comic = Image.new('RGB', (self.comic_width, self.comic_height), color='white')
        
        positions = [
            (0, 0),
            (self.panel_width, 0),
            (0, self.panel_height),
            (self.panel_width, self.panel_height)
        ]
        
        for i, (x, y) in enumerate(positions):
            if i < len(panel_images):
                panel = panel_images[i].resize((self.panel_width, self.panel_height), Image.Resampling.LANCZOS)
                comic.paste(panel, (x, y))
        
        draw = ImageDraw.Draw(comic)
        draw.line([(self.panel_width, 0), (self.panel_width, self.comic_height)], fill='black', width=3)
        draw.line([(0, self.panel_height), (self.comic_width, self.panel_height)], fill='black', width=3)
        draw.rectangle([0, 0, self.comic_width-1, self.comic_height-1], outline='black', width=4)
        
        return comic

    def _load_best_font(self, size=12):
        try:
            return ImageFont.truetype("arial.ttf", size)
        except:
            try:
                return ImageFont.truetype("Arial.ttf", size)
            except:
                return ImageFont.load_default()
    
    def _clean_panel_text(self, text):
        clean = text.replace('Panel 1:', '').replace('Panel 2:', '').replace('Panel 3:', '').replace('Panel 4:', '')
        clean = clean.replace('\n', ' ').strip()
        if len(clean) > 120:
            clean = clean[:117] + "..."
        return clean
    
    def image_to_base64(self, image):
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()

# Create global instance
comic_generator = ComicGenerator()
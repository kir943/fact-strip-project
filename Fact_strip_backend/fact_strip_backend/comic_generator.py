from PIL import Image, ImageDraw, ImageFont
import textwrap
import base64
from io import BytesIO
import requests

class ComicGenerator:
    def __init__(self):
        # Replicate requires dimensions divisible by 8 - using better sizes
        self.panel_width = 400    # 400 ÷ 8 = 50 ✓
        self.panel_height = 400   # 400 ÷ 8 = 50 ✓
        self.comic_width = 800    # 800 ÷ 8 = 100 ✓ (2 panels wide)
        self.comic_height = 800   # 800 ÷ 8 = 100 ✓ (2 panels high)
    
    def generate_comic_panels(self, style, panels, statement):
        """Generate ONE single image with 4 panels arranged in 2x2 grid - compatible with backend"""
        print(f"🎨 Generating single comic image with 4 panels...")
        
        try:
            # Generate each panel individually
            panel_images = []
            for i, panel_text in enumerate(panels):
                prompt = self._create_panel_prompt(panel_text, style, i, statement)
                print(f"  Generating Panel {i+1}...")
                
                image_url = self._generate_single_panel(prompt, style)
                if image_url:
                    try:
                        response = requests.get(image_url)
                        if response.status_code == 200:
                            image = Image.open(BytesIO(response.content))
                            image_with_bubble = self._add_speech_bubble_to_panel(image, panel_text)
                            panel_images.append(image_with_bubble)
                        else:
                            panel_images.append(self._create_fallback_panel_image(panel_text, style, i))
                    except:
                        panel_images.append(self._create_fallback_panel_image(panel_text, style, i))
                else:
                    panel_images.append(self._create_fallback_panel_image(panel_text, style, i))
            
            # Create the final single comic image with 2x2 grid
            final_comic = self._create_2x2_comic_layout(panel_images)
            
            # Convert to base64 for web display
            comic_base64 = self.image_to_base64(final_comic)
            
            # Return as array with single element to match backend expectation
            return [f"data:image/png;base64,{comic_base64}"]
            
        except Exception as e:
            print(f"❌ Comic generation failed: {e}")
            # Return fallback as array
            fallback = self._create_fallback_panel_image("Comic generation failed", style, 0)
            fallback_base64 = self.image_to_base64(fallback)
            return [f"data:image/png;base64,{fallback_base64}"]
    
    def _create_fallback_panel_image(self, panel_text, style, panel_index):
        """Create fallback panel as PIL Image (not base64)"""
        image = Image.new('RGB', (self.panel_width, self.panel_height), color=(240, 240, 240))
        draw = ImageDraw.Draw(image)
        
        # Style-based background color
        bg_colors = {
            'anime/manga': (255, 240, 245),
            'newspaper': (220, 220, 220),
            'normal': (235, 245, 255)
        }
        
        bg_color = bg_colors.get(style, (240, 240, 240))
        draw.rectangle([0, 0, self.panel_width, self.panel_height], fill=bg_color)
        
        # Add panel border
        draw.rectangle([5, 5, self.panel_width-5, self.panel_height-5], outline="black", width=2)
        
        # Add panel number
        font_large = self._load_best_font(20)
        draw.text((self.panel_width//2 - 30, 20), f"Panel {panel_index + 1}", fill="black", font=font_large)
        
        # Add speech bubble with text
        image_with_bubble = self._add_speech_bubble_to_panel(image, panel_text)
        
        return image_with_bubble

    def _create_2x2_comic_layout(self, panel_images):
        """Combine 4 panels into one 2x2 grid image"""
        # Create blank canvas for the final comic
        comic = Image.new('RGB', (self.comic_width, self.comic_height), color='white')
        
        # Arrange panels in 2x2 grid
        positions = [
            (0, 0),                    # Panel 1: top-left
            (self.panel_width, 0),     # Panel 2: top-right
            (0, self.panel_height),    # Panel 3: bottom-left
            (self.panel_width, self.panel_height)  # Panel 4: bottom-right
        ]
        
        for i, (x, y) in enumerate(positions):
            if i < len(panel_images):
                # Resize panel to fit the grid
                panel = panel_images[i].resize((self.panel_width, self.panel_height), Image.Resampling.LANCZOS)
                comic.paste(panel, (x, y))
        
        # Add borders between panels
        draw = ImageDraw.Draw(comic)
        # Vertical line
        draw.line([(self.panel_width, 0), (self.panel_width, self.comic_height)], fill='black', width=3)
        # Horizontal line
        draw.line([(0, self.panel_height), (self.comic_width, self.panel_height)], fill='black', width=3)
        # Outer border
        draw.rectangle([0, 0, self.comic_width-1, self.comic_height-1], outline='black', width=4)
        
        return comic

    def _create_panel_prompt(self, panel_text, style, panel_index, statement):
        """Create style-specific prompt for a single panel"""
        
        # Style-specific base prompts
        style_bases = {
            'anime/manga': "Japanese anime manga style, vibrant colors, expressive anime characters, clean line art, detailed background",
            'newspaper': "Black and white newspaper comic style, vintage comic strip, grayscale, classic comic art, ink drawing",
            'normal': "Realistic educational comic style, diverse characters explaining, clear visual storytelling, professional comic art"
        }
        
        # Character descriptions based on statement topic
        topic = statement.lower()
        if 'bee' in topic or 'insect' in topic:
            character = "cute cartoon bees, garden setting, flowers"
        elif 'animal' in topic:
            character = "friendly animals, natural habitat"
        elif 'science' in topic or 'tech' in topic:
            character = "scientists, researchers, lab setting"
        else:
            character = "diverse people, educational setting"
        
        # Panel-specific scene descriptions
        scenes = [
            f"Curious character asking question about '{statement}', thoughtful expression",
            f"Character explaining concept, pointing, teaching gesture", 
            f"Character demonstrating details, showing evidence, visual aids",
            f"Character giving conclusion, satisfied expression, successful resolution"
        ]
        
        base = style_bases.get(style, style_bases['normal'])
        scene = scenes[panel_index] if panel_index < len(scenes) else f"Character explaining: '{panel_text}'"
        
        # Clean panel text for prompt (remove from image since we'll add speech bubbles)
        clean_prompt = f"{base}. {scene}. {character}. Space for speech bubble. Single comic panel."
        
        return clean_prompt
    
    def _generate_single_panel(self, prompt, style):
        """Generate a single panel image using Replicate"""
        try:
            from replicate import Client
            import os
            
            client = Client(api_token=os.environ.get("REPLICATE_API_TOKEN"))
            
            # Use the latest stable SDXL model
            model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
            
            input_params = {
                "prompt": prompt,
                "width": self.panel_width,
                "height": self.panel_height,
                "num_outputs": 1,
                "guidance_scale": 7.5,
                "num_inference_steps": 25
            }
            
            # Style-specific enhancements
            if style == "newspaper":
                input_params["prompt"] += ", black and white, grayscale, newspaper comic style, ink drawing"
                input_params["negative_prompt"] = "color, colorful"
            elif style == "anime/manga":
                input_params["prompt"] += ", anime style, manga, Japanese animation, vibrant colors"
            else:  # normal style
                input_params["prompt"] += ", educational comic style, clear illustration, professional artwork"
            
            print(f"🤖 Generating with SDXL: {prompt[:100]}...")
            output = client.run(model, input=input_params)
            
            return output[0] if output else None
            
        except Exception as e:
            print(f"❌ Replicate error for single panel: {e}")
            return None
    
    def _add_speech_bubble_to_panel(self, image, text):
        """Add speech bubble to a single panel image"""
        # Resize image to standard panel size if needed
        if image.size != (self.panel_width, self.panel_height):
            image = image.resize((self.panel_width, self.panel_height), Image.Resampling.LANCZOS)
        
        draw = ImageDraw.Draw(image)
        font = self._load_best_font(14)
        
        # Clean and wrap text
        clean_text = self._clean_panel_text(text)
        wrapped_text = textwrap.fill(clean_text, width=30)
        
        # Speech bubble position (top of panel)
        bubble_x, bubble_y = 30, 20
        max_width = 340
        max_height = 80
        
        # Calculate text size
        bbox = draw.textbbox((0, 0), wrapped_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Adjust bubble size
        bubble_width = min(text_width + 30, max_width)
        bubble_height = min(text_height + 20, max_height)
        
        # Draw speech bubble with white background and black border
        draw.rounded_rectangle(
            [bubble_x, bubble_y, bubble_x + bubble_width, bubble_y + bubble_height],
            radius=15, fill="white", outline="black", width=3
        )
        
        # Add pointer to character
        pointer_x = bubble_x + 50
        draw.polygon([
            pointer_x, bubble_y + bubble_height,
            pointer_x + 15, bubble_y + bubble_height,
            pointer_x + 8, bubble_y + bubble_height + 12
        ], fill="white", outline="black", width=3)
        
        # Add text centered in bubble
        text_x = bubble_x + 15
        text_y = bubble_y + 10
        draw.text((text_x, text_y), wrapped_text, fill="black", font=font, align="center")
        
        return image
    
    def _load_best_font(self, size=12):
        """Try to load the best available font"""
        try:
            return ImageFont.truetype("arial.ttf", size)
        except:
            try:
                return ImageFont.truetype("Arial.ttf", size)
            except:
                return ImageFont.load_default()
    
    def _clean_panel_text(self, text):
        """Clean panel text for speech bubbles"""
        clean = text.replace('Panel 1:', '').replace('Panel 2:', '').replace('Panel 3:', '').replace('Panel 4:', '')
        clean = clean.replace('\n', ' ').strip()
        # Shorten if too long
        if len(clean) > 120:
            clean = clean[:117] + "..."
        return clean
    
    def image_to_base64(self, image):
        """Convert PIL image to base64"""
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()

# Create global instance
comic_generator = ComicGenerator()
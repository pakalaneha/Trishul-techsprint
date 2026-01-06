import google.generativeai as genai
from PIL import Image
import io
import json
from backend.config import Config

class GeminiService:
    @staticmethod
    def get_model():
        genai.configure(api_key=Config.GEMINI_API_KEY)
        return genai.GenerativeModel('gemini-1.5-flash')

    @staticmethod
    def analyze_image(image_bytes, prompt):
        try:
            model = GeminiService.get_model()
            img = Image.open(io.BytesIO(image_bytes))
            
            response = model.generate_content([prompt, img])
            # Check if response has valid text
            if response.candidates and response.candidates[0].content.parts:
                text = response.candidates[0].content.parts[0].text
                print(f"DEBUG Gemini Raw Output: {text}")
                return text
            else:
                print(f"DEBUG Gemini Error: No content returned. Feedback: {response.prompt_feedback}")
                return None
        except Exception as e:
            print(f"ERROR in GeminiService: {e}")
            return None

    @staticmethod
    def analyze_skin_tone(image_bytes):
        prompt = """
        Analyze the skin tone and facial features in this image. 
        Provide a JSON response with the following fields:
        1. 'skin_tone': (e.g., Fair, Light, Medium, Tan, Deep)
        2. 'season': (e.g., Spring, Summer, Autumn, Winter)
        3. 'recommended_colors': A list of 5 hex codes or color names that suit this person.
        4. 'avoid_colors': A list of 3 colors to avoid.
        5. 'description': A brief explanation of the results.
        
        Return ONLY the raw JSON object.
        """
        result = GeminiService.analyze_image(image_bytes, prompt)
        return GeminiService._parse_json(result)

    @staticmethod
    def analyze_body_shape(image_bytes):
        prompt = """
        Analyze the silhouette and body proportions in this image. 
        Provide a JSON response with the following fields:
        1. 'body_shape': (e.g., Hourglass, Pear, Apple, Rectangle, Inverted Triangle)
        2. 'description': A brief explanation of the detected silhouette.
        3. 'styling_tips': A list of 3 quick styling tips for this body shape.
        
        Return ONLY the raw JSON object.
        """
        result = GeminiService.analyze_image(image_bytes, prompt)
        return GeminiService._parse_json(result)

    @staticmethod
    def analyze_skin_health(image_bytes):
        prompt = """
        Analyze the skin texture and condition in this image (skincare focus). 
        Provide a JSON response with the following fields:
        1. 'skin_type': (e.g., Oily, Dry, Combination, Normal, Sensitive)
        2. 'concerns': A list of detected concerns (e.g., acne, redness, dullness).
        3. 'confidence': A number from 1 to 100.
        4. 'description': A brief explanation and general advice.
        
        Return ONLY the raw JSON object.
        """
        result = GeminiService.analyze_image(image_bytes, prompt)
        return GeminiService._parse_json(result)

    @staticmethod
    def _parse_json(text):
        if not text:
            return None
        try:
            # Better extraction for when models add extra conversational text
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1:
                json_text = text[start:end+1]
                return json.loads(json_text)
            
            # Fallback to cleaning markdown
            clean_text = text.replace('```json', '').replace('```', '').strip()
            return json.loads(clean_text)
        except Exception as e:
            print(f"Error parsing Gemini JSON: {e} | Raw Output: {text[:200]}...")
            return None

    @staticmethod
    def get_dummy_skin_tone():
        return {
            "skin_tone": "Medium",
            "season": "Autumn",
            "recommended_colors": ["#E67E22", "#D35400", "#F1C40F", "#27AE60", "#2C3E50"],
            "avoid_colors": ["Neon Pink", "Icy Blue", "Static Grey"],
            "description": "Dummy Data: Warm undertones with earthy richness typical of an Autumn palette."
        }

    @staticmethod
    def get_dummy_body_shape():
        return {
            "body_shape": "Hourglass",
            "description": "Dummy Data: Well-proportioned shoulders and hips with a defined waistline.",
            "styling_tips": [
                "Emphasize the waist with belts or wrap tops.",
                "V-necklines help balance the silhouette.",
                "High-waisted bottoms highlight natural curves."
            ]
        }

    @staticmethod
    def get_dummy_skin_health():
        return {
            "skin_type": "Combination",
            "concerns": ["mild redness", "hydration"],
            "confidence": 95,
            "description": "Dummy Data: Skin appears healthy with slight oily T-zone and dry cheeks."
        }

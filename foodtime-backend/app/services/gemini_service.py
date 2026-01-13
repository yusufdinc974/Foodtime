"""
Google Gemini AI Service
Handles all interactions with Google Gemini API
"""

import google.generativeai as genai
from ..config import settings
from typing import Optional
import base64


class GeminiService:
    """Service for interacting with Google Gemini AI"""
    
    def __init__(self):
        """Initialize Gemini API with API key"""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    async def analyze_daily_meals(
        self,
        morning: str,
        afternoon: str,
        evening: str,
        user_context: Optional[dict] = None,
        meal_history: Optional[list] = None
    ) -> dict:
        """
        Analyze daily meals and provide recommendations
        
        Args:
            morning: Morning meal description
            afternoon: Afternoon meal description
            evening: Evening meal description
            user_context: User profile information
            meal_history: Previous meal history for context
            
        Returns:
            Dictionary with analysis and health score
        """
        prompt = (
            "Yıldız (*) veya hashtag (#) kullanma. Profesyonel paragraflar kur. "
            f"Kullanıcı bugünkü öğünlerini giriyor. "
            f"Sabah: {morning}, Öğle: {afternoon}, Akşam: {evening}. "
            "ÖNEMLİ: Analizin başında şunları belirt: "
            "1) Günün genel SAĞLIK PUANI (örnek: '8/10') "
            "2) Tahmini TOPLAM KALORİ (örnek: 'Kalori: 1850 kcal') "
            "3) Tahmini PROTEIN (örnek: 'Protein: 120g') "
            "4) Tahmini KARBONHİDRAT (örnek: 'Karbonhidrat: 220g') "
            "5) Tahmini YAĞ (örnek: 'Yağ: 65g') "
        )
        
        if meal_history:
            prompt += f"Geçmiş 10 günlük verilere dayanarak analiz yap: {meal_history}. "
        
        prompt += "Bugünü analiz et ve yarın için tam menü ve besin stratejisi öner."
        
        response = self.model.generate_content(prompt)
        result_text = response.text.replace('*', '').replace('#', '')
        
        # Extract health score and nutrition data
        health_score = None
        calories = None
        protein = None
        carbs = None
        fat = None
        
        try:
            import re
            
            # Extract health score
            score_match = re.search(r'(\d+\.?\d*)\s*[/üzerinden]\s*10', result_text)
            if score_match:
                health_score = float(score_match.group(1))
            
            # Extract calories (look for "Kalori: 1850" or "1850 kcal")
            cal_match = re.search(r'(?:Kalori|kalori)[:\s]*(\d+)', result_text, re.IGNORECASE)
            if cal_match:
                calories = float(cal_match.group(1))
            
            # Extract protein (look for "Protein: 120g" or "120 g protein")
            prot_match = re.search(r'(?:Protein|protein)[:\s]*(\d+)', result_text, re.IGNORECASE)
            if prot_match:
                protein = float(prot_match.group(1))
            
            # Extract carbs
            carb_match = re.search(r'(?:Karbonhidrat|karbonhidrat|Karb)[:\s]*(\d+)', result_text, re.IGNORECASE)
            if carb_match:
                carbs = float(carb_match.group(1))
            
            # Extract fat
            fat_match = re.search(r'(?:Yağ|yağ)[:\s]*(\d+)', result_text, re.IGNORECASE)
            if fat_match:
                fat = float(fat_match.group(1))
                
        except Exception as e:
            print(f"Error extracting nutrition data: {e}")
        
        return {
            "analysis": result_text,
            "health_score": health_score,
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fat": fat
        }
    
    async def analyze_food(self, food_description: str) -> dict:
        """
        Analyze specific food or ingredient
        
        Args:
            food_description: Description of food to analyze
            
        Returns:
            Dictionary with analysis and health score
        """
        prompt = (
            "Yıldız (*) veya hashtag (#) kullanma. Profesyonel paragraflar kur. "
            "Kesinlikle şunları yap: "
            "1) Besine 10 üzerinden SAĞLIK PUANI ver. "
            "2) İçindeki YARARLI MADDELERİ açıkla. "
            "3) İçindeki ZARARLI MADDELERİ açıkla. "
            f"Girdi: {food_description}"
        )
        
        response = self.model.generate_content(prompt)
        result_text = response.text.replace('*', '').replace('#', '')
        
        # Try to extract health score from response
        health_score = None
        try:
            # Simple extraction - look for "X/10" or "X üzerinden 10"
            import re
            score_match = re.search(r'(\d+)\s*[/üzerinden]\s*10', result_text)
            if score_match:
                health_score = int(score_match.group(1))
        except:
            pass
        
        return {
            "analysis": result_text,
            "health_score": health_score
        }
    
    async def analyze_photo(self, image_base64: str, mime_type: str = "image/jpeg") -> dict:
        """
        Analyze food from photo
        
        Args:
            image_base64: Base64 encoded image
            mime_type: MIME type of image
            
        Returns:
            Dictionary with analysis and health score
        """
        prompt = (
            "Yıldız (*) veya hashtag (#) kullanma. Profesyonel paragraflar kur. "
            "Kesinlikle görseldeki besine: "
            "1) 10 üzerinden SAĞLIK PUANI ver. "
            "2) İçindeki YARARLI MADDELERİ anlat. "
            "3) İçindeki ZARARLI MADDELERİ anlat."
        )
        
        # Decode base64 to bytes
        image_data = base64.b64decode(image_base64)
        
        # Create image part
        image_part = {
            "mime_type": mime_type,
            "data": image_data
        }
        
        response = self.model.generate_content([prompt, image_part])
        result_text = response.text.replace('*', '').replace('#', '')
        
        # Try to extract health score
        health_score = None
        try:
            import re
            score_match = re.search(r'(\d+)\s*[/üzerinden]\s*10', result_text)
            if score_match:
                health_score = int(score_match.group(1))
        except:
            pass
        
        return {
            "analysis": result_text,
            "health_score": health_score
        }
    
    async def generate_weekly_insights(
        self,
        weekly_meals: list,
        weekly_stats: dict,
        user_goals: dict
    ) -> str:
        """
        Generate AI insights for weekly eating patterns
        
        Args:
            weekly_meals: List of meals for the week
            weekly_stats: Aggregated weekly statistics
            user_goals: User's nutrition goals
            
        Returns:
            AI-generated weekly insights and recommendations
        """
        prompt = (
            "Yıldız (*) veya hashtag (#) kullanma. Profesyonel paragraflar kur. "
            f"Kullanıcının haftalık beslenme verilerini analiz et.\n\n"
            f"Haftalık İstatistikler:\n"
            f"- Ortalama Sağlık Skoru: {weekly_stats.get('avg_health_score', 0)}/10\n"
            f"- Toplam Öğün: {weekly_stats.get('total_meals', 0)}\n"
            f"- Ortalama Günlük Kalori: {weekly_stats.get('avg_calories', 0)} kcal\n"
            f"- Toplam Protein: {weekly_stats.get('total_protein', 0)}g\n"
            f"- Toplam Karbonhidrat: {weekly_stats.get('total_carbs', 0)}g\n"
            f"- Toplam Yağ: {weekly_stats.get('total_fat', 0)}g\n\n"
            f"Kullanıcı Hedefi: {user_goals.get('goal', 'Genel sağlık')}\n"
            f"Günlük Kalori Hedefi: {user_goals.get('daily_calorie_target', 2000)} kcal\n\n"
            "Lütfen şunları yap:\n"
            "1) Haftanın GÜÇLÜ YÖNLERİNİ belirt (başarılar, olumlu alışkanlıklar)\n"
            "2) DİKKAT EDİLMESİ GEREKEN NOKTALARI belirt (aşırılıklar, eksiklikler)\n"
            "3) Gelecek hafta için SOMUT ÖNERİLER sun\n\n"
            "Kısa ve öz tut, motive edici ol."
        )
        
        response = self.model.generate_content(prompt)
        return response.text.replace('*', '').replace('#', '')


# Global service instance
gemini_service = GeminiService()

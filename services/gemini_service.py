"""
Gemini AI Service for InfraBeacon

Handles image analysis using Google's Gemini Vision API.
Detects issue types, classifies severity, and assists in duplicate verification.
"""

import os
import logging
import json
from typing import Optional, Tuple
import base64

# Google Generative AI (Gemini)
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

logger = logging.getLogger(__name__)


# Issue type definitions
ISSUE_TYPES = {
    'pothole': 'Road damage with holes or depressions',
    'broken_light': 'Non-functioning street lights or traffic signals',
    'garbage': 'Accumulated waste, litter, or illegal dumping',
    'waterlogging': 'Standing water, flooding, or drainage issues',
    'other': 'Other infrastructure issues'
}

SEVERITY_LEVELS = {
    'low': 'Minor issue, not urgent',
    'medium': 'Moderate issue, should be addressed soon',
    'high': 'Severe issue, requires immediate attention'
}


class GeminiService:
    """Service class for Gemini AI operations."""
    
    def __init__(self):
        """Initialize Gemini client."""
        self.api_key = os.environ.get('GEMINI_API_KEY', '')
        
        if GEMINI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-3-pro-preview')
                self.enabled = True
                logger.info("Gemini client initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini: {e}")
                self.model = None
                self.enabled = False
        else:
            if not GEMINI_AVAILABLE:
                logger.warning("Gemini SDK not available")
            elif not self.api_key:
                logger.warning("GEMINI_API_KEY not set")
            self.model = None
            self.enabled = False
    
    def analyze_image(self, image_data: bytes, 
                      mime_type: str = 'image/jpeg') -> dict:
        """
        Analyze an image to detect infrastructure issues.
        
        Args:
            image_data: Binary image data
            mime_type: MIME type of the image
        
        Returns:
            Analysis result with issue_type, severity, and description
        """
        if not self.enabled or not self.model:
            # Return mock analysis for development
            return self._mock_analysis()
        
        try:
            # Create the image part for Gemini
            image_part = {
                'mime_type': mime_type,
                'data': base64.b64encode(image_data).decode('utf-8')
            }
            
            # Analysis prompt
            prompt = """Analyze this image and determine if it shows any public infrastructure issue.

Look for these types of issues:
1. pothole - Road damage, holes, or surface depressions
2. broken_light - Non-functioning street lights or traffic signals
3. garbage - Accumulated waste, litter, or illegal dumping
4. waterlogging - Standing water, flooding, or drainage problems
5. other - Other infrastructure problems (specify in description)

If no infrastructure issue is visible, respond with issue_type: "none".

Respond in JSON format:
{
    "issue_type": "pothole|broken_light|garbage|waterlogging|other|none",
    "severity": "low|medium|high",
    "confidence": 0.0-1.0,
    "description": "Brief description of the issue",
    "details": "Additional details about location, size, or urgency"
}

Consider these severity criteria:
- high: Safety hazard, immediate risk to people or vehicles
- medium: Significant inconvenience, should be fixed soon
- low: Minor issue, can be scheduled for routine maintenance"""
            
            # Generate response
            response = self.model.generate_content([prompt, image_part])
            
            # Parse the response
            result = self._parse_analysis_response(response.text)
            logger.info(f"Gemini analysis complete: {result['issue_type']} ({result['severity']})")
            return result
            
        except Exception as e:
            logger.error(f"Gemini analysis failed: {e}")
            return self._mock_analysis(error=str(e))
    
    def analyze_image_from_base64(self, base64_data: str) -> dict:
        """
        Analyze an image from base64-encoded data.
        
        Args:
            base64_data: Base64-encoded image data (with or without data URL prefix)
        
        Returns:
            Analysis result
        """
        try:
            # Detect MIME type and extract base64 data
            mime_type = 'image/jpeg'
            if ',' in base64_data:
                header, base64_data = base64_data.split(',', 1)
                if 'image/png' in header:
                    mime_type = 'image/png'
                elif 'image/gif' in header:
                    mime_type = 'image/gif'
                elif 'image/webp' in header:
                    mime_type = 'image/webp'
            
            # Decode base64
            image_data = base64.b64decode(base64_data)
            
            return self.analyze_image(image_data, mime_type)
            
        except Exception as e:
            logger.error(f"Failed to analyze base64 image: {e}")
            return self._mock_analysis(error=str(e))
    
    def compare_images_for_duplicate(self, image1_data: bytes, 
                                     image2_data: bytes,
                                     distance_meters: float) -> dict:
        """
        Compare two images to determine if they show the same issue.
        
        Args:
            image1_data: First image binary data
            image2_data: Second image binary data
            distance_meters: Distance between the two report locations
        
        Returns:
            Comparison result with is_duplicate and confidence
        """
        if not self.enabled or not self.model:
            # Mock response based on distance
            is_duplicate = distance_meters < 10
            return {
                'is_duplicate': is_duplicate,
                'confidence': 0.7 if is_duplicate else 0.3,
                'reasoning': 'Mock comparison based on proximity'
            }
        
        try:
            image1_part = {
                'mime_type': 'image/jpeg',
                'data': base64.b64encode(image1_data).decode('utf-8')
            }
            image2_part = {
                'mime_type': 'image/jpeg',
                'data': base64.b64encode(image2_data).decode('utf-8')
            }
            
            prompt = f"""Compare these two images of reported infrastructure issues.
They were taken {distance_meters:.1f} meters apart.

Determine if they show the SAME infrastructure issue (duplicate report).

Consider:
1. Is it the same type of issue?
2. Do they appear to show the same physical location/object?
3. Is the issue recognizably the same (same pothole, same broken light, etc.)?

Respond in JSON format:
{{
    "is_duplicate": true|false,
    "confidence": 0.0-1.0,
    "reasoning": "Explanation of your determination"
}}"""
            
            response = self.model.generate_content([prompt, image1_part, image2_part])
            
            return self._parse_duplicate_response(response.text)
            
        except Exception as e:
            logger.error(f"Duplicate comparison failed: {e}")
            return {
                'is_duplicate': distance_meters < 5,
                'confidence': 0.5,
                'reasoning': f'Fallback comparison due to error: {str(e)}'
            }
    
    def _parse_analysis_response(self, response_text: str) -> dict:
        """Parse the analysis response from Gemini."""
        try:
            # Try to extract JSON from the response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                result = json.loads(json_str)
                
                # Validate and normalize
                issue_type = result.get('issue_type', 'other').lower()
                if issue_type not in ISSUE_TYPES and issue_type != 'none':
                    issue_type = 'other'
                
                severity = result.get('severity', 'medium').lower()
                if severity not in SEVERITY_LEVELS:
                    severity = 'medium'
                
                return {
                    'issue_type': issue_type,
                    'severity': severity,
                    'confidence': float(result.get('confidence', 0.5)),
                    'description': result.get('description', 'Infrastructure issue detected'),
                    'details': result.get('details', ''),
                    'ai_analyzed': True
                }
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Failed to parse Gemini response: {e}")
        
        # Default response if parsing fails
        return self._mock_analysis()
    
    def _parse_duplicate_response(self, response_text: str) -> dict:
        """Parse the duplicate comparison response from Gemini."""
        try:
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                result = json.loads(json_str)
                
                return {
                    'is_duplicate': bool(result.get('is_duplicate', False)),
                    'confidence': float(result.get('confidence', 0.5)),
                    'reasoning': result.get('reasoning', 'AI comparison')
                }
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Failed to parse duplicate response: {e}")
        
        return {
            'is_duplicate': False,
            'confidence': 0.5,
            'reasoning': 'Unable to determine'
        }
    
    def _mock_analysis(self, error: Optional[str] = None) -> dict:
        """Return a mock analysis result for development."""
        return {
            'issue_type': 'pothole',
            'severity': 'medium',
            'confidence': 0.8,
            'description': 'Potential infrastructure issue detected',
            'details': 'AI analysis not available - using placeholder',
            'ai_analyzed': False,
            'error': error
        }


# Singleton instance
_gemini_service = None


def get_gemini_service() -> GeminiService:
    """Get or create the Gemini service singleton."""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service

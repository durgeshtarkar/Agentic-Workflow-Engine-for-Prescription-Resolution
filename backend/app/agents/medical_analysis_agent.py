import pytesseract
from PIL import Image
import io

def run_processing_agent(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except:
        return "OCR failed"

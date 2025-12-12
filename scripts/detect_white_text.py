import fitz  # PyMuPDF
import sys
import json

def detect_white_text(pdf_path):
    """
    Scans a PDF for text that matches the background color (usually white).
    Returns a list of suspicious text blocks.
    """
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    suspicious_content = []

    for page_num, page in enumerate(doc):
        # get text dictionaries
        blocks = page.get_text("dict")["blocks"]
        
        for b in blocks:
            if "lines" in b:
                for line in b["lines"]:
                    for span in line["spans"]:
                        # Setup: Check color.
                        # fitz color is often an int or tuple.
                        # White in int (sRGB) is usually 16777215 (0xFFFFFF)
                        # or extremely close to page background.
                        
                        color = span["color"]
                        text = span["text"].strip()
                        
                        # logic: if color is white (or very close) AND text is not empty
                        if color == 16777215 and len(text) > 0:
                            suspicious_content.append({
                                "page": page_num + 1,
                                "text": text,
                                "type": "white_text_exact"
                            })
                            
                        # Also check for tiny font size (another cheat)
                        if span["size"] < 1.0 and len(text) > 0:
                             suspicious_content.append({
                                "page": page_num + 1,
                                "text": text,
                                "type": "tiny_font"
                            })

    if suspicious_content:
        result = {
            "status": "CHEATER_DETECTED",
            "details": suspicious_content
        }
        print(json.dumps(result, indent=2))
        sys.exit(1) # Fail the process for this candidate
    else:
        print(json.dumps({"status": "CLEAN"}, indent=2))
        sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python detect_white_text.py <pdf_path>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    detect_white_text(pdf_path)

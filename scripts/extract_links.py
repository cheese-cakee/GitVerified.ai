import fitz  # PyMuPDF
import re
import sys
import json

def extract_links(pdf_path):
    """
    Extracts GitHub and LeetCode URLs from a PDF file.
    """
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(json.dumps({"error": f"Failed to open PDF: {str(e)}"}))
        return

    text_content = ""
    for page in doc:
        text_content += page.get_text()

    # Regex patterns
    # Captures github.com/username or github.com/username/repo
    github_pattern = r"(https?://)?(www\.)?github\.com/[a-zA-Z0-9_-]+(/[a-zA-Z0-9._-]+)*"
    
    # Captures leetcode.com/username or /u/username
    leetcode_pattern = r"(https?://)?(www\.)?leetcode\.com/(u/)?[a-zA-Z0-9_-]+"

    github_matches = list(set(re.findall(github_pattern, text_content)))
    leetcode_matches = list(set(re.findall(leetcode_pattern, text_content)))
    
    # Clean up regex results (findall returns tuples if groups are present)
    # Re-running search to get full strings or handling tuple output
    
    # Simplified approach using finditer for cleaner full match extraction
    github_urls = [m.group(0) for m in re.finditer(github_pattern, text_content)]
    leetcode_urls = [m.group(0) for m in re.finditer(leetcode_pattern, text_content)]

    # Deduplicate
    github_urls = list(set(github_urls))
    leetcode_urls = list(set(leetcode_urls))

    result = {
        "file": pdf_path,
        "github_links": github_urls,
        "leetcode_links": leetcode_urls,
        "raw_text_snippet": text_content[:200] + "..." # Preview
    }
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_links.py <pdf_path>")
        sys.exit(1)
        
    extract_links(sys.argv[1])

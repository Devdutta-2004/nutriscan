import os, glob, re, json
from pypdf import PdfReader

PDF_DIR = "docs/official_gazettes"
OUTPUT_FILE = "backend/app/rag/extracted_gazettes.json"

pdf_paths = glob.glob(os.path.join(PDF_DIR, "*.pdf"))
print(f"Total PDFs found: {len(pdf_paths)}")

all_documents = []

for idx, p in enumerate(pdf_paths, 1):
    fname = os.path.basename(p)
    try:
        reader = PdfReader(p)
        num_pages = len(reader.pages)
        full_text = []
        for page in reader.pages:
            t = page.extract_text() or ""
            full_text.append(t)
        
        combined_text = "\n".join(full_text)
        
        # Detect Gazette ref
        gsr_match = re.search(r'G\.?\s*S\.?\s*R\.?\s*(\d+[\s\(\)A-Za-z]*)', combined_text, re.IGNORECASE)
        gazette_ref = gsr_match.group(0).strip() if gsr_match else "Official Gazette Notification"
        
        # Detect date
        date_match = re.search(r'dated\s+the\s+(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+\d{4})', combined_text, re.IGNORECASE)
        gazette_date = date_match.group(1).strip() if date_match else ""
        
        all_documents.append({
            "filename": fname,
            "pages": num_pages,
            "gazette_ref": gazette_ref,
            "gazette_date": gazette_date,
            "text_length": len(combined_text),
            "text": combined_text
        })
    except Exception as e:
        print(f"Error reading {fname}: {e}")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(all_documents, f, indent=2, ensure_ascii=False)

print(f"Successfully processed {len(all_documents)} documents into {OUTPUT_FILE}!")

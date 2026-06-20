from pathlib import Path

import fitz
from docx import Document


ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


def clean_extracted_text(text: str) -> str:
    return (
        text.replace("\x00", "")
        .replace("\u0000", "")
        .strip()
    )


def extract_text_from_uploaded_file(uploaded_file) -> str:
    suffix = Path(uploaded_file.name).suffix.lower()

    if suffix not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported file type. Only PDF, DOCX, and TXT are allowed.")

    if suffix == ".pdf":
        text = extract_pdf_text(uploaded_file)
    elif suffix == ".docx":
        text = extract_docx_text(uploaded_file)
    else:
        text = extract_txt_text(uploaded_file)

    return clean_extracted_text(text)


def extract_pdf_text(uploaded_file) -> str:
    uploaded_file.seek(0)
    file_bytes = uploaded_file.read()

    text_parts = []

    with fitz.open(stream=file_bytes, filetype="pdf") as document:
        for page in document:
            page_text = page.get_text("text")
            if page_text:
                text_parts.append(page_text.strip())

    return "\n\n".join(text_parts)


def extract_docx_text(uploaded_file) -> str:
    uploaded_file.seek(0)

    document = Document(uploaded_file)

    paragraphs = [
        paragraph.text.strip()
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    return "\n\n".join(paragraphs)


def extract_txt_text(uploaded_file) -> str:
    uploaded_file.seek(0)
    raw = uploaded_file.read()

    if isinstance(raw, bytes):
        return raw.decode("utf-8", errors="ignore")

    return str(raw)
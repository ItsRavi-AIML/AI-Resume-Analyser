from io import BytesIO

import pdfplumber
from docx import Document
from fastapi import UploadFile


async def extract_resume_text(file: UploadFile) -> str:
    content = await file.read()
    name = (file.filename or "").lower()

    if name.endswith(".pdf"):
        return _extract_pdf(content)
    if name.endswith(".docx"):
        return _extract_docx(content)

    raise ValueError("Unsupported file type. Upload a PDF or DOCX resume.")


def _extract_pdf(content: bytes) -> str:
    with pdfplumber.open(BytesIO(content)) as pdf:
        pages = [page.extract_text(x_tolerance=1, y_tolerance=3) or "" for page in pdf.pages]
    return "\n".join(pages).strip()


def _extract_docx(content: bytes) -> str:
    document = Document(BytesIO(content))
    paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
    return "\n".join(paragraphs).strip()

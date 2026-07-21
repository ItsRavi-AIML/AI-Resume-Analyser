<div align="center">

# 🧠 EduMind AI

### *Transform Notes into Knowledge*

**An AI-powered study assistant that lets students upload PDFs, chat with their notes, generate summaries, create quizzes and flashcards — and learn smarter using RAG, semantic search, and cutting-edge NLP.**

<br/>

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-App-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-Powered-121212?style=for-the-badge&logo=chainlink&logoColor=white)
![RAG](https://img.shields.io/badge/RAG-Architecture-8A2BE2?style=for-the-badge)
![NLP](https://img.shields.io/badge/NLP-Enabled-09A3D5?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open%20Source-❤️-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

<br/>

> 📚 *Stop passively reading. Start actively learning. EduMind AI turns your study material into an intelligent, interactive knowledge system — available 24/7.*

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features)
- [Demo Workflow](#-demo-workflow)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🧩 Overview

Students today are overwhelmed — with dense textbooks, lengthy lecture slides, and limited time to absorb everything. Traditional studying is passive, inefficient, and often frustrating.

**EduMind AI** changes that.

It is a full-stack AI study assistant that transforms raw study material into an interactive, intelligent learning experience:

- 📄 **Upload any PDF** — textbooks, notes, research papers, slides
- 💬 **Chat with your documents** — ask questions in plain English, get instant answers grounded in your material
- 🧾 **Auto-generate summaries** — extract key insights in seconds
- 🧪 **Create quizzes** — test your understanding with AI-generated questions
- 🃏 **Build flashcards** — spaced repetition-ready study cards from your notes
- 🔍 **Semantic search** — find relevant content even when you don't use the exact words

Built on **Retrieval-Augmented Generation (RAG)**, EduMind AI doesn't hallucinate — it answers from *your* documents, giving you accurate, grounded, contextual responses every time.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 📄 **PDF Upload** | Upload single or multiple PDFs for instant processing |
| 💬 **Chat with PDFs** | Ask natural language questions and get context-aware answers |
| 🧾 **AI Summarization** | Generate concise summaries of chapters, sections, or full documents |
| 🔍 **Semantic Search** | Find relevant content using meaning-based search, not just keywords |
| 🧪 **Quiz Generation** | Auto-generate MCQs and short-answer questions from your material |
| 🃏 **Flashcard Creation** | Create study-ready flashcards from key concepts and definitions |
| 💡 **AI Concept Explanation** | Get plain-English explanations of complex topics from your notes |
| 📝 **Smart Revision Notes** | Extract bullet-point revision notes optimized for quick review |
| ❓ **Important Question Prediction** | AI predicts likely exam questions based on document content |
| 🎯 **Personalized Learning** | Adaptive responses tailored to what you've uploaded and asked |

---

## 🔄 Demo Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EduMind AI — Pipeline                         │
└─────────────────────────────────────────────────────────────────────┘

  📄 Upload PDF
       │
       ▼
  📖 Text Extraction (PDFPlumber / PyPDF)
       │
       ▼
  ✂️  Text Chunking (LangChain RecursiveCharacterTextSplitter)
       │
       ▼
  🔢 Embedding Generation (Sentence Transformers)
       │
       ▼
  🗄️  Vector Storage (FAISS)
       │
       ▼
  🔍 Semantic Retrieval (Top-K similarity search)
       │
       ▼
  🤖 LLM Response Generation (OpenAI API / Ollama)
       │
       ▼
  💬 Answer · Summary · Quiz · Flashcards
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | `Streamlit` | Interactive web UI |
| **Backend** | `Python 3.10+` | Core logic and pipeline orchestration |
| **LLM Framework** | `LangChain` | RAG pipeline, chains, and prompt management |
| **Embeddings** | `Sentence Transformers` | Semantic vector generation |
| **Vector Database** | `FAISS` | Fast similarity search and retrieval |
| **LLM** | `OpenAI API` / `Ollama` | Answer generation and text understanding |
| **PDF Processing** | `PDFPlumber` + `PyPDF` | Text extraction from PDF documents |
| **Search** | `Semantic Search` | Meaning-based document retrieval |

</div>

---

## 🏗️ Architecture

EduMind AI is built on a **Retrieval-Augmented Generation (RAG)** architecture — a proven pattern that combines the precision of document retrieval with the power of large language models.

### How It Works

**① PDF Ingestion**
When a PDF is uploaded, EduMind AI uses `PDFPlumber` and `PyPDF` to extract raw text, preserving structure across headings, paragraphs, and tables.

**② Text Chunking**
The extracted text is split into overlapping chunks using LangChain's `RecursiveCharacterTextSplitter`. Overlapping ensures no context is lost at chunk boundaries.

**③ Embedding Generation**
Each chunk is converted into a high-dimensional vector using `Sentence Transformers`. These vectors capture the *semantic meaning* of the text — not just its keywords.

**④ Vector Storage (FAISS)**
All embeddings are stored in a FAISS vector index — an ultra-fast in-memory vector database optimized for similarity search at scale.

**⑤ Semantic Retrieval**
When a user asks a question, the query is also embedded and compared against the stored vectors. The top-K most semantically similar chunks are retrieved as context.

**⑥ LLM Response Generation**
The retrieved chunks + user query are passed to the LLM (OpenAI or Ollama) via a LangChain prompt chain. The model generates a grounded, accurate response — with no hallucination, because it's anchored to your documents.

```
User Query
    │
    ▼
Query Embedding → FAISS Similarity Search → Top-K Chunks
                                                  │
                                                  ▼
                                     LangChain Prompt Chain
                                                  │
                                                  ▼
                                        LLM (OpenAI / Ollama)
                                                  │
                                                  ▼
                                         Grounded AI Response
```

---

## 📁 Folder Structure

```
Edumind-AI/
│
├── app.py                          # Main Streamlit application entry point
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variable template
├── README.md                       # Project documentation
├── LICENSE                         # MIT License
│
├── core/
│   ├── __init__.py
│   ├── pdf_processor.py            # PDF text extraction (PDFPlumber + PyPDF)
│   ├── chunker.py                  # Text splitting and chunking logic
│   ├── embedder.py                 # Sentence Transformer embedding generation
│   ├── vector_store.py             # FAISS index creation and retrieval
│   └── rag_pipeline.py             # LangChain RAG chain orchestration
│
├── features/
│   ├── __init__.py
│   ├── summarizer.py               # AI summarization module
│   ├── quiz_generator.py           # Quiz and MCQ generation
│   ├── flashcard_generator.py      # Flashcard creation module
│   ├── question_predictor.py       # Important question prediction
│   └── revision_notes.py           # Smart revision note generation
│
├── ui/
│   ├── components.py               # Reusable Streamlit UI components
│   ├── layout.py                   # Page layout and sidebar
│   └── styles.py                   # Custom CSS styling
│
├── uploads/                        # Temporary PDF upload storage
│   └── .gitkeep
│
├── vector_db/                      # Persisted FAISS vector indexes
│   └── .gitkeep
│
├── utils/
│   ├── helpers.py                  # General utility functions
│   ├── validators.py               # Input validation
│   └── exporters.py                # Export results to PDF/JSON
│
└── tests/
    ├── test_pdf_processor.py
    ├── test_embedder.py
    ├── test_rag_pipeline.py
    └── test_quiz_generator.py
```

---

## 🚀 Installation

### Prerequisites

- Python 3.10 or higher
- pip
- Git
- OpenAI API key **or** Ollama installed locally

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ItsRavi-AIML/Edumind-AI.git
cd Edumind-AI
```

### Step 2 — Create a Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### Step 3 — Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4 — Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Open `.env` and add your API key:

```env
OPENAI_API_KEY=your_openai_api_key_here

# If using Ollama instead (local, free)
OLLAMA_MODEL=llama3
```

> 💡 **Don't have an OpenAI key?** You can run EduMind AI fully locally using [Ollama](https://ollama.com/) — no API key required.

### Step 5 — Run the Application

```bash
streamlit run app.py
```

> The app opens automatically at `http://localhost:8501`

---

## 📖 Usage

**Step 1 — Upload Your Study Material**
> Navigate to the Upload section. Select one or more PDF files — textbooks, lecture notes, research papers, anything.

**Step 2 — Process the Document**
> Click **"Process PDF"**. EduMind AI extracts text, chunks it, generates embeddings, and builds a FAISS vector index — all in seconds.

**Step 3 — Chat with Your Notes**
> Go to the **Chat** tab. Type any question about your document in plain English. Get instant, context-grounded answers.

**Step 4 — Generate a Summary**
> Click **"Summarize"** to get a concise, structured summary of the entire document or a specific chapter.

**Step 5 — Create a Quiz**
> Use the **Quiz** tab. Select the number of questions and type (MCQ / short answer). EduMind AI generates a ready-to-attempt quiz from your material.

**Step 6 — Build Flashcards**
> Switch to **Flashcards**. Get spaced-repetition-ready cards covering key terms, definitions, and concepts from your notes.

**Step 7 — Predict Important Questions**
> Use **Question Predictor** to get AI-generated likely exam questions based on the document's emphasis and content structure.

---

## 📸 Screenshots

<div align="center">

> 📌 *Screenshots will be added once the UI is finalized.*

| View | Preview |
|---|---|
| 🏠 Home / Upload Screen | `[ Screenshot Placeholder ]` |
| 💬 Chat Interface | `[ Screenshot Placeholder ]` |
| 🧾 Summary Generation | `[ Screenshot Placeholder ]` |
| 🧪 Quiz Generation | `[ Screenshot Placeholder ]` |
| 🃏 Flashcard View | `[ Screenshot Placeholder ]` |

</div>

---

## 🔮 Future Enhancements

| Feature | Description | Priority |
|---|---|---|
| 🎙️ **Voice Assistant** | Ask questions and get answers via voice input/output | 🔴 High |
| 🖊️ **OCR for Handwritten Notes** | Scan and process handwritten notes using OCR | 🔴 High |
| 🌍 **Multilingual Support** | Study in and query across multiple languages | 🟡 Medium |
| 📱 **Mobile App** | React Native / Flutter companion app | 🟡 Medium |
| 🧑‍🏫 **AI Tutor Mode** | Adaptive, Socratic-style tutoring conversations | 🔴 High |
| 📊 **Learning Analytics** | Track study progress, weak areas, and performance over time | 🟡 Medium |
| ☁️ **Cloud Deployment** | One-click deploy to AWS / GCP / Streamlit Cloud | 🔴 High |
| 🔗 **Google Drive Integration** | Import PDFs directly from Google Drive | 🟡 Medium |
| 🧠 **Memory Across Sessions** | Persistent vector DB per user for long-term context | 🔴 High |

---

## 🤝 Contributing

Open-source contributions make projects like this possible. All contributions — big or small — are genuinely welcome.

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/Edumind-AI.git

# Create a feature branch
git checkout -b feature/YourFeatureName

# Make your changes and commit
git commit -m "Add: YourFeatureName — brief description"

# Push to your fork
git push origin feature/YourFeatureName

# Open a Pull Request on GitHub
```

### Guidelines

- ✅ Follow PEP8 coding standards
- ✅ Write clear, commented code
- ✅ Add tests for new features in `/tests`
- ✅ Update the README if your changes affect usage
- ✅ Open an issue before starting major changes
- ❌ Do not commit directly to `main`

> Found a bug? [Open an issue](https://github.com/ItsRavi-AIML/Edumind-AI/issues)
> Have an idea? [Start a discussion](https://github.com/ItsRavi-AIML/Edumind-AI/discussions)

---

## 📄 License

Distributed under the **MIT License**.

```
MIT License

Copyright (c) 2025 N Raja Ravi Varma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

<div align="center">

| | |
|---|---|
| **Name** | N Raja Ravi Varma |
| **LinkedIn** | [![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/raja-ravi-varma-n/) |
| **GitHub** | [![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/ItsRavi-AIML) |
| **Email** | [![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nimmagaddaravivarma@gmail.com) |

</div>

---

<div align="center">

**⭐ If EduMind AI helped you study smarter, consider starring the repo — it helps others find it.**

*Built with ❤️ using AI and modern NLP technologies.*

</div>

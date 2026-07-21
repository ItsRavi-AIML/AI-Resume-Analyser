<div align="center">

# 🧠 AI Resume Analyzer
### Intelligent ATS Optimization & Resume Intelligence Platform

**Transforming resumes into interview magnets — powered by NLP, Semantic AI, and Machine Learning.**

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-App-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io/)
[![NLP](https://img.shields.io/badge/NLP-spaCy-09A3D5?style=for-the-badge&logo=spacy&logoColor=white)](https://spacy.io/)
[![AI](https://img.shields.io/badge/AI-Semantic%20Matching-8A2BE2?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge)](#-contribution-guidelines)

</div>

---

## 📌 Overview

**AI Resume Analyzer** is an intelligent resume evaluation platform that analyzes resumes against job descriptions using **Natural Language Processing** and **semantic similarity models**, giving job seekers a real, data-backed picture of how their resume performs against Applicant Tracking Systems (ATS).

### The Problem

Over **75% of resumes** are filtered out by ATS software before a human recruiter ever sees them — often due to missing keywords, poor formatting, or weak alignment with the job description. Most candidates have no visibility into *why* they're getting rejected.

### The Solution

This platform gives candidates the same lens recruiters and ATS engines use — parsing resumes, extracting skills, computing semantic relevance to a target job description, and surfacing **specific, actionable gaps** to close before hitting submit.

### Who It Helps

- 🎓 **Students & fresh graduates** building their first ATS-friendly resume
- 💼 **Job seekers** tailoring resumes for specific roles
- 🔄 **Career switchers** identifying transferable and missing skills
- 🧑‍💻 **Recruiters/mentors** who want a fast, objective resume screen

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Resume PDF Upload** | Upload resumes directly in PDF format for instant parsing |
| 🎯 **ATS Score Analysis** | Get a quantified ATS-compatibility score for your resume |
| 🔍 **Job Description Matching** | Compare your resume against any job description in real time |
| 🧩 **Skill Extraction** | Automatically extract technical and soft skills from resume text |
| ⚠️ **Missing Skills Detection** | Identify high-impact skills present in the JD but missing from your resume |
| 🧠 **Semantic Similarity Matching** | Go beyond keyword matching using embedding-based semantic relevance |
| 💡 **Resume Suggestions** | Receive targeted suggestions to improve resume-job alignment |
| 🤖 **AI Feedback** | Get structured, AI-generated feedback on resume quality |
| 🗣️ **Interview Question Generation** | Auto-generate likely interview questions based on resume + JD |
| 📝 **Resume Summarization** | Generate a concise professional summary of the uploaded resume |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Language** | Python 3.9+ |
| **Web Framework** | Streamlit |
| **NLP Engine** | spaCy |
| **ML Toolkit** | scikit-learn |
| **Semantic Embeddings** | Sentence Transformers |
| **PDF Parsing** | pdfplumber |
| **Data Handling** | Pandas |
| **Numerical Computing** | NumPy |

</div>

---

## 🏗️ System Architecture

```
┌──────────┐     ┌────────────────┐     ┌───────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   User   │ ──▶ │ Upload Resume  │ ──▶ │ NLP Processing │ ──▶ │ Skill Extraction  │ ──▶ │   ATS Analysis    │
└──────────┘     └────────────────┘     └───────────────┘     └──────────────────┘     └────────┬─────────┘
                                                                                                    │
                                                                                                    ▼
                                                                                          ┌──────────────────┐
                                                                                          │  Recommendations  │
                                                                                          └──────────────────┘
```

**Flow explained:**
1. **User** uploads a resume (PDF) and pastes a target job description
2. **NLP Processing** cleans and tokenizes text, extracts entities
3. **Skill Extraction** identifies technical/soft skills using spaCy + custom skill taxonomy
4. **ATS Analysis** computes keyword overlap + semantic similarity score
5. **Recommendations** surfaces missing skills and improvement suggestions

---

## ⚙️ Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/ItsRavi-AIML/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Create a Virtual Environment
```bash
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 4. Run the Streamlit App
```bash
streamlit run app.py
```

The app will launch at `http://localhost:8501` 🚀

---

## 🚀 Usage

1. **Launch the app** using the command above
2. **Upload your resume** in PDF format via the sidebar uploader
3. **Paste the target job description** into the input field
4. Click **"Analyze Resume"**
5. Review your:
   - ATS Compatibility Score
   - Semantic Match Percentage
   - Extracted Skills List
   - Missing Skills Report
   - AI-Generated Improvement Suggestions
6. **Iterate** — update your resume and re-run the analysis until your match score improves

---

## 🖼️ Screenshots

<div align="center">

| Dashboard View | ATS Score Report |
|---|---|
| *[Add screenshot here]* | *[Add screenshot here]* |

| Skill Gap Analysis | Resume Suggestions |
|---|---|
| *[Add screenshot here]* | *[Add screenshot here]* |

</div>

> 📌 Replace the placeholders above with actual screenshots stored in a `/assets` or `/screenshots` folder.

---

## 🔮 Future Improvements

- 🔗 **LinkedIn Integration** — import profile data directly for analysis
- 🧭 **AI Career Recommendations** — suggest roles based on skill profile
- 🌍 **Multilingual Support** — analyze resumes in multiple languages
- 🎙️ **Voice Assistant** — voice-guided resume review experience
- ☁️ **Cloud Deployment** — one-click deploy on AWS/GCP/Azure with persistent user history

---

## 📂 Folder Structure

```
ai-resume-analyzer/
│
├── app.py                     # Main Streamlit application entry point
├── requirements.txt           # Project dependencies
├── README.md                  # Project documentation
│
├── src/
│   ├── __init__.py
│   ├── resume_parser.py       # PDF parsing and text extraction
│   ├── nlp_engine.py          # spaCy NLP pipeline
│   ├── skill_extractor.py     # Skill identification logic
│   ├── ats_scorer.py          # ATS scoring algorithm
│   ├── semantic_matcher.py    # Sentence Transformer similarity engine
│   └── recommender.py         # Suggestion & feedback generation
│
├── data/
│   ├── skills_taxonomy.json   # Master skill keyword database
│   └── sample_resumes/        # Sample resumes for testing
│
├── assets/
│   └── screenshots/           # UI screenshots for documentation
│
├── tests/
│   └── test_pipeline.py       # Unit tests
│
└── utils/
    └── helpers.py              # Shared utility functions
```

---

## 📊 Sample Output

```
Resume Analysis Report
────────────────────────────────
ATS Compatibility Score:     82/100
Semantic Match Score:        78.4%

✅ Matched Skills:
   Python, Machine Learning, NLP, SQL, Data Analysis

⚠️ Missing Skills:
   Docker, AWS, CI/CD

💡 Suggestions:
   - Add measurable achievements to your experience section
   - Include "Docker" and "AWS" if you have working exposure
   - Reduce redundant skill repetition in the summary section
────────────────────────────────
```

---

## 🤝 Contribution Guidelines

Contributions are welcome and appreciated! To contribute:

1. **Fork** the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please ensure your code follows PEP8 standards and includes relevant tests before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

<div align="center">

**[Your Name]**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ItsRavi-AIML)

</div>

---

<div align="center">

**⭐ If you find this project useful, consider giving it a star!**

</div>

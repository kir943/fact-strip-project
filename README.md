# 📰 Fact-Strip: AI-Powered Visual Fact Verification

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge)
![Flask](https://img.shields.io/badge/Backend-Flask-green?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-API-orange?style=for-the-badge)
![Replicate](https://img.shields.io/badge/Replicate-Model_Generation-purple?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Project-MumbaiHacks_GenAI_Hackathon-blueviolet?style=for-the-badge)

**Fact-Strip** is an AI-powered fact-checking and visualization platform that verifies user statements, detects sentiment, and generates **comic-style visual representations** of facts.
Developed as part of the **MumbaiHacks GenAI Hackathon**, it demonstrates the potential of generative AI in **education, media, and digital literacy**.

---

## 🚀 Overview

Fact-Strip leverages **AI models** to transform plain factual claims into an interactive visual explanation.
It performs fact verification, mood detection, and generates a comic-style illustration — all in one seamless flow.

---

## ✨ Core Features

* ✅ **Fact Verification** – Validates the truthfulness of a statement using AI-based NLP models.
* 🧠 **Sentiment & Mood Analysis** – Detects the emotional tone of the input text.
* 🎨 **AI Comic Generation** – Converts verified facts into visual comic strips via the Replicate API.
* 📊 **Confidence Scoring** – Displays AI confidence levels for transparency and reliability.
* 📚 **Fact History** – Maintains a log of previous verifications for quick access.
* 💡 **Responsive Frontend** – Built with React and TailwindCSS for an optimized user experience.

---

## 🏗️ Tech Stack

### **Frontend**

* React (Vite)
* TailwindCSS
* Framer Motion
* Axios

### **Backend**

* Flask (Python)
* OpenAI API (fact verification and NLP)
* Replicate API (comic generation)
* dotenv (environment configuration)

---

## ⚙️ Architecture Overview

```text
User Statement → React Frontend → Flask Backend → OpenAI API (Fact + Sentiment Analysis)
               → Replicate API (Comic Generation) → Flask → React Display
```

### Workflow:

1. User submits a factual statement.
2. Flask backend processes it and communicates with OpenAI for verification and sentiment analysis.
3. The result (True/False/Uncertain) with confidence score is generated.
4. The same statement is sent to Replicate for comic generation.
5. The frontend renders all outputs in an interactive interface.

---

## 🧩 Installation & Setup

### Prerequisites

* Node.js (v18+)
* Python (3.8+)
* OpenAI API Key
* Replicate API Token

### Steps

```bash
# Clone repository
git clone https://github.com/your-username/fact-strip.git
cd fact-strip
```

#### Frontend

```bash
cd fact_strip_frontend
npm install
npm run dev
```

#### Backend

```bash
cd ../fact_strip_backend
python -m venv venv
# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Configure API keys
echo "OPENAI_API_KEY=your_key" > .env
echo "REPLICATE_API_TOKEN=your_token" >> .env

python app.py
```

---

## 🧠 Learning Outcomes

### Technical

* Implemented full-stack development using **React + Flask**
* Integrated **AI APIs** for fact verification and image generation
* Applied **Prompt Engineering** to enhance accuracy and interpretability
* Managed asynchronous API communication and error handling
* Designed a scalable and modular architecture for AI applications

### Personal

* Strengthened understanding of **Generative AI workflows**
* Enhanced skills in **frontend-backend integration**
* Learned efficient **API usage and key management**

---

## 📈 Future Enhancements

* 🔍 Integration with third-party fact-checking databases (e.g., Snopes, PolitiFact)
* 🌍 Multi-language support for global accessibility
* 🔒 User authentication and personalized dashboards
* 📤 Option to download generated comics
* 📊 Analytics dashboard for fact trends

---

## 🤝 Contribution

Contributions and suggestions are welcome!

```bash
1. Fork the repository
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit changes: git commit -m "Added new enhancement"
4. Push to your branch: git push origin feature/your-feature
5. Open a Pull Request
```

---

## 🧩 Credits

* **OpenAI** – for natural language analysis
* **Replicate** – for AI-based comic generation
* **Flask & React** – for enabling full-stack development
* **MumbaiHacks GenAI Hackathon** – for inspiring this project

---

## 📜 License

This project is licensed under the **MIT License**.

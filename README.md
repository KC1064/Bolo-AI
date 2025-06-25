## 🗣️ Bolo AI – Text to Speech Web App

Bolo AI is a  Text-to-Speech (TTS) web app that converts written text into realistic, human-like speech using the Bark TTS model. 

---

### 🎥 Demo Preview

[![Watch the demo](assets/bolo-demo-thumbnail.png)](https://github.com/user-attachments/assets/66023427-bcf1-4d82-9878-f082373019e8)

---

### 🚀 Tech Stack

![React](https://img.shields.io/badge/Frontend-ReactJS-61DAFB?logo=react\&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?logo=tailwindcss\&logoColor=white)
![Python](https://img.shields.io/badge/Language-Python-3776AB?logo=python\&logoColor=white)
![Scipy](https://img.shields.io/badge/Audio-Scipy-8CAAE6?logo=scipy\&logoColor=white)
![Bark TTS](https://img.shields.io/badge/TTS-Bark%20TTS-FFB300?logo=waveform\&logoColor=white)

---

### ✨ Features

* 🔊 **Convert written text to realistic, human-like speech**
* 🌐 **Multi-lingual speech support** (English, Hindi, Japanese, and more)
* 🧩 **Powered by Bark TTS** – Free and open source
* 🖼️ **Modern, responsive UI** built with **React + Tailwind CSS**
* 🌍 **Audio output plays directly in-browser**
* 🔧 **Easily extensible** – Add emotion control, new voices, or languages

---

### ⚙️ Installation & Setup

#### 📦 Backend – FastAPI + Bark TTS

```bash
# Clone the repo
git clone https://github.com/KC1064/Bolo-AI
cd Bolo-AI/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload
```

> ⚠️ Bark TTS models can be large. Ensure you preload models or download them as per [Bark’s repo](https://github.com/suno-ai/bark).

#### 💻 Frontend – React + TailwindCSS

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

 Frontend will be available at `http://localhost:3000` and will connect to FastAPI at `http://localhost:8000`.

---



### 🙏 Acknowledgements

* 🔊 [Bark TTS](https://github.com/suno-ai/bark) by Suno AI – The backbone of speech generation.
* 🌐 [FastAPI](https://fastapi.tiangolo.com/) – Lightning fast Python web framework.
* 🎨 [Tailwind CSS](https://tailwindcss.com/) – Modern utility-first CSS.
* 🧠 [Scipy](https://www.scipy.org/) – For audio signal processing.

---

### 🔗 References

* [Bark TTS GitHub Repo](https://github.com/suno-ai/bark)
* [Text to Speech with FastAPI Guide](https://fastapi.tiangolo.com/tutorial/)
* [React + Tailwind Setup Guide](https://tailwindcss.com/docs/guides/create-react-app)






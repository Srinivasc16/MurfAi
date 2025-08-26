# MurfAI

MurfAI is an AI-powered voice platform built with **React** and **FastAPI**, leveraging the **Murf TTS API**. The application provides three primary voice-based features:

1. **Voice News Reader** – Reads news headlines and descriptions aloud in natural-sounding voices.
2. **AI Voice Storyteller** – Converts text-based stories into speech with expressive voice styles.
3. **Real-time Voice Translator** – Translates speech in real-time and plays it back in another language.

---

## Features

### Voice News Reader
- Fetches top news headlines and descriptions from **NewsAPI**.
- Converts news content to speech using Murf TTS.
- Provides play and stop controls for each article.
- Responsive card layout with dark/light theme support.

### AI Voice Storyteller
- Allows the user to input custom stories or text.
- Select from multiple voices and expressive styles.
- Narrates the input text using natural TTS voices.

### Real-time Voice Translator
- Records speech from the user’s microphone.
- Translates the spoken content to a target language.
- Plays back the translated speech using Murf TTS.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Lucide Icons  
- **Backend:** FastAPI, Python, Requests  
- **APIs:** NewsAPI, Murf TTS API  
- **Supported Languages:** Multiple languages based on Murf API voices

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/murfai.git
cd murfai


# GhanaNLP Human ASR Evaluation System

**A lightweight, frontend-only web application that makes it easy for human evaluators to identify and mark mistranscribed words from Automatic Speech Recognition (ASR) models — especially for Ghanaian languages.**

## Overview

Evaluating ASR models on low-resource languages like Twi, Ewe, and Dagbani requires careful human review. Traditional tools are often heavy, require complex backend setups, or make it difficult to precisely flag individual errors.

This project provides a **clean, efficient, frontend-only interface** that allows evaluators to:

- Review pre-recorded audio samples with their ASR transcripts
- Record live speech via the microphone and transcribe it on the fly (using the Khaya ASR API)
- Click individual words to mark them as **incorrect**
- Navigate easily between samples
- Export evaluation results as structured JSON

The entire application runs in the browser. No backend server is required for the core evaluation workflow.

---

## Features

- **Two evaluation modes**
  - **Pre-recorded**: Load a CSV of audio + transcript pairs and review them one by one
  - **Microphone**: Record speech live, send it to the Khaya ASR API, and immediately review the transcript

- **Interactive word-level annotation**  
  Click any word to mark it as mistranscribed. Click again to unmark.

- **Live summary**  
  See the count of selected (incorrect) words in real time.

- **Sample navigation**  
  Move forward and backward through the evaluation set while preserving previous annotations.

- **One-click export**  
  Download all evaluation results as a clean JSON file.

- **Modern UI**  
  Built with React 19 + Material UI for a fast, responsive, and pleasant experience.

- **Docker-ready**  
  Can be deployed easily with the included Dockerfile and nginx configuration.

---

## Tech Stack

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Framework          | React 19 + Vite 8                   |
| UI Library         | Material UI (MUI) 7                 |
| CSV Parsing        | PapaParse                           |
| Audio Recording    | MediaRecorder API                   |
| ASR Integration    | Khaya ASR API                       |
| Deployment         | Docker + nginx                      |

---

## Project Structure

```text
.
├── public/
│   └── data/
│       └── metadata.csv          
├── src/
│   ├── api/
│   │   └── KhayaApi.js           
│   ├── components/
│   │   ├── AppHeader.jsx
│   │   ├── AudioPlayerCard.jsx
│   │   ├── EmptyState.jsx
│   │   ├── EvaluationActions.jsx
│   │   ├── ModeSelector.jsx
│   │   ├── RecorderCard.jsx
│   │   ├── ReviewSummaryCard.jsx
│   │   ├── SampleNavigator.jsx
│   │   ├── StatusBanner.jsx
│   │   └── TranscriptReviewer.jsx
│   ├── hooks/
│   │   ├── useAudioRecorder.js
│   │   └── useEvaluationSession.js
│   ├── theme/
│   ├── utils/
│   ├── App.jsx
│   ├── constants.js
│   └── main.jsx
├── Dockerfile
├── nginx.conf
├── package.json
└── vite.config.js
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Saanimustapha/GhanaNLP-human-ASR-evaluation-system.git
cd GhanaNLP-human-ASR-evaluation-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
VITE_KHAYA_API_BASE_URL=https://your-khaya-api-endpoint
VITE_KHAYA_API_KEY=your_api_key_here
VITE_AUDIO_BASE_URL=https://your-audio-hosting-url
```

- `VITE_KHAYA_API_BASE_URL` and `VITE_KHAYA_API_KEY` are required for the **Microphone** mode.
- `VITE_AUDIO_BASE_URL` is the base URL where your `.wav` files are hosted (used in pre-recorded mode).

### 4. Prepare pre-recorded data (optional)

Place a `metadata.csv` file in `public/data/` with the following format:

```csv
file,text
sample_001.wav,Me re kɔ sukuu nnɛ
sample_002.wav,Ɛyɛ me anigye sɛ wo baeɛ
```

The audio files should be accessible at `{VITE_AUDIO_BASE_URL}/{file}`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

### Pre-recorded Mode
1. Select **Pre-recorded** mode.
2. The first sample loads automatically.
3. Play the audio and click any words that are incorrect.
4. Use the Previous / Next buttons to move through the set.
5. Your selections are automatically saved in memory.

### Microphone Mode
1. Select **Microphone** mode.
2. Click **Start Recording**, speak, then **Stop**.
3. Click **Transcribe** to send the audio to the Khaya ASR API.
4. Review the returned transcript and mark incorrect words.

### Export Results
Click **Export Results** to download a JSON file containing all your annotations.

Example output structure:

```json
[
  {
    "id": "sample_001",
    "title": "sample_001.wav",
    "mode": "pre-recorded",
    "transcript": "Me re kɔ sukuu nnɛ",
    "incorrectWords": ["kɔ", "nnɛ"],
    "incorrectTokenIds": [2, 4],
    "reviewedAt": "2026-09-03T12:34:56.789Z"
  }
]
```

---

## Docker Deployment

Build and run the container:

```bash
docker build -t ghana-asr-eval .
docker run -p 7860:7860 ghana-asr-eval
```

The application will be available at [http://localhost:7860](http://localhost:7860).

---

## Why This Tool?

Human evaluation is still the gold standard for understanding ASR quality on African languages. Existing tools are often:

- Too complex (require servers, databases, authentication)
- Not designed for word-level annotation
- Slow or difficult to use for non-technical evaluators

This system prioritizes **simplicity, speed, and clarity** so that native speakers and researchers can focus on the actual evaluation task.

---

## Acknowledgements

Built for the **GhanaNLP** community to support better evaluation of speech recognition systems for Ghanaian languages.

---

## License

MIT License
```

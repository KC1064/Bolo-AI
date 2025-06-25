import os
import uuid
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav

# ✅ Apply monkey patch to torch.load before importing Bark models
_original_torch_load = torch.load


def _patched_torch_load(
    f, map_location=None, pickle_module=None, weights_only=None, **kwargs
):
    return _original_torch_load(
        f,
        map_location=map_location,
        pickle_module=pickle_module,
        weights_only=False,  # Force this to False
        **kwargs,
    )


torch.load = _patched_torch_load  # ✅ Apply monkey patch


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load Bark models on startup
try:
    print("🔄 Preloading Bark models...")
    preload_models()
    model_ready = True
    print("✅ Bark models loaded successfully.")
except Exception as e:
    print("❌ Failed to preload Bark models:", e)
    model_ready = False

# ✅ Optional: Restore original torch.load (good practice)
torch.load = _original_torch_load


class TextPrompt(BaseModel):
    text: str
    voice: str = None  


# Voice preset mapping (frontend value -> Bark voice_preset)
VOICE_PRESET_MAP = {
    "en-male": "v2/en_speaker_2",
    "en-female": "v2/en_speaker_9",
    "hi-male": "v2/hi_speaker_7",
    "hi-female": "v2/hi_speaker_1",
    "ja-male": "v2/ja_speaker_2",
    "ja-female": "v2/ja_speaker_0",
}
DEFAULT_VOICE_PRESET = "v2/en_speaker_2"  


@app.get("/health")
def health():
    return {
        "status": "healthy" if model_ready else "unhealthy",
        "model_loaded": model_ready,
    }


@app.post("/speak")
def speak(prompt: TextPrompt):
    if not model_ready:
        raise HTTPException(status_code=503, detail="Model is not loaded.")

    if not prompt.text.strip():
        raise HTTPException(status_code=400, detail="Text input is empty.")

    if len(prompt.text) > 500:
        raise HTTPException(
            status_code=413, detail="Text too long. Max 5000 characters."
        )

    # Map frontend voice to Bark voice_preset
    voice_preset = VOICE_PRESET_MAP.get(prompt.voice, DEFAULT_VOICE_PRESET)

    try:
        print(
            f"🔊 Generating audio for input text with voice preset: {voice_preset} ..."
        )
        audio_array = generate_audio(prompt.text, history_prompt=voice_preset)

        filename = f"audio_{uuid.uuid4().hex}.wav"
        os.makedirs("audios", exist_ok=True)
        filepath = os.path.join("audios", filename)

        write_wav(filepath, SAMPLE_RATE, audio_array)
        print(f"✅ Audio saved at: {filepath}")

        return FileResponse(filepath, media_type="audio/wav", filename=filename)

    except Exception as e:
        print("❌ Error during audio generation:", e)
        raise HTTPException(
            status_code=500, detail="Internal Server Error: Failed to generate audio."
        )

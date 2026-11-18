"""ESC-50 audio classification service."""

from functools import lru_cache
from pathlib import Path

import joblib
import librosa
import numpy as np


MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "esc50_classifier.joblib"


def extract_features(audio_path: str, sample_rate: int = 22050) -> np.ndarray:
    waveform, sr = librosa.load(audio_path, sr=sample_rate, mono=True)
    if waveform.size == 0:
        raise ValueError("Audio file contains no usable samples")

    mfcc = librosa.feature.mfcc(y=waveform, sr=sr, n_mfcc=40)
    mfcc_delta = librosa.feature.delta(mfcc)
    mfcc_delta2 = librosa.feature.delta(mfcc, order=2)
    chroma = librosa.feature.chroma_stft(y=waveform, sr=sr)
    contrast = librosa.feature.spectral_contrast(y=waveform, sr=sr)
    zcr = librosa.feature.zero_crossing_rate(waveform)
    rms = librosa.feature.rms(y=waveform)
    centroid = librosa.feature.spectral_centroid(y=waveform, sr=sr)
    bandwidth = librosa.feature.spectral_bandwidth(y=waveform, sr=sr)
    flatness = librosa.feature.spectral_flatness(y=waveform)
    rolloff = librosa.feature.spectral_rolloff(y=waveform, sr=sr)

    features = np.concatenate(
        [
            mfcc.mean(axis=1),
            mfcc.std(axis=1),
            mfcc_delta.mean(axis=1),
            mfcc_delta.std(axis=1),
            mfcc_delta2.mean(axis=1),
            mfcc_delta2.std(axis=1),
            chroma.mean(axis=1),
            chroma.std(axis=1),
            contrast.mean(axis=1),
            contrast.std(axis=1),
            zcr.mean(axis=1),
            zcr.std(axis=1),
            rms.mean(axis=1),
            rms.std(axis=1),
            centroid.mean(axis=1),
            centroid.std(axis=1),
            bandwidth.mean(axis=1),
            bandwidth.std(axis=1),
            flatness.mean(axis=1),
            flatness.std(axis=1),
            rolloff.mean(axis=1),
            rolloff.std(axis=1),
        ]
    )
    return features.astype(np.float32)


@lru_cache(maxsize=1)
def load_classifier() -> dict:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"ESC-50 classifier not found at {MODEL_PATH}. Train it with the training script."
        )
    return joblib.load(MODEL_PATH)


def predict_audio(audio_path: str) -> dict:
    artifact = load_classifier()
    features = extract_features(audio_path).reshape(1, -1)
    probabilities = artifact["classifier"].predict_proba(features)[0]
    top_index = int(probabilities.argmax())

    ranked = sorted(
        (
            {
                "category": artifact["class_names"][index],
                "probability": round(float(probabilities[index]), 4),
            }
            for index in range(len(artifact["class_names"]))
        ),
        key=lambda item: item["probability"],
        reverse=True,
    )

    category = ranked[0]["category"]
    coarse_category = artifact["category_lookup"].get(category, "Other")
    return {
        "category": category,
        "coarse_category": coarse_category,
        "confidence": ranked[0]["probability"],
        "top_predictions": ranked[:5],
    }
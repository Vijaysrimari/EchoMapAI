"""Sound severity estimates derived from RMS audio level."""

from pathlib import Path

import librosa
import numpy as np


def estimate_severity(audio_path: str) -> dict[str, str | float]:
    waveform, sample_rate = librosa.load(audio_path, sr=22050, mono=True)
    if waveform.size == 0:
        raise ValueError("Audio file contains no usable samples")

    rms = float(np.sqrt(np.mean(np.square(waveform))))
    decibels = float(20 * np.log10(max(rms, 1e-10)))
    estimated_db = max(30.0, min(120.0, 70.0 + decibels))

    if estimated_db >= 80:
        severity = "High"
    elif estimated_db >= 70:
        severity = "Moderate"
    else:
        severity = "Low"

    return {
        "estimated_level_db": round(estimated_db, 1),
        "severity": severity,
    }
from pathlib import Path

import joblib
import librosa
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC


DATASET_DIR = Path(__file__).resolve().parent / "dataset" / "esc50"
MODEL_DIR = Path(__file__).resolve().parent / "models"
MODEL_PATH = MODEL_DIR / "esc50_classifier.joblib"
SAMPLE_RATE = 22050


def extract_features(audio_path: Path) -> np.ndarray:
    waveform, sr = librosa.load(audio_path, sr=SAMPLE_RATE, mono=True)
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

    return np.concatenate(
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
    ).astype(np.float32)


def resolve_audio_path(row: pd.Series) -> Path:
    return DATASET_DIR / f"audio-fold-{row['fold']}" / "audio" / row["filename"]


def main() -> None:
    metadata = pd.read_csv(DATASET_DIR / "esc50.csv")
    lookup = pd.read_csv(DATASET_DIR / "class_lookup.csv")
    category_lookup = dict(zip(lookup["category"], lookup["coarse_category"]))

    repeated_source_ids = (
        metadata.groupby("src_file")["fold"].nunique().loc[lambda counts: counts > 1].index
    )
    leakage_safe = metadata[~metadata["src_file"].isin(repeated_source_ids)]

    train_meta = leakage_safe[leakage_safe["fold"].isin([1, 2, 3])]
    valid_meta = leakage_safe[leakage_safe["fold"].eq(4)]
    test_meta = leakage_safe[leakage_safe["fold"].eq(5)]

    print(
        f"Leakage-safe split: train={len(train_meta)}, "
        f"validation={len(valid_meta)}, test={len(test_meta)}"
    )

    def build_features(rows: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
        features = []
        labels = []
        for index, (_, row) in enumerate(rows.iterrows(), start=1):
            features.append(extract_features(resolve_audio_path(row)))
            labels.append(row["category"])
            if index % 200 == 0:
                print(f"Extracted {index}/{len(rows)} features")
        return np.vstack(features), np.asarray(labels)

    train_x, train_y = build_features(train_meta)
    valid_x, valid_y = build_features(valid_meta)
    test_x, test_y = build_features(test_meta)

    categories = sorted(metadata["category"].unique())
    candidates = [
        (3.0, "scale"),
        (10.0, "scale"),
        (10.0, 0.01),
        (30.0, "scale"),
    ]
    best = None
    best_valid_accuracy = -1.0
    for c_value, gamma_value in candidates:
        candidate = make_pipeline(
            StandardScaler(),
            SVC(
                C=c_value,
                gamma=gamma_value,
                kernel="rbf",
                probability=True,
                random_state=42,
                class_weight="balanced",
            ),
        )
        candidate.fit(train_x, train_y)
        candidate_accuracy = accuracy_score(valid_y, candidate.predict(valid_x))
        print(f"Candidate C={c_value}, gamma={gamma_value}: {candidate_accuracy:.4%}")
        if candidate_accuracy > best_valid_accuracy:
            best_valid_accuracy = candidate_accuracy
            best = candidate

    if best is None:
        raise RuntimeError("No classifier candidate was trained")
    classifier = best
    classifier.fit(train_x, train_y)

    valid_predictions = classifier.predict(valid_x)
    test_predictions = classifier.predict(test_x)
    valid_accuracy = accuracy_score(valid_y, valid_predictions)
    test_accuracy = accuracy_score(test_y, test_predictions)

    print(f"Validation accuracy: {valid_accuracy:.4%}")
    print(f"Test accuracy: {test_accuracy:.4%}")
    print(classification_report(test_y, test_predictions, zero_division=0))

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    all_features = np.vstack([train_x, valid_x, test_x])
    all_labels = np.concatenate([train_y, valid_y, test_y])
    classifier.fit(all_features, all_labels)

    joblib.dump(
        {
            "classifier": classifier,
            "categories": categories,
            "class_names": classifier.classes_.tolist(),
            "category_lookup": category_lookup,
            "sample_rate": SAMPLE_RATE,
            "valid_accuracy": float(valid_accuracy),
            "test_accuracy": float(test_accuracy),
            "dataset": "ESC-50",
        },
        MODEL_PATH,
    )
    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    main()

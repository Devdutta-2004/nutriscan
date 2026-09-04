"""
Central configuration for NutriScan LMPC Compliance Backend.
Reads environment variables for API keys and feature flags.
"""

import os
from pathlib import Path


def _load_dotenv_safe():
    """Load key-value pairs from .env without requiring third-party libraries."""
    search_paths = [
        Path.cwd() / ".env",
        Path(__file__).resolve().parent.parent.parent / ".env",
        Path.home() / ".env",
    ]
    for p in search_paths:
        if p.is_file():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip('"').strip("'")
                            if k and k not in os.environ:
                                os.environ[k] = v
                break
            except Exception:
                pass


_load_dotenv_safe()


class Settings:
    """Application settings loaded from environment variables."""

    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
    GEMINI_API_BASE: str = "https://generativelanguage.googleapis.com/v1beta"

    # RAG Configuration
    RAG_TOP_K: int = int(os.getenv("RAG_TOP_K", "5"))
    ENABLE_LLM_SYNTHESIS: bool = bool(os.getenv("GEMINI_API_KEY", ""))

    # Corpus versioning
    CORPUS_VERSION: str = "2024.1"

    @classmethod
    def is_gemini_available(cls) -> bool:
        """Check if Gemini API key is configured and non-empty."""
        return bool(cls.GEMINI_API_KEY and cls.GEMINI_API_KEY.strip())

    @classmethod
    def reload(cls):
        """Reload settings from environment (useful after .env changes)."""
        cls.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
        cls.ENABLE_LLM_SYNTHESIS = cls.is_gemini_available()


settings = Settings()

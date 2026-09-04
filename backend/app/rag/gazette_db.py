"""
Document-Grounded RAG Engine for LMPC Statutory Gazette Rules.
Performs semantic similarity retrieval and citation lookups for detected anomalies.
"""

from typing import List, Dict, Any, Optional
import math
import re
from app.rag.seed_data import STATUTORY_CHUNKS

class GazetteRAGEngine:
    """
    In-memory semantic vector retriever over official LMPC statutory chunks.
    Uses TF-IDF term frequency with n-gram indexing and cosine similarity.
    """

    def __init__(self, chunks: Optional[List[Dict[str, Any]]] = None):
        self.chunks = chunks or STATUTORY_CHUNKS
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        words = re.findall(r'\b[a-z0-9_\-\(\)]+\b', text.lower())
        return words

    def _build_index(self):
        self.doc_count = len(self.chunks)
        self.doc_term_freqs = []
        self.df: Dict[str, int] = {}

        for chunk in self.chunks:
            corpus_text = f"{chunk['title']} {chunk['act_rule']} {chunk['verbatim_text']} {chunk['officer_guidance']} {' '.join(chunk.get('tags', []))}"
            tokens = self._tokenize(corpus_text)
            tf: Dict[str, int] = {}
            for token in tokens:
                tf[token] = tf.get(token, 0) + 1
            self.doc_term_freqs.append(tf)

            for token in set(tokens):
                self.df[token] = self.df.get(token, 0) + 1

    def _tfidf_vector(self, term_freq: Dict[str, int]) -> Dict[str, float]:
        vec: Dict[str, float] = {}
        for token, count in term_freq.items():
            idf = math.log((self.doc_count + 1) / (self.df.get(token, 0) + 1)) + 1.0
            vec[token] = (1 + math.log(count)) * idf
        return vec

    def _cosine_sim(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        dot = sum(vec1[k] * vec2[k] for k in vec1 if k in vec2)
        norm1 = math.sqrt(sum(v * v for v in vec1.values()))
        norm2 = math.sqrt(sum(v * v for v in vec2.values()))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot / (norm1 * norm2)

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Retrieves top_k exact gazette clauses matching query or anomaly description.
        """
        query_tokens = self._tokenize(query)
        if not query_tokens:
            return self.chunks[:top_k]

        q_tf: Dict[str, int] = {}
        for token in query_tokens:
            q_tf[token] = q_tf.get(token, 0) + 1
        q_vec = self._tfidf_vector(q_tf)

        scores = []
        for i, chunk in enumerate(self.chunks):
            doc_vec = self._tfidf_vector(self.doc_term_freqs[i])
            score = self._cosine_sim(q_vec, doc_vec)
            
            # Boost score if explicit rule code appears in query
            rule_id = chunk["id"].lower()
            if rule_id in query.lower() or any(tag in query.lower() for tag in chunk.get("tags", [])):
                score += 0.35

            scores.append((score, chunk))

        scores.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, chunk in scores[:top_k]:
            results.append({
                **chunk,
                "relevance_score": round(float(score), 3)
            })
        return results

    def get_by_id(self, chunk_id: str) -> Optional[Dict[str, Any]]:
        """
        Returns exact statutory chunk by ID (e.g., 'rule_6_1_s').
        """
        for chunk in self.chunks:
            if chunk["id"].lower() == chunk_id.lower():
                return chunk
        return None

# Global Singleton
gazette_rag_engine = GazetteRAGEngine()

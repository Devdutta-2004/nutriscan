import math
import re
from collections import defaultdict, Counter
from typing import List, Dict, Any, Optional

from app.rag.lmpc_corpus import LMPC_CORPUS, CORPUS_BY_ID

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at",
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do",
    "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having",
    "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how",
    "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's",
    "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours",
    "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these",
    "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until",
    "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where",
    "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll",
    "you're", "you've", "your", "yours", "yourself", "yourselves"
}

def tokenize(text: str) -> List[str]:
    """
    Improved tokenizer:
    - Lowercase
    - Keep legal terms like 6(1)(a) intact
    - Strip punctuation otherwise
    - Stopword removal
    - Generate bigrams
    """
    text = text.lower()
    
    tokens = []
    
    raw_tokens = text.split()
    
    cleaned_tokens = []
    for t in raw_tokens:
        if re.match(r'^\d+\([a-z0-9]+\)', t) or re.match(r'^[a-z0-9]+\(\d+\)', t):
            t = re.sub(r'[,.;:]$', '', t)
            cleaned_tokens.append(t)
        else:
            words = re.findall(r'\b\w+\b', t)
            cleaned_tokens.extend(words)
            
    final_tokens = [t for t in cleaned_tokens if t not in STOPWORDS and len(t) > 1]
    
    bigrams = [f"{final_tokens[i]}_{final_tokens[i+1]}" for i in range(len(final_tokens)-1)]
    
    return final_tokens + bigrams


class LMPCRetrievalEngine:
    """
    Hybrid RAG retrieval engine combining BM25 and TF-IDF with RRF.
    """
    def __init__(self, chunks=None):
        """Initialize with corpus chunks, build BM25 and TF-IDF indexes."""
        self.chunks = chunks if chunks is not None else LMPC_CORPUS
        self.corpus_by_id = CORPUS_BY_ID if chunks is None else {c["id"]: c for c in self.chunks}
        
        self.doc_count = len(self.chunks)
        
        self.tokenized_docs = []
        self.doc_lengths = []
        self.avg_doc_len = 0
        
        self.df = Counter()
        self.tf_docs = []
        
        total_len = 0
        for chunk in self.chunks:
            text = (
                f"{chunk.get('title', '')} "
                f"{chunk.get('act_rule', '')} "
                f"{chunk.get('gazette_ref', '')} "
                f"{chunk.get('verbatim_text', '')} "
                f"{chunk.get('officer_guidance', '')} "
                f"{chunk.get('penalty_rule', '')} "
                f"{' '.join(chunk.get('tags', []))} "
                f"{chunk.get('id', '')}"
            )
            tokens = tokenize(text)
            
            self.tokenized_docs.append(tokens)
            self.doc_lengths.append(len(tokens))
            total_len += len(tokens)
            
            doc_tf = Counter(tokens)
            self.tf_docs.append(doc_tf)
            
            for token in set(tokens):
                self.df[token] += 1
                
        self.avg_doc_len = total_len / max(1, self.doc_count)
        
        self.k1 = 1.5
        self.b = 0.75
        
        self.bm25_idf = {}
        self.tfidf_idf = {}
        
        for token, df in self.df.items():
            self.bm25_idf[token] = math.log((self.doc_count - df + 0.5) / (df + 0.5) + 1)
            self.tfidf_idf[token] = math.log(self.doc_count / (df + 1)) + 1

    def _bm25_score(self, query_tokens: List[str], doc_idx: int) -> float:
        """Calculate BM25 score for a document."""
        score = 0.0
        doc_len = self.doc_lengths[doc_idx]
        doc_tf = self.tf_docs[doc_idx]
        
        if doc_len == 0:
            return 0.0
            
        for token in query_tokens:
            if token not in doc_tf:
                continue
                
            tf = doc_tf[token]
            idf = self.bm25_idf.get(token, 0)
            
            numerator = tf * (self.k1 + 1)
            denominator = tf + self.k1 * (1 - self.b + self.b * (doc_len / self.avg_doc_len))
            
            score += idf * (numerator / denominator)
            
        return score
        
    def _tfidf_score(self, query_tokens: List[str], doc_idx: int) -> float:
        """Calculate TF-IDF score for a document."""
        score = 0.0
        doc_len = self.doc_lengths[doc_idx]
        doc_tf = self.tf_docs[doc_idx]
        
        if doc_len == 0:
            return 0.0
            
        query_tf = Counter(query_tokens)
        
        for token, q_tf in query_tf.items():
            if token not in doc_tf:
                continue
                
            d_weight = (doc_tf[token] / doc_len) * self.tfidf_idf.get(token, 0)
            q_weight = q_tf * self.tfidf_idf.get(token, 0)
            
            score += d_weight * q_weight
            
        return score

    def search(self, query: str, top_k: int = 5, category: str = None) -> List[Dict[str, Any]]:
        """Hybrid BM25+TF-IDF search with RRF fusion. Returns top_k results with relevance_score."""
        query_tokens = tokenize(query)
        if not query_tokens:
            return self.chunks[:top_k]
            
        bm25_scores = []
        tfidf_scores = []
        
        for i, chunk in enumerate(self.chunks):
            if category and category != "general":
                applies_to = chunk.get("applies_to", [])
                if category not in applies_to and "general" not in applies_to and "all" not in applies_to:
                    continue
            
            b_score = self._bm25_score(query_tokens, i)
            t_score = self._tfidf_score(query_tokens, i)

            # Boost exact rule ID or tag match in query
            chunk_id = chunk.get("id", "").lower()
            query_lower = query.lower()
            if chunk_id in query_lower or any(tag in query_lower for tag in chunk.get("tags", [])):
                b_score += 2.0
                t_score += 1.0

            if b_score > 0:
                bm25_scores.append((i, b_score))
            if t_score > 0:
                tfidf_scores.append((i, t_score))
            
        bm25_scores.sort(key=lambda x: x[1], reverse=True)
        tfidf_scores.sort(key=lambda x: x[1], reverse=True)
        
        rrf_scores = defaultdict(float)
        k_rrf = 60
        
        for rank, (doc_idx, _) in enumerate(bm25_scores):
            rrf_scores[doc_idx] += 1.0 / (k_rrf + rank + 1)
            
        for rank, (doc_idx, _) in enumerate(tfidf_scores):
            rrf_scores[doc_idx] += 1.0 / (k_rrf + rank + 1)
            
        if not rrf_scores:
            # Fallback if no direct term match: return top declaration chunks
            return [c for c in self.chunks if c.get("category") == "declaration"][:top_k]

        fused_results = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
        
        results = []
        for doc_idx, score in fused_results[:top_k]:
            chunk_copy = self.chunks[doc_idx].copy()
            chunk_copy["relevance_score"] = round(score, 4)
            results.append(chunk_copy)
            
        return results

    def get_by_id(self, chunk_id: str) -> Optional[Dict[str, Any]]:
        """O(1) lookup by chunk ID."""
        return self.corpus_by_id.get(chunk_id)

    def get_related_rules(self, chunk_id: str) -> List[Dict[str, Any]]:
        """Returns all chunks referenced in the given chunk's related_rules field."""
        chunk = self.get_by_id(chunk_id)
        if not chunk:
            return []
            
        related = chunk.get("related_rules", [])
        return [self.get_by_id(r_id) for r_id in related if self.get_by_id(r_id)]

    def get_penalty_for_rule(self, rule_id: str) -> Optional[Dict[str, Any]]:
        """Finds the applicable penalty chunk for a given rule."""
        specific_penalty_id = f"penalty_{rule_id.split('_')[-1]}"
        penalty = self.get_by_id(specific_penalty_id)
        if penalty:
            return penalty
            
        return self.get_by_id("rule_32")

    def get_all_mandates(self, product_category: str = "general") -> List[Dict[str, Any]]:
        """Returns all declaration-category chunks applicable to a product category."""
        results = []
        for chunk in self.chunks:
            if chunk.get("category") == "declaration":
                applies_to = chunk.get("applies_to", [])
                if product_category in applies_to or "general" in applies_to or "all" in applies_to:
                    results.append(chunk)
        return results

    def get_amendments(self) -> List[Dict[str, Any]]:
        """Returns all amendment-category chunks."""
        return [chunk for chunk in self.chunks if chunk.get("category") == "amendment"]


# Global Singleton
lmpc_retrieval_engine = LMPCRetrievalEngine()

# Backward-compatible alias
gazette_rag_engine = lmpc_retrieval_engine

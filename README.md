# pandas-text-ops-dashboard

A lightweight, practical codebase for a **real-time-like support ticket scenario**:

- **Python + pandas** does text cleaning and feature extraction (best-practice style from pandas text guide).
- **Node.js (Express)** serves processed data via API.
- **React** displays categorized results for quick triage.

---

## Why this example

In many teams, incoming support text is noisy and unstructured.  
This repo demonstrates a simple pipeline to:

1. normalize text,
2. extract structured values (like `order_id`),
3. classify basic categories (`refund`, `auth`, `other`),
4. serve and visualize the result quickly.

This is intentionally small and easy to extend.

---

## Project structure

- `src/python/text_pipeline.py` - pandas text processing pipeline
- `src/python/sample_tickets.csv` - sample dataset
- `src/server/index.js` - Express API
- `src/web/*` - tiny React UI
- `requirements.txt` - Python dependency
- `package.json` - Node/React dependencies and scripts

---

## pandas text best practices shown

From pandas text-data patterns (see official text user guide):

- Use `.str` vectorized string operations (`lower`, `contains`, `extract`, `replace`)
- Handle null-safe string type with `astype("string")`
- Use regex with extraction (`str.extract`)
- Prefer method chaining with `.assign()` for readable data pipelines
- Avoid row-wise loops for transformations when vectorized ops are possible

Reference:
- https://pandas.pydata.org/docs/user_guide/text.html

---

## Run locally

## 1) Python pipeline

```bash
python -m venv .venv
# activate venv (Windows: .venv\Scripts\activate, macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
python src/python/text_pipeline.py
```

This writes:
- `src/server/processed_tickets.json`

## 2) Node + React

```bash
npm install
npm run dev
```

- API: `http://localhost:4000/api/tickets`
- Frontend: `http://localhost:5173`

---

## Real-time guidance (how to evolve)

For real production use:

1. **Ingestion**  
   Replace CSV with streaming input (queue, webhook, or DB polling).

2. **Incremental processing**  
   Run pipeline on new tickets only (batch windows or micro-batches).

3. **Validation**  
   Add schema checks (required columns, timestamp parse success, text null ratios).

4. **Monitoring**  
   Track category distribution shifts and regex extraction miss rates.

5. **Model upgrade path**  
   Keep rule-based categorization first; later add ML/NLP classifier while preserving rule fallback.

6. **API hardening**  
   Add pagination, filtering by time window, auth, and error observability.

---

## Notes

- The classification logic here is intentionally simple.
- This example is for guidance and quick onboarding, not a full production architecture.
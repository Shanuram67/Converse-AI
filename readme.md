# Converse.ai — Chat + AI Insights (Backend + Frontend)

```

A full-stack chat application: React + Vite frontend styled with Tailwind CSS, and Django REST backend (PostgreSQL).  
Features: Real-time-like chat flow (POST/GET endpoints), conversation history, conversation end + AI analysis hooks, intelligent query (search), export-ready backend, CORS enabled, and OpenAPI docs.

---

## Table of Contents

1. Quick demo (screenshots)
2. Project structure
3. Setup instructions (Backend & Frontend)
4. API documentation (OpenAPI)
5. Sample conversations & AI-generated insights
6. Architecture diagram
7. Requirements
8. Fixtures / sample data
9. Coding style & OOP suggestions
10. License

---

## 1. Screenshots

Add screenshots (PNG/JPEG) to `docs/screenshots/` and reference them here:


- `docs/chat1.png` — Chat page and Conversations listwith messages
- `docs/int.png` — Intelligence query UI


**How to capture:** Use your OS screenshot tool (Windows Snipping Tool or `gnome-screenshot`), or use Chrome's devtools responsive screenshot for mobile/tablet sizing. Save into `docs/screenshots/` and commit.

---

## 2. Project structure (important files)

```

chat-backend/
├─ core/                 # django project
│  ├─ settings.py
│  ├─ urls.py
│  └─ ...
├─ chat/                 # django app (conversations + messages)
│  ├─ models.py
│  ├─ views.py
│  ├─ serializers.py
│  ├─ urls.py
│  ├─ fixtures/
│  │  └─ sample_conversations.json
│  └─ ...
├─ ai_module/
│  └─ ai_service.py      # AI service (OOP-friendly)
└─ requirements.txt

chat-frontend/
├─ src/
│  ├─ api.js
│  ├─ pages/
│  │  ├─ Conversations.jsx
│  │  └─ Chat.jsx
│  └─ components/
│     └─ ...
└─ index.html

````

---

## 3. Setup instructions

### Backend (Django + PostgreSQL)

1. Create and activate a virtualenv:
```bash
python -m venv venv
source venv/bin/activate     # WSL/macOS
# venv\Scripts\activate      # Windows PowerShell
````

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `.env` in repo root (do **not** commit `.env`):

```
DJANGO_SECRET_KEY=your-secret
DB_NAME=chatdb
DB_USER=chatuser
DB_PASS=poste
DB_HOST=localhost
DB_PORT=5432
FREE_SOURCE_API_KEY=your_ai_key
```

4. Database (Postgres): create DB & user (example WSL commands)

```bash
sudo -i -u postgres
psql
CREATE DATABASE chatdb;
CREATE USER chatuser WITH PASSWORD 'poste';
GRANT ALL PRIVILEGES ON DATABASE chatdb TO chatuser;
ALTER DATABASE chatdb OWNER TO chatuser;
\q
```

5. Migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

6. Load sample data (optional):

```bash
python manage.py loaddata chat/fixtures/sample_conversations.json
```

7. Run server:

```bash
python manage.py runserver 0.0.0.0:8000
```

### Frontend (Vite + React + Tailwind)

1. Move to `chat-frontend/` and install:

```bash
npm install
```

2. Tailwind must be configured (see `tailwind.config.js`). Start dev:

```bash
npm run dev
```

3. Ensure frontend axios `api.baseURL` points to your backend:

```js
// src/api.js
const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });
```

---

## 4. API Documentation (OpenAPI)

We recommend using `drf-spectacular`. Install (already in `requirements.txt` below):

### a) settings.py additions

```python
INSTALLED_APPS += ['drf_spectacular']

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    # other DRF settings...
}
SPECTACULAR_SETTINGS = {
    'TITLE': 'Converse.ai API',
    'DESCRIPTION': 'API for chat, messages, and AI intelligence',
    'VERSION': '1.0.0',
}
```

### b) urls.py additions

```python
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns += [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

### c) Generate & view

* Start the server and visit `http://127.0.0.1:8000/api/docs/` — interactive Swagger UI.
* Raw OpenAPI JSON: `http://127.0.0.1:8000/api/schema/`.

---

## 5. Sample conversations & AI-generated insights (example)

### Sample conversation (human-readable)

```
Conversation: Project Kickoff (id: 1111-2222)
1. USER [2025-11-05T10:00]: "We need to finalize the budget for Q1."
2. AI   [2025-11-05T10:00]: "What is the current proposed budget and the main line-items?"
3. USER [2025-11-05T10:05]: "Proposed: INR 1,200,000. Main items: Dev (700k), Marketing (300k), Infra(200k)."
4. AI   [2025-11-05T10:06]: "Noted. Action: Re-evaluate Dev scope to reduce by 10% or shift 5% from infra to marketing."
```

### AI-generated insights (sample response from `/api/ai/query-past/`):

```json
{
  "answer": "The team agreed to re-evaluate the development budget to reduce it by 10% and consider shifting 5% from infrastructure to marketing.",
  "sources": [
    {
      "conversation_id": "1111-2222",
      "excerpt": "Proposed: INR 1,200,000. Main items: Dev (700k), Marketing (300k), Infra(200k)."
    }
  ]
}
```

---

## 6. Architecture diagram (Mermaid)

Paste this into `docs/architecture.md` or in a markdown-renderer that supports Mermaid:

```
flowchart LR
  A[User (Frontend)] -->|POST message| B(React SPA)
  B -->|HTTP POST| C[Django REST API]
  C -->|Create Message| D[(Postgres: messages, conversations)]
  C -->|Call| E[AI Service (ai_module)]
  E -->|LLM result| C
  C -->|Save AI message| D
  D -->|Query| F[Semantic Search / Embeddings (pgvector)]
  C -->|Return| B
  B -->|Render| A
```

---

## 7. requirements.txt

Use the file at project root `requirements.txt`:

```
asgiref==3.10.0
Django==5.2.8
django-cors-headers==4.9.0
djangorestframework==3.16.1
drf-spectacular==0.28.1
psycopg2-binary==2.9.11
python-dotenv==1.2.1
sqlparse==0.5.3
typing_extensions==4.15.0
tzdata==2025.2
```

> Note: I added `drf-spectacular` to produce the OpenAPI docs. If you prefer `drf-yasg`, swap accordingly.

---

## 8. Sample conversation fixture (chat/fixtures/sample_conversations.json)

Create this file and then run `python manage.py loaddata chat/fixtures/sample_conversations.json`.

```json
[
  {
    "model": "chat.conversation",
    "pk": "11111111-1111-1111-1111-111111111111",
    "fields": {
      "title": "Project Kickoff",
      "start_time": "2025-11-05T10:00:00Z",
      "end_time": null,
      "status": "active",
      "summary": "",
      "topic_keywords": ["budget", "kickoff", "q1"],
      "sentiment": "Neutral",
      "action_items": []
    }
  },
  {
    "model": "chat.message",
    "pk": 1,
    "fields": {
      "conversation": "11111111-1111-1111-1111-111111111111",
      "sender": "user",
      "content": "We need to finalize the budget for Q1.",
      "timestamp": "2025-11-05T10:00:00Z",
      "is_key_message": false
    }
  },
  {
    "model": "chat.message",
    "pk": 2,
    "fields": {
      "conversation": "11111111-1111-1111-1111-111111111111",
      "sender": "ai",
      "content": "What is the current proposed budget and the main line-items?",
      "timestamp": "2025-11-05T10:00:10Z",
      "is_key_message": false
    }
  },
  {
    "model": "chat.message",
    "pk": 3,
    "fields": {
      "conversation": "11111111-1111-1111-1111-111111111111",
      "sender": "user",
      "content": "Proposed: INR 1,200,000. Main items: Dev (700k), Marketing (300k), Infra(200k).",
      "timestamp": "2025-11-05T10:05:00Z",
      "is_key_message": true
    }
  }
]
```

---

## 9. Coding style & OOP recommendations

* Keep `ai_module/ai_service.py` as a class-based service so swapping LLM providers is trivial:

```python
# ai_module/ai_service.py (suggested)
import os
from chat.models import Conversation, Message

class AIService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("FREE_SOURCE_API_KEY")

    def generate_reply(self, conversation_id):
        # Use conversation history + model call
        conversation = Conversation.objects.get(id=conversation_id)
        last = Message.objects.filter(conversation=conversation).order_by('-timestamp').first()
        return f"Mock reply to: {last.content}" if last else "Hello!"

    def analyze_conversation(self, conversation_id):
        # Summarize + update DB
        conversation = Conversation.objects.get(id=conversation_id)
        conversation.summary = "Auto-generated summary"
        conversation.save()
        return conversation.summary

    def query_past(self, query, filters=None, top_k=5):
        # Keyword fallback: replace with embedding search later
        ...
```

* Use clear comments and type hints for public functions.
* Keep view logic thin — move heavy logic into services (AIService).
* Add unit tests for serializers, views, and the AIService class (pytest + Django test runner).

---

## 10. Useful management & debug commands

* Create superuser:

```bash
python manage.py createsuperuser
```

* Check migrations:

```bash
python manage.py showmigrations
```

* DB shell:

```bash
python manage.py dbshell
```

---

## Extra notes

* **CORS:** We set `django-cors-headers` in `settings.py`. For production, restrict `CORS_ALLOWED_ORIGINS`.
* **Secrets:** Keep API keys in environment variables or secret manager — never commit `.env`.
* **Embeddings & search:** For semantic search later, add `pgvector` and `weaviate` or `FAISS` and store vectors on message creation.
* **Async tasks:** Add Celery + Redis for background summarization and embedding generation.

---


#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "======================================================="
echo "  FairPack - LMPC Packaging Compliance & RAG Platform  "
echo "======================================================="

echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..."
cd "$DIR/backend"
./venv/bin/python run.py &
BACKEND_PID=$!

echo "[2/2] Starting Vite Frontend on http://localhost:5173..."
cd "$DIR/frontend"
npm run dev -- --host &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT INT TERM

echo ""
echo "✨ FairPack is running!"
echo "   Frontend: http://localhost:5173"
echo "   API Docs: http://127.0.0.1:8000/docs"
echo "Press Ctrl+C to stop both servers."

wait

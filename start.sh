#!/bin/bash
echo ""
echo "╔══════════════════════════════════════╗"
echo "║     🚀 Basel Hub - Starting...       ║"
echo "╚══════════════════════════════════════╝"
echo ""

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first time only..."
    npm install
fi

echo ""
echo "✅ Opening Basel Hub in your browser..."
echo ""
open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null
npm run dev

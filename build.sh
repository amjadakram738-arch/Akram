#!/bin/bash
npm run build
cp -r icons dist/
cp -r _locales dist/
cp manifest.json dist/
cp offscreen.html dist/
cp offscreen.js dist/
# Adjust manifest to point to the right files if needed
# Actually, Vite's output structure might need some adjustment to match manifest.json expectations

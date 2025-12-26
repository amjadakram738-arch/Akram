#!/bin/bash
# Generate icon PNG files from SVG

# Create SVG icon
cat > icon.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="#4CAF50"/>
  <text x="64" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle">VT</text>
  <path d="M 30 90 Q 64 100 98 90" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="35" r="8" fill="white" opacity="0.8"/>
  <circle cx="64" cy="30" r="8" fill="white" opacity="0.8"/>
  <circle cx="88" cy="35" r="8" fill="white" opacity="0.8"/>
</svg>
SVGEOF

# Check if ImageMagick or rsvg-convert is available
if command -v convert &> /dev/null; then
    # Use ImageMagick
    convert icon.svg -resize 16x16 icon16.png
    convert icon.svg -resize 48x48 icon48.png
    convert icon.svg -resize 128x128 icon128.png
    echo "Icons generated with ImageMagick"
elif command -v rsvg-convert &> /dev/null; then
    # Use rsvg-convert
    rsvg-convert -w 16 -h 16 icon.svg -o icon16.png
    rsvg-convert -w 48 -h 48 icon.svg -o icon48.png
    rsvg-convert -w 128 -h 128 icon.svg -o icon128.png
    echo "Icons generated with rsvg-convert"
else
    # Fallback: create placeholder PNG files using base64 encoded 1x1 pixel
    echo "No icon converter available, creating placeholder PNG files"
    # Create minimal valid PNG files
    echo -n "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > icon16.png
    echo -n "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > icon48.png
    echo -n "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > icon128.png
fi

echo "Icon files created"
ls -la *.png

#!/bin/bash
# Create simple PNG icons using ImageMagick or fallback

# Colors
BG_COLOR="#3b82f6"
TEXT_COLOR="white"

for SIZE in 16 32 48 128; do
    convert -size ${SIZE}x${SIZE} xc:"${BG_COLOR}" \
        -fill "${TEXT_COLOR}" \
        -draw "roundrectangle 0,0 $((SIZE-1)),$((SIZE-1)) $((SIZE/5)),$((SIZE/5))" \
        -draw "rectangle $((SIZE/4)),$((SIZE/3)) $((SIZE*3/4)),$((SIZE/3 + SIZE/10))" \
        -draw "rectangle $((SIZE/4)),$((SIZE/2)) $((SIZE-SIZE/4)),$((SIZE/2 + SIZE/10))" \
        -draw "rectangle $((SIZE/4)),$((SIZE*2/3)) $((SIZE*3/4)),$((SIZE*2/3 + SIZE/10))" \
        "icon${SIZE}.png" 2>/dev/null && echo "Created icon${SIZE}.png"
done

echo "Icons created!"

#!/bin/bash

# SVG Sprite Generator
# 
# Generates a single SVG sprite file from individual icon files.
# All icons are normalized to use currentColor for easy theming.
#
# Usage: npm run sprites
# Input: src/assets/icons/sprites/*.svg (individual icons)
# Output: src/assets/icons/sprites/sprite.svg (combined sprite)
#
# References:
# - https://css-tricks.com/svg-sprites-use-better-icon-fonts/
# - https://github.com/svg/svgo

ICONS_DIR="src/assets/icons/sprites"
SPRITE_FILE="$ICONS_DIR/sprite.svg"

echo "Generating SVG sprite..."

# Normalize SVG colors to currentColor for theme compatibility
# This allows icons to inherit text color from parent elements
normalize_svg_colors() {
    local file="$1"
    local temp_file=$(mktemp)
    
    # Replace various color formats with currentColor
    # Supports: hex colors (#RRGGBB, #RGB), named colors (black), stroke/fill attributes
    sed 's/fill="#[0-9a-fA-F]\{6\}"/fill="currentColor"/g' "$file" | \
    sed 's/fill="#[0-9a-fA-F]\{3\}"/fill="currentColor"/g' | \
    sed 's/stroke="#[0-9a-fA-F]\{6\}"/stroke="currentColor"/g' | \
    sed 's/stroke="#[0-9a-fA-F]\{3\}"/stroke="currentColor"/g' | \
    sed 's/fill="black"/fill="currentColor"/g' | \
    sed 's/fill="#000000"/fill="currentColor"/g' | \
    sed 's/fill="#000"/fill="currentColor"/g' | \
    sed 's/stroke="black"/stroke="currentColor"/g' | \
    sed 's/stroke="#000000"/stroke="currentColor"/g' | \
    sed 's/stroke="#000"/stroke="currentColor"/g' > "$temp_file"
    
    echo "$temp_file"
}

# Create sprite header with hidden container
cat > "$SPRITE_FILE" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
EOF

# Process individual SVG file and wrap in <symbol>
process_svg() {
    local file="$1"
    local id="$2"
    
    # Normalize colors first
    local normalized_file=$(normalize_svg_colors "$file")
    
    # Extract SVG content and wrap in symbol with viewBox
    # Default viewBox is 0 0 256 256 - adjust if your icons use different dimensions
    echo "    <symbol id=\"$id\" viewBox=\"0 0 256 256\">"
    
    # Extract content between <svg> tags, remove svg wrapper, indent properly
    sed -n '/<svg/,/<\/svg>/p' "$normalized_file" | \
    sed '1s/<svg[^>]*>//' | \
    sed '$s/<\/svg>//' | \
    sed '/^$/d' | \
    sed 's/^/      /'
    
    echo "    </symbol>"
    
    # Clean up temp file
    rm "$normalized_file"
}

# Process all SVG files in sprites directory
echo "Processing icons..."
for file in "$ICONS_DIR"/*.svg; do
    if [ -f "$file" ] && [[ "$file" != *"sprite.svg" ]]; then
        filename=$(basename "$file" .svg)
        id="$filename"
        echo "  Processing: $id"
        process_svg "$file" "$id" >> "$SPRITE_FILE"
    fi
done

# Close sprite
cat >> "$SPRITE_FILE" << 'EOF'
  </defs>
</svg>
EOF

echo "Sprite generated at: $SPRITE_FILE"
echo "Icons included:"
grep -o 'id="[^"]*"' "$SPRITE_FILE" | sed 's/id="//g; s/"//g' | sort

# Verification
echo ""
echo "Checking sprite content..."
total_symbols=$(grep -c "<symbol" "$SPRITE_FILE")
total_paths=$(grep -c "<path" "$SPRITE_FILE")
echo "Found $total_symbols symbols with $total_paths paths"

if [ "$total_paths" -eq 0 ]; then
    echo "Warning: No paths found in sprite. Checking SVG format..."
    echo "Sample SVG content:"
    head -5 "$ICONS_DIR"/*.svg | head -10
fi
#!/bin/bash

# Script to generate SVG sprite from individual icon files
ICONS_DIR="src/assets/icons/sprites"
SPRITE_FILE="$ICONS_DIR/sprite.svg"

echo "Generating SVG sprite..."

# Function to normalize SVG colors to currentColor
normalize_svg_colors() {
    local file="$1"
    # Create temporary file
    local temp_file=$(mktemp)
    
    # Replace various color formats with currentColor
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

# Create sprite header
cat > "$SPRITE_FILE" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
EOF

# Function to process SVG files
process_svg() {
    local file="$1"
    local id="$2"
    
    # Normalize colors first
    local normalized_file=$(normalize_svg_colors "$file")
    
    # Extract everything between <svg> and </svg>, remove svg tags, wrap in symbol
    echo "    <symbol id=\"$id\" viewBox=\"0 0 256 256\">"
    
    # Extract content more reliably
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
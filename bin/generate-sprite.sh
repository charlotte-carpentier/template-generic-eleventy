#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# UTILITY › SVG Sprite Generator
# Combines individual icons into a single sprite file
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# Usage: npm run sprites
# Input:  src/assets/icons/sprites/*.svg
# Output: src/assets/icons/sprites/sprite.svg
#
# Features:
# - Normalizes colors to currentColor for theming
# - Wraps icons in <symbol> tags with unique IDs
# - PRESERVES original viewBox from source SVGs
# - Validates output with symbol and path counts
#

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ICONS_DIR="src/assets/icons/sprites"
SPRITE_FILE="$ICONS_DIR/sprite.svg"

echo "Generating SVG sprite..."

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helper Functions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Normalize SVG colors to currentColor for theme compatibility
normalize_svg_colors() {
    local file="$1"
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

# Extract viewBox from SVG file
extract_viewbox() {
    local file="$1"
    local viewbox=$(grep -oP 'viewBox="\K[^"]+' "$file" | head -1)
    
    # Fallback to default if no viewBox found
    if [ -z "$viewbox" ]; then
        echo "0 0 24 24"
    else
        echo "$viewbox"
    fi
}

# Process individual SVG file and wrap in <symbol>
process_svg() {
    local file="$1"
    local id="$2"
    
    # Normalize colors first
    local normalized_file=$(normalize_svg_colors "$file")
    
    # Extract original viewBox
    local viewbox=$(extract_viewbox "$file")
    
    # Wrap in symbol with original viewBox
    echo "    <symbol id=\"$id\" viewBox=\"$viewbox\">"
    
    # Extract content between <svg> tags, remove wrapper, indent properly
    sed -n '/<svg/,/<\/svg>/p' "$normalized_file" | \
    sed '1s/<svg[^>]*>//' | \
    sed '$s/<\/svg>//' | \
    sed '/^$/d' | \
    sed 's/^/      /'
    
    echo "    </symbol>"
    
    # Clean up temp file
    rm "$normalized_file"
}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Sprite Generation
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Create sprite header
cat > "$SPRITE_FILE" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
EOF

# Process all SVG files
echo "Processing icons..."
for file in "$ICONS_DIR"/*.svg; do
    if [ -f "$file" ] && [[ "$file" != *"sprite.svg" ]]; then
        filename=$(basename "$file" .svg)
        id="$filename"
        viewbox=$(extract_viewbox "$file")
        echo "  Processing: $id (viewBox: $viewbox)"
        process_svg "$file" "$id" >> "$SPRITE_FILE"
    fi
done

# Close sprite
cat >> "$SPRITE_FILE" << 'EOF'
  </defs>
</svg>
EOF

echo "Sprite generated at: $SPRITE_FILE"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Verification
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
echo "Icons included:"
grep -o 'id="[^"]*"' "$SPRITE_FILE" | sed 's/id="//g; s/"//g' | sort

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

echo ""
echo "Sprite generation complete!"
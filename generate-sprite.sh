#!/bin/bash

# Script pour générer un sprite SVG à partir de tes icônes
ICONS_DIR="src/assets/icons"
SPRITE_FILE="src/sprites/sprite.svg"

echo "🎨 Generating SVG sprite..."

# Create sprite header
cat > "$SPRITE_FILE" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>
EOF

# Function to process SVG files - VERSION CORRIGÉE
process_svg() {
    local file="$1"
    local id="$2"
    
    # Extract everything between <svg> and </svg>, remove svg tags, wrap in symbol
    echo "    <symbol id=\"$id\" viewBox=\"0 0 256 256\">"
    
    # Extract content more reliably
    sed -n '/<svg/,/<\/svg>/p' "$file" | \
    sed '1s/<svg[^>]*>//' | \
    sed '$s/<\/svg>//' | \
    sed '/^$/d' | \
    sed 's/^/      /'
    
    echo "    </symbol>"
}

# Process interface icons
echo "Processing interface icons..."
echo "    <!-- Interface Icons -->" >> "$SPRITE_FILE"
for file in "$ICONS_DIR"/interface/*.svg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .svg)
        id="interface-$filename"
        echo "  Processing: $id"
        process_svg "$file" "$id" >> "$SPRITE_FILE"
    fi
done

# Process avatar icons (all subdirectories)
echo "Processing avatar icons..."
echo "    <!-- Avatar Icons -->" >> "$SPRITE_FILE"
find "$ICONS_DIR/avatar" -name "*.svg" | while read file; do
    # Get relative path from avatar directory
    rel_path="${file#$ICONS_DIR/avatar/}"
    # Create ID by replacing slashes and dots
    id="avatar-$(echo "$rel_path" | sed 's/[\/\.]/-/g' | sed 's/-svg$//')"
    echo "  Processing: $id"
    process_svg "$file" "$id" >> "$SPRITE_FILE"
done

# Process foundation icons
echo "Processing foundation icons..."
echo "    <!-- Foundation Icons -->" >> "$SPRITE_FILE"
for file in "$ICONS_DIR"/foundation/*.svg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .svg)
        id="foundation-$filename"
        echo "  Processing: $id"
        process_svg "$file" "$id" >> "$SPRITE_FILE"
    fi
done

# Process fragment icons
echo "Processing fragment icons..."
echo "    <!-- Fragment Icons -->" >> "$SPRITE_FILE"
for file in "$ICONS_DIR"/fragments/*.svg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .svg)
        id="fragment-$filename"
        echo "  Processing: $id"
        process_svg "$file" "$id" >> "$SPRITE_FILE"
    fi
done

# Close sprite
cat >> "$SPRITE_FILE" << 'EOF'
  </defs>
</svg>
EOF

echo "✅ Sprite generated at: $SPRITE_FILE"
echo "📊 Icons included:"
grep -o 'id="[^"]*"' "$SPRITE_FILE" | sed 's/id="//g; s/"//g' | sort

# Verification
echo ""
echo "🔍 Checking sprite content..."
total_symbols=$(grep -c "<symbol" "$SPRITE_FILE")
total_paths=$(grep -c "<path" "$SPRITE_FILE")
echo "📈 Found $total_symbols symbols with $total_paths paths"

if [ "$total_paths" -eq 0 ]; then
    echo "⚠️  Warning: No paths found in sprite. Checking SVG format..."
    echo "Sample SVG content:"
    head -5 "$ICONS_DIR/interface"/*.svg | head -10
fi
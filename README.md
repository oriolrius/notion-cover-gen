# SVG Text Editor

A professional Node.js CLI tool for editing SVG text headers with automatic font size adjustment and PNG conversion using resvg-js.

## Quick Start

```bash
# Install dependencies and link command
npm install
npm link

# Generate a header with custom text and background
svg-editor generate -t templates/base.svg -b samples/collage.jpg -o samples/output 'This is a Sample Text'
```

Output:
- Smart text color selection (dark/light based on background)
- Both SVG and PNG files generated automatically
- Font size auto-calculated to fit text

## Features

- ✨ **Automatic font size calculation** - Intelligently adjusts font size to fit text within SVG width
- 🎨 **Dual format output** - Generates both SVG and PNG files simultaneously
- 🖼️ **High-quality PNG conversion** - Uses resvg-js for professional-grade rendering
- 🎭 **Background image replacement** - Embed custom PNG/JPG backgrounds with base64 encoding
- 🌈 **Smart text color detection** - Automatically selects optimal text color based on background brightness
- 🚀 **CLI interface** - Easy-to-use command-line tool with multiple commands
- 📦 **Batch generation** - Create multiple headers at once
- ⚡ **Flexible options** - Control font size, output format, and PNG scale
- 🔍 **HTML escaping** - Safely handles special characters in text
- 📊 **Size reporting** - Shows file sizes and generation statistics

## Installation

```bash
npm install

# Link the CLI command globally
npm link
```

After installation, you can use the `svg-editor` command directly:

```bash
svg-editor --help
```

## Usage

### 1. Basic Generation with Custom Background

The most common use case - generate a header with custom text and background image:

```bash
svg-editor generate -t templates/base.svg -b samples/collage.jpg -o samples/output 'This is a Sample Text'
```

Output:
```
✅ Background image replaced: collage.jpg
📊 Image brightness: 83.8%
🎨 Selected text color: #1a1a1a (dark)
✅ SVG saved to: samples/output.svg (156 KB)
✅ PNG saved to: samples/output.png (805 KB)
```

**Note**: Text with spaces must be quoted.

### 2. Using Original Template (Without Custom Background)

Use the original notion.svg template with its default background:

```bash
svg-editor generate "Computer Science" -o output
```

Output:
- `output.svg` (998 KB)
- `output.png` (1.5 MB)

### 3. Custom Font Size

Override automatic font size calculation:

```bash
svg-editor generate -t templates/base.svg -b samples/collage.jpg 'My Header' -s 200
```

### 4. High-Resolution PNG

Generate PNG at 2x resolution for retina displays:

```bash
svg-editor generate -t templates/base.svg -b samples/collage.jpg 'Deep Learning' --png-scale 2
```

### 5. SVG Only (Skip PNG)

Generate SVG only without PNG conversion:

```bash
svg-editor generate -t templates/base.svg 'Machine Learning' -o ml-header --no-png
```

### 6. Batch Generation

Generate multiple headers at once with the same template and background:

```bash
svg-editor batch "Biology" "Chemistry" "Physics" -t templates/base.svg -p science- -d samples
```

Output:
- `samples/science-1.svg` / `samples/science-1.png`
- `samples/science-2.svg` / `samples/science-2.png`
- `samples/science-3.svg` / `samples/science-3.png`

### 7. Convert Existing SVG to PNG

Convert any SVG file to PNG:

```bash
svg-editor convert samples/output.svg -o samples/output-hires.png -s 2
```

### 8. Smart Text Color Detection

The tool automatically selects optimal text color based on background brightness:

```bash
# Light background (83.8% brightness) → dark text
svg-editor generate -t templates/base.svg -b samples/collage.jpg 'Sample Text'
# Output: Text color #1a1a1a (dark)

# Dark background (< 50% brightness) → white text
svg-editor generate -t templates/base.svg -b dark-photo.jpg 'Sample Text'
# Output: Text color #ffffff (white)
```

**How it works:**
- Analyzes background image using color histogram
- Calculates average brightness using luminance formula (0.299×R + 0.587×G + 0.114×B)
- Selects white text (#ffffff) for dark backgrounds (brightness < 50%)
- Selects dark text (#1a1a1a) for light backgrounds (brightness ≥ 50%)
- Ensures optimal contrast and readability

**Disable if needed:**
```bash
svg-editor generate -t templates/base.svg -b samples/collage.jpg 'My Text' --no-auto-color
```

## Command Reference

### `generate` - Generate SVG and PNG

```bash
svg-editor generate <text> [options]
```

**Options:**
- `-t, --template <file>` - Template SVG file (default: "../notion.svg")
- `-b, --background <file>` - Background image (PNG/JPG) to embed in SVG
- `-o, --output <file>` - Output file path without extension (default: "output")
- `-s, --size <number>` - Fixed font size (auto-calculated if not provided)
- `--no-png` - Skip PNG generation (SVG only)
- `--png-scale <number>` - PNG scale factor for higher resolution (default: 1)
- `--no-auto-color` - Disable automatic text color detection from background

**Examples:**
```bash
# Complete example with template and background
svg-editor generate -t templates/base.svg -b samples/collage.jpg -o samples/output 'Hello World'

# Custom font size
svg-editor generate -t templates/base.svg -b samples/collage.jpg -s 200 'My Title'

# High-res PNG (2x scale)
svg-editor generate -t templates/base.svg -b samples/collage.jpg --png-scale 2 'Banner'

# SVG only (no PNG)
svg-editor generate -t templates/base.svg -o samples/header --no-png 'Title'

# Using original notion.svg template
svg-editor generate "Computer Science" -o output
```

### `batch` - Generate Multiple Files

```bash
svg-editor batch <texts...> [options]
```

**Options:**
- `-t, --template <file>` - Template SVG file (default: "../notion.svg")
- `-p, --prefix <string>` - Output file prefix (default: "header-")
- `-d, --output-dir <dir>` - Output directory (default: ".")
- `--no-png` - Skip PNG generation (SVG only)
- `--png-scale <number>` - PNG scale factor (default: 1)

**Examples:**
```bash
# Basic batch with template
svg-editor batch "Item 1" "Item 2" "Item 3" -t templates/base.svg -d samples

# Custom prefix and directory
svg-editor batch "Biology" "Chemistry" "Physics" -t templates/base.svg -p science- -d samples

# Batch without PNG (SVG only)
svg-editor batch "Math" "Science" "History" -t templates/base.svg -d samples --no-png
```

### `convert` - Convert SVG to PNG

```bash
svg-editor convert <input> [options]
```

**Options:**
- `-o, --output <file>` - Output PNG file (default: same name as input)
- `-s, --scale <number>` - Scale factor for PNG (default: 1)

**Examples:**
```bash
# Simple conversion
svg-editor convert samples/output.svg

# With custom output and 2x scale
svg-editor convert samples/output.svg -o samples/output-hires.png -s 2

# 3x scale for ultra-high resolution
svg-editor convert samples/output.svg -s 3
```

## Template System

### Available Templates

**Base Template** (recommended)
- Path: `templates/base.svg`
- Size: ~1.8 KB with simple background
- Best for most use cases with custom backgrounds

**Original Template** (default fallback)
- Path: `../notion.svg`
- Size: ~998 KB with full embedded background
- Use when you don't provide `-b` option

### Using Templates

```bash
# Use base template with custom background (recommended)
svg-editor generate -t templates/base.svg -b samples/collage.jpg 'My Text'

# Use original template (large file, has default background)
svg-editor generate 'My Text'
```

### Custom Template Format

You can use any SVG template that contains text in this format:

```xml
<div style="display: inline-block; font-size: 170px; ...">
  Your Text Here
</div>
```

## Font Size Calculation

The tool automatically calculates optimal font size using this algorithm:

```javascript
// Ubuntu Bold font: ~0.6 ratio
const charWidthRatio = 0.6;
const optimalSize = maxWidth / (text.length * charWidthRatio);

// Clamped between 40px and 250px
fontSize = Math.max(40, Math.min(optimalSize, 250));
```

**Examples:**
- "AI" (2 chars) → 250px (max limit)
- "Computer Science" (16 chars) → 145px
- "Artificial Intelligence and Machine Learning" (44 chars) → 53px

## PNG Conversion

PNG conversion uses [resvg-js](https://github.com/yisibl/resvg-js), a high-quality SVG rendering library.

**Features:**
- System font loading for accurate rendering
- Configurable scale for high-resolution output
- Professional-grade quality
- Fast conversion

**Scale Factors:**
- `1` - Standard resolution (default)
- `2` - Retina/HiDPI (2x size)
- `3` - Ultra-high resolution (3x size)

## Code Quality Improvements

### Better Error Handling
- File existence validation
- Template path resolution
- Empty text validation
- PNG conversion error handling

### HTML Escaping
Safely handles special characters:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#039;`

### Size Formatting
Human-readable file size display:
- Bytes, KB, MB, GB
- Precise to 2 decimal places

### Modular Architecture
- Separation of concerns (CLI vs core logic)
- Reusable SVGTextEditor class
- Extensible command structure

## Programmatic Usage

Use the module directly in your Node.js code:

```javascript
const SVGTextEditor = require('./svg-editor');

const editor = new SVGTextEditor('../notion.svg');

// Generate with auto font size and both formats
await editor.generate('My Text', 'output', {
  fontSize: null,        // Auto-calculate
  generatePNG: true,     // Generate PNG
  pngScale: 1,          // Standard resolution
});

// Generate with custom background and auto text color
await editor.generate('My Text', 'output', {
  backgroundImage: './my-background.jpg',
  autoColor: true,       // Auto-detect text color (default)
});

// Generate with custom background, disable auto color
await editor.generate('My Text', 'output', {
  backgroundImage: './my-background.jpg',
  autoColor: false,      // Keep original text color
});

// Generate SVG only
await editor.generate('My Text', 'output', {
  generatePNG: false,
});

// High-res PNG
await editor.generate('My Text', 'output', {
  pngScale: 2,
});

// Just get SVG content
const svgContent = editor.updateText('My Text', 180);

// Convert SVG to PNG
const pngBuffer = editor.convertToPNG(svgContent, 2);
```

## Project Structure

```
svg-editor/
├── cli.js              # Command-line interface
├── svg-editor.js       # Core editing logic with PNG conversion
├── package.json        # Project dependencies
├── README.md           # Main documentation
├── templates/          # SVG templates
│   └── base.svg        # Lightweight template (1.8 KB)
└── samples/            # Sample images and outputs
    ├── collage.jpg     # Sample background image
    ├── output.svg      # Generated SVG example
    └── output.png      # Generated PNG example
```

## Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0

## Dependencies

- `@resvg/resvg-js` - High-quality SVG to PNG conversion
- `@svgdotjs/svg.js` - SVG manipulation library
- `svgdom` - DOM implementation for Node.js
- `commander` - CLI framework
- `sharp` - Image processing for color analysis and brightness detection

## Performance

**Generation Speed:**
- Single SVG+PNG: ~100-300ms
- Batch (10 items): ~1-3 seconds

**File Sizes:**
- SVG: ~1 MB (with original template)
- PNG: ~1.5 MB (standard resolution)
- PNG 2x: ~6 MB (retina resolution)

## Examples

### Create Blog Headers

```bash
#!/bin/bash

# Create headers for blog posts
node cli.js batch \
  "Introduction to AI" \
  "Machine Learning Basics" \
  "Deep Learning Guide" \
  "Neural Networks 101" \
  -d ./blog-headers \
  -p post-
```

### Generate Social Media Banners

```bash
# High-res banners for social media
node cli.js generate "My Awesome Project" \
  -o social-banner \
  --png-scale 2
```

### Batch Process with Custom Sizes

```bash
# Generate multiple sizes
for text in "Header 1" "Header 2" "Header 3"; do
  node cli.js generate "$text" -o "output-$text" -s 200
done
```

## Troubleshooting

### PNG generation fails

If PNG generation fails, check:
1. System fonts are installed (Ubuntu font for best results)
2. Sufficient disk space
3. File permissions in output directory

### Font size too small/large

Adjust manually with `-s` option:
```bash
node cli.js generate "Text" -o output -s 180
```

Or modify min/max limits in `svg-editor.js`:
```javascript
calculateFontSize(text, maxWidth = 1400, minSize = 40, maxSize = 250)
```

## License

ISC

## Contributing

Contributions welcome! Please ensure code quality and add tests for new features.

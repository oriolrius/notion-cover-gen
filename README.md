# Notion Cover Gen 🎨

> AI-powered CLI & n8n node for generating beautiful Notion blog post covers in seconds

Create professional Notion blog covers without design skills. Combines SVG templates, Freepik stock images, smart text sizing, and automatic color contrast detection. Use as CLI or integrate into n8n workflows. Perfect for content creators who want beautiful headers fast.

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oriolrius/notion-cover-gen?style=for-the-badge&logo=npm&color=CB3837)](https://www.npmjs.com/package/@oriolrius/notion-cover-gen)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/oriolrius/notion-cover-gen/publish.yml?style=for-the-badge&logo=github&label=publish)](https://github.com/oriolrius/notion-cover-gen/actions)
[![license](https://img.shields.io/npm/l/@oriolrius/notion-cover-gen?style=for-the-badge&color=blue)](https://github.com/oriolrius/notion-cover-gen/blob/main/LICENSE)

[![node version](https://img.shields.io/node/v/@oriolrius/notion-cover-gen?style=for-the-badge&logo=node.js&color=339933)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/oriolrius/notion-cover-gen?style=for-the-badge&logo=github&color=yellow)](https://github.com/oriolrius/notion-cover-gen/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/oriolrius/notion-cover-gen?style=for-the-badge&logo=github&color=red)](https://github.com/oriolrius/notion-cover-gen/issues)

[![Notion](https://img.shields.io/badge/Made_for-Notion-000000?style=for-the-badge&logo=notion&logoColor=white)](https://notion.so)
[![Freepik API](https://img.shields.io/badge/Powered_by-Freepik_API-1273EB?style=for-the-badge&logo=freepik&logoColor=white)](https://freepik.com/api)

</div>

## ✨ Why Notion Cover Gen?

Writing blog posts in Notion? Tired of:
- 🎨 Spending hours in design tools for each cover?
- 🔍 Searching stock photo sites manually?
- ⚙️ Resizing and cropping images to fit Notion?
- 🎯 Picking text colors that actually look good?

**Notion Cover Gen solves all of this in one command.**

## 🚀 Quick Start

```bash
# Install globally
npm install -g @oriolrius/notion-cover-gen

# Set up your Freepik API key (get it free at freepik.com/api)
echo "FREEPIK_API_KEY=your_key_here" > .env

# Generate a cover in seconds
notion-cover-gen "My Blog Post Title" --search "technology abstract" --crop --blur 5
```

**Output:**
- ✅ Perfect 5:2 Notion cover aspect ratio
- ✅ Auto-selected text color for maximum contrast
- ✅ Text sized to fit perfectly
- ✅ Professional blur effect for readability
- ✅ Both SVG and PNG formats

## 🔌 n8n Integration

**NEW:** Use Notion Cover Gen directly in your n8n workflows! Automate cover generation for blog posts, social media, or any content pipeline.

### Quick Setup

1. Install in n8n: **Settings** > **Community Nodes** > `@oriolrius/notion-cover-gen`
2. Add your Freepik API credentials (optional, for image search)
3. Use in workflows with 3 operations: **Generate**, **Convert**, **Replace Background**

### Example Workflow

```
Webhook → Notion Cover Gen → Move Binary → Upload to S3
```

Generate covers automatically when:
- New blog post created in CMS
- Notion database entry added
- Scheduled content published
- Social media post scheduled

**[📖 Full n8n Documentation →](./N8N_NODE.md)**

## 🎯 Features

### 🤖 AI-Powered Image Search
- Search Freepik's millions of stock images with natural language
- Pick from multiple results with `--search-index`
- No manual browsing required

### 🎨 Smart Automatic Styling
- **Auto text color** - Analyzes background brightness and picks perfect contrast
- **Auto text sizing** - Fits your title perfectly in the width
- **Auto cropping** - Perfect 5:2 ratio for Notion covers

### ⚡ Professional Effects
- **Gaussian blur** - Make busy backgrounds work with `--blur`
- **5:2 cropping** - Automatic center-focused crop with `--crop`
- **High-res export** - 2x/3x resolution with `--png-scale`

### 📦 Flexible Workflows
- Use Freepik search OR your own images
- Batch generate multiple covers at once
- Template-based for consistent branding

## 📖 Usage Examples

### Generate with Freepik Search
```bash
# Basic - Search and use first result
notion-cover-gen "Machine Learning Basics" --search "ai technology"

# Advanced - Pick second result, crop and blur
notion-cover-gen "Data Science Guide" --search "analytics charts" --search-index 1 --crop --blur 8

# High quality - 2x resolution for crisp rendering
notion-cover-gen "Python Tutorial" --search "code programming" --crop --blur 5 --png-scale 2
```

### Generate with Your Own Images
```bash
# Use local image with auto-crop and blur
notion-cover-gen "Travel Adventures" -b ~/photos/travel.jpg --crop --blur 10

# Custom font size
notion-cover-gen "Quick Update" -b background.png -s 180

# SVG only (no PNG)
notion-cover-gen "Design System" -b pattern.jpg --no-png
```

### Batch Generate Multiple Covers
```bash
notion-cover-gen batch \
  "Introduction to AI" \
  "Machine Learning 101" \
  "Deep Learning Guide" \
  --search "artificial intelligence" \
  --crop --blur 6 \
  -d ./covers
```

## 🎨 Perfect for Notion Blogs

Notion blog covers need specific dimensions and styling:
- **5:2 aspect ratio** (2500×1000px recommended)
- **Text readability** against various backgrounds
- **Professional look** without design experience
- **Fast iteration** for multiple posts

Notion Cover Gen handles all of this automatically.

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g @oriolrius/notion-cover-gen
```

### Local Project Installation
```bash
npm install @oriolrius/notion-cover-gen
```

### From Source
```bash
git clone https://github.com/oriolrius/notion-cover-gen.git
cd notion-cover-gen
npm install
npm link
```

## ⚙️ Configuration

### Freepik API Key (Required for --search)

1. Get free API key: https://www.freepik.com/api/
2. Create `.env` file:
```bash
FREEPIK_API_KEY=your_api_key_here
```

See `.env.example` for reference.

## 📚 Command Reference

### `generate` - Generate a Notion Cover

```bash
notion-cover-gen generate <text> [options]
```

**Arguments:**
- `<text>` - Title text for your cover (use quotes for multiple words)

**Options:**
- `-o, --output <file>` - Output filename without extension (default: "output")
- `-t, --template <file>` - SVG template to use (default: built-in template)
- `-s, --size <number>` - Fixed font size (auto-calculated if not provided)
- `-b, --background <file>` - Use local image as background
- `--search <caption>` - Search Freepik for background image
- `--search-index <number>` - Which search result to use: 0=first, 1=second, etc. (default: 0)
- `--crop` - Auto-crop to 5:2 Notion aspect ratio
- `--blur <number>` - Apply blur effect: 5=light, 10=medium, 20=heavy
- `--png-scale <number>` - PNG resolution scale: 1=normal, 2=retina (default: 1)
- `--no-png` - Generate SVG only
- `--no-auto-color` - Disable automatic text color selection

**Examples:**
```bash
# Search Freepik and use first result
notion-cover-gen "Getting Started with React" --search "react javascript"

# Use second search result with effects
notion-cover-gen "Advanced TypeScript" --search "typescript code" --search-index 1 --crop --blur 8

# Local image with custom settings
notion-cover-gen "My Blog Post" -b photo.jpg --crop --blur 5 -s 200

# High-res for crisp quality
notion-cover-gen "Professional Guide" --search "business minimal" --png-scale 2

# Combine all features
notion-cover-gen "Complete Tutorial" \
  --search "education learning" \
  --search-index 2 \
  --crop \
  --blur 10 \
  --png-scale 2 \
  -o tutorial-cover
```

### `batch` - Generate Multiple Covers

```bash
notion-cover-gen batch <texts...> [options]
```

**Arguments:**
- `<texts...>` - Multiple titles (space-separated, quoted)

**Options:**
- `-t, --template <file>` - Template SVG file
- `-p, --prefix <string>` - Output filename prefix (default: "header-")
- `-d, --output-dir <dir>` - Output directory (default: ".")
- `--no-png` - Generate SVG only
- `--png-scale <number>` - PNG scale factor (default: 1)

**Example:**
```bash
notion-cover-gen batch \
  "Chapter 1: Introduction" \
  "Chapter 2: Getting Started" \
  "Chapter 3: Advanced Topics" \
  -p chapter- \
  -d ./covers \
  --png-scale 2
```

### `convert` - Convert SVG to PNG

```bash
notion-cover-gen convert <input> [options]
```

**Options:**
- `-o, --output <file>` - Output PNG file
- `-s, --scale <number>` - Scale factor (default: 1)

**Example:**
```bash
notion-cover-gen convert cover.svg -o cover-2x.png -s 2
```

### `replace-background` - Update Template Background

```bash
notion-cover-gen replace-background <template> <image> [options]
```

**Options:**
- `-o, --output <file>` - Output file (default: overwrites template)
- `--crop` - Crop to 5:2 ratio
- `--blur <number>` - Apply blur effect

**Example:**
```bash
notion-cover-gen replace-background template.svg new-photo.jpg --crop --blur 8
```

## 🎨 Design Tips

### Blur Guidelines
- **Light (3-7)** - Subtle softening, keeps image details
- **Medium (8-15)** - Good balance for most text
- **Heavy (16-30)** - Strong blur for very busy images

### Text Sizing
- Auto-sizing works best for 10-50 characters
- Use `-s` flag for very short titles (<5 chars)
- Longer titles automatically scale down

### Image Selection
- Use `--search-index` to try different images from same search
- Combine `--crop --blur 10` for best text readability
- Use `--png-scale 2` for high-DPI displays

### Notion-Specific
- Always use `--crop` for perfect Notion dimensions
- Recommended size: 2500×1000px (use `--png-scale 1.67` from default)
- Test multiple blur levels: 5, 10, 15

## 🔧 Technical Details

### Processing Pipeline
1. **Image Acquisition** - Freepik API search OR local file
2. **Cropping** - Center-focused 5:2 aspect ratio (if --crop)
3. **Blur** - Gaussian blur effect (if --blur)
4. **Color Analysis** - Calculate optimal text color
5. **Text Sizing** - Auto-fit text to width
6. **SVG Generation** - Embed image + text in template
7. **PNG Conversion** - High-quality resvg-js rendering

### Image Processing
- **Cropping**: Sharp library, center-focused extraction
- **Blur**: Gaussian blur with configurable sigma (0.3-100)
- **Color Detection**: Luminance-based contrast calculation
- **PNG Export**: resvg-js with system font support

### File Output
- **SVG**: Compact, scalable, editable
- **PNG**: Production-ready, high-quality raster
- **Templates**: Reusable with any image
- **Temp Cache**: Downloaded images cached in `temp/`

## 📁 Project Structure

```
notion-cover-gen/
├── cli.js              # CLI interface
├── svg-editor.js       # Core generation logic
├── package.json        # npm package config
├── README.md           # This file
├── LICENSE             # ISC license
├── .env.example        # Environment config template
├── templates/          # SVG templates
│   └── base.svg        # Default Notion cover template
└── .github/
    └── workflows/
        └── publish.yml # Auto-publish to npm
```

## 🛠️ Development

### CLI Development

```bash
# Clone repository
git clone https://github.com/oriolrius/notion-cover-gen.git
cd notion-cover-gen

# Install dependencies
npm install

# Link for local development
npm link

# Test command
notion-cover-gen "Test Cover" --search "test"
```

### n8n Node Development & Testing

Test the n8n node locally using Docker:

```bash
# Start n8n with the custom node
./docker-test.sh start

# Access n8n at http://localhost:5678
# Username: admin / Password: admin
```

The node will be available in the **Transform** category as "Notion Cover Gen".

**[📖 Full Docker Testing Guide →](./DOCKER_TESTING.md)**

Available commands:
- `./docker-test.sh start` - Start n8n with custom node
- `./docker-test.sh logs` - View n8n logs
- `./docker-test.sh rebuild` - Rebuild after code changes
- `./docker-test.sh stop` - Stop n8n
- `./docker-test.sh clean` - Remove all Docker resources

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details

## 🙏 Credits

Built with:
- [@resvg/resvg-js](https://github.com/yisibl/resvg-js) - High-quality SVG rendering
- [sharp](https://github.com/lovell/sharp) - Fast image processing
- [commander](https://github.com/tj/commander.js) - CLI framework
- [n8n](https://n8n.io/) - Workflow automation integration
- [Freepik API](https://www.freepik.com/api/) - Stock image search

## 💬 Support

- 🐛 **Issues**: https://github.com/oriolrius/notion-cover-gen/issues
- 📖 **Docs**: https://github.com/oriolrius/notion-cover-gen#readme
- 📦 **npm**: https://www.npmjs.com/package/@oriolrius/notion-cover-gen

---

**Made with ❤️ for Notion content creators**

Generate beautiful blog covers in seconds, not hours.

# Notion Cover Gen - n8n Node Documentation

This package includes an n8n community node that brings all the CLI functionality into your n8n workflows.

## 🧪 Test Locally with Docker

Want to test the node before installing? Use our Docker setup:

```bash
./docker-test.sh start
```

Access n8n at http://localhost:5678 (admin/admin) with the node pre-installed.

**[📖 Full Docker Testing Guide →](./DOCKER_TESTING.md)**

## Installation

### In n8n Cloud or Self-hosted

1. Go to **Settings** > **Community Nodes**
2. Click **Install a community node**
3. Enter: `@oriolrius/notion-cover-gen`
4. Click **Install**

### Using npm

```bash
npm install @oriolrius/notion-cover-gen
```

## Setup

### Credentials (Optional)

The Freepik API credentials are only required if you want to use the image search functionality in the **Generate** operation.

1. Go to [Freepik API](https://www.freepik.com/api) and get your API key
2. In n8n, create new credentials for "Notion Cover Gen API"
3. Enter your Freepik API key

## Operations

### 1. Generate

Generate beautiful Notion covers with custom text and optional background images.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Text** | string | Yes | - | The text to display on the cover |
| **Template Path** | string | No | `./templates/notion.svg` | Path to your SVG template |
| **Output Path** | string | No | `./output` | Output path (without extension) |
| **Font Size** | number | No | 0 (auto) | Font size in pixels. Set to 0 for automatic sizing |
| **Use Freepik Search** | boolean | No | false | Enable image search from Freepik |
| **Search Caption** | string | Conditional | - | Search query for Freepik (required if Use Freepik Search is enabled) |
| **Search Index** | number | No | 0 | Which search result to use (0=first, 1=second, etc.) |
| **Background Image Path** | string | No | - | Path to local background image (PNG/JPG) |
| **Crop to 5:2 Ratio** | boolean | No | false | Automatically crop image to Notion's 5:2 aspect ratio |
| **Gaussian Blur** | number | No | 0 | Apply blur effect (0=none, 5=light, 15=heavy) |
| **Generate PNG** | boolean | No | true | Generate PNG in addition to SVG |
| **PNG Scale** | number | No | 1 | Scale factor for PNG (2 = double resolution) |
| **Auto Color** | boolean | No | true | Automatically choose text color based on background brightness |

#### Output

```json
{
  "success": true,
  "operation": "generate",
  "text": "Your Cover Text",
  "fontSize": 120,
  "textColor": "#ffffff",
  "textLength": 15,
  "svgPath": "/path/to/output.svg",
  "svgSize": 45678,
  "pngPath": "/path/to/output.png",
  "pngSize": 123456
}
```

#### Example Use Cases

**1. Blog Post Covers with Freepik Images**
```
Operation: Generate
Text: "{{$json.title}}"
Use Freepik Search: true
Search Caption: "{{$json.category}} technology"
Auto Color: true
```

**2. Custom Background with Local Image**
```
Operation: Generate
Text: "{{$json.heading}}"
Background Image Path: "/images/backgrounds/{{$json.bgImage}}"
Crop to 5:2 Ratio: true
Gaussian Blur: 5
```

**3. High-Resolution Output**
```
Operation: Generate
Text: "My Amazing Article"
PNG Scale: 2
Generate PNG: true
```

---

### 2. Convert

Convert existing SVG files to PNG format.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Input SVG Path** | string | Yes | - | Path to the SVG file to convert |
| **Output PNG Path** | string | No | (same as input) | Desired output PNG path |
| **Scale** | number | No | 1 | Scale factor for PNG resolution |

#### Output

```json
{
  "success": true,
  "operation": "convert",
  "inputPath": "/path/to/input.svg",
  "outputPath": "/path/to/output.png",
  "scale": 1,
  "pngSize": 89012
}
```

#### Example Use Cases

**Batch Convert Multiple SVGs**
```
Input SVG Path: "{{$json.svgFile}}"
Scale: 2
```

---

### 3. Replace Background

Update the background image in an existing SVG template.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| **Template SVG Path** | string | Yes | - | Path to your SVG template |
| **Image Path** | string | Yes | - | Path to new background image |
| **Output SVG Path** | string | No | (overwrites template) | Where to save the updated SVG |
| **Crop to 5:2 Ratio** | boolean | No | false | Crop image to 5:2 aspect ratio |
| **Gaussian Blur** | number | No | 0 | Apply blur effect to background |

#### Output

```json
{
  "success": true,
  "operation": "replaceBackground",
  "templatePath": "/path/to/template.svg",
  "imagePath": "/path/to/image.png",
  "outputPath": "/path/to/output.svg",
  "imageSize": 234567,
  "svgSize": 345678
}
```

#### Example Use Cases

**Update Template with Seasonal Images**
```
Template SVG Path: "/templates/base-template.svg"
Image Path: "/images/{{$json.season}}-background.jpg"
Crop to 5:2 Ratio: true
Output SVG Path: "/templates/{{$json.season}}-template.svg"
```

---

## Complete Workflow Example

Here's a complete n8n workflow that generates blog covers automatically:

1. **HTTP Request** - Fetch blog posts from your CMS
2. **Loop Over Items** - Process each blog post
3. **Notion Cover Gen (Generate)**
   - Text: `{{$json.title}}`
   - Use Freepik Search: `true`
   - Search Caption: `{{$json.category}} professional`
   - Auto Color: `true`
   - Output Path: `/covers/{{$json.slug}}`
4. **Move Binary Data** - Store the generated PNG
5. **Upload to Storage** - Upload to S3/Google Drive/etc.

## Tips & Best Practices

### Font Size
- Set to `0` for automatic sizing based on text length
- Manual sizing: 40-250px typically works well
- Longer text needs smaller font sizes

### Image Search
- Use descriptive search terms: "technology blue abstract" vs just "tech"
- Try different search indices (0-4) to get variety
- Freepik searches return high-quality stock photos

### Auto Color Detection
- Works by analyzing average brightness
- Dark backgrounds → white text
- Light backgrounds → dark text
- Disable if you want custom colors

### Cropping & Blur
- Notion's optimal cover ratio is 5:2 (width:height)
- Blur values: 5 (subtle), 10 (medium), 15 (heavy)
- Blur can improve text readability

### Performance
- PNG generation adds ~1-2 seconds
- Freepik API calls add ~2-3 seconds
- Local images are fastest

## Troubleshooting

### "Template file not found"
- Ensure the template path is absolute or relative to n8n's working directory
- Default template: `./templates/notion.svg` in the package root

### "FREEPIK_API_KEY not found"
- Add Notion Cover Gen API credentials in n8n
- Or disable "Use Freepik Search" and use local images

### "Image file not found"
- Check that background image paths are correct
- Use absolute paths or paths relative to n8n's working directory

### PNG not generated
- Check "Generate PNG" is enabled
- Ensure sufficient disk space
- Check file permissions in output directory

## Additional Resources

- [CLI Documentation](./README.md) - Full CLI usage guide
- [GitHub Repository](https://github.com/oriolrius/notion-cover-gen)
- [Report Issues](https://github.com/oriolrius/notion-cover-gen/issues)
- [Freepik API](https://www.freepik.com/api)

## License

ISC License - See LICENSE file for details

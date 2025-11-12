const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

/**
 * SVG Text Editor
 * Edit SVG text content and convert to multiple formats
 */
class SVGTextEditor {
  constructor(templatePath) {
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    this.templatePath = templatePath;
    this.svgContent = fs.readFileSync(templatePath, 'utf-8');
  }

  /**
   * Get MIME type for image based on file extension
   *
   * @param {string} imagePath - Path to image file
   * @returns {string} - MIME type
   */
  getImageMimeType(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
    };

    return mimeTypes[ext] || 'image/png';
  }

  /**
   * Convert image file to base64 data URL
   *
   * @param {string} imagePath - Path to image file
   * @returns {string} - Base64 data URL
   */
  imageToBase64(imagePath) {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = this.getImageMimeType(imagePath);

    return `data:${mimeType};base64,${base64}`;
  }

  /**
   * Analyze image brightness and determine optimal text color
   *
   * @param {string} imagePath - Path to image file
   * @returns {Promise<string>} - Hex color code for text (#ffffff or #000000)
   */
  async analyzeImageForTextColor(imagePath) {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    try {
      // Get image statistics
      const stats = await sharp(imagePath).stats();

      // Calculate average brightness across all channels
      // Using luminance formula: 0.299*R + 0.587*G + 0.114*B
      const channels = stats.channels;
      let avgBrightness = 0;

      if (channels.length >= 3) {
        // RGB or RGBA
        avgBrightness = (
          0.299 * channels[0].mean +
          0.587 * channels[1].mean +
          0.114 * channels[2].mean
        );
      } else {
        // Grayscale
        avgBrightness = channels[0].mean;
      }

      // Normalize to 0-1 range (assuming 8-bit color depth)
      const brightness = avgBrightness / 255;

      console.log(`📊 Image brightness: ${(brightness * 100).toFixed(1)}%`);

      // Choose contrasting color
      // If background is dark (< 0.5), use white text
      // If background is light (>= 0.5), use dark text
      const textColor = brightness < 0.5 ? '#ffffff' : '#1a1a1a';
      console.log(`🎨 Selected text color: ${textColor} (${brightness < 0.5 ? 'light' : 'dark'})`);

      return textColor;
    } catch (error) {
      console.warn(`⚠️  Color analysis failed: ${error.message}, using default color`);
      return '#b5eea5'; // Default green color as fallback
    }
  }

  /**
   * Replace background image in SVG
   *
   * @param {string} imagePath - Path to new background image
   * @returns {string} - Updated SVG content
   */
  replaceBackgroundImage(imagePath) {
    const base64Data = this.imageToBase64(imagePath);

    // Replace the xlink:href data URL in the image element
    this.svgContent = this.svgContent.replace(
      /xlink:href="data:image\/[^;]+;base64,[^"]+"/,
      `xlink:href="${base64Data}"`
    );

    console.log(`✅ Background image replaced: ${path.basename(imagePath)}`);
    return this.svgContent;
  }

  /**
   * Calculate optimal font size to fit text within width
   * Uses character width estimation for Ubuntu Bold font
   *
   * @param {string} text - The text to measure
   * @param {number} maxWidth - Maximum width in pixels
   * @param {number} minSize - Minimum font size
   * @param {number} maxSize - Maximum font size
   * @returns {number} - Optimal font size
   */
  calculateFontSize(text, maxWidth = 1400, minSize = 40, maxSize = 250) {
    if (!text || text.length === 0) {
      throw new Error('Text cannot be empty');
    }

    // Ubuntu Bold font: ~0.6 ratio of font-size to character width
    const CHAR_WIDTH_RATIO = 0.6;

    // Calculate required font size to fit
    const optimalSize = Math.floor(maxWidth / (text.length * CHAR_WIDTH_RATIO));

    // Clamp between min and max
    return Math.max(minSize, Math.min(optimalSize, maxSize));
  }

  /**
   * Update text and adjust font size in SVG content
   *
   * @param {string} newText - The new text to display
   * @param {number|null} fontSize - Optional fixed font size
   * @param {string|null} textColor - Optional text color (hex)
   * @returns {string} - Modified SVG content
   */
  updateText(newText, fontSize = null, textColor = null) {
    let svgContent = this.svgContent;

    // Calculate optimal font size if not provided
    const finalFontSize = fontSize !== null ? fontSize : this.calculateFontSize(newText);

    // Replace text content in the div element
    svgContent = svgContent.replace(
      /(<div[^>]*style="display: inline-block[^"]*">)[^<]*(<\/div>)/,
      `$1${this.escapeHtml(newText)}$2`
    );

    // Update all font-size occurrences
    svgContent = svgContent.replace(
      /font-size:\s*\d+px/g,
      `font-size: ${finalFontSize}px`
    );

    // Update text color if provided
    if (textColor) {
      svgContent = svgContent.replace(
        /color:\s*light-dark\([^,]+,[^)]+\)/,
        `color: light-dark(${textColor}, ${textColor})`
      );
    }

    return svgContent;
  }

  /**
   * Escape HTML special characters
   *
   * @param {string} text - Text to escape
   * @returns {string} - Escaped text
   */
  escapeHtml(text) {
    const htmlEscapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
  }

  /**
   * Convert foreignObject HTML to native SVG text element
   * resvg-js doesn't support foreignObject with HTML, so we convert it
   *
   * @param {string} svgContent - SVG content with foreignObject
   * @param {string|null} textColor - Optional text color override
   * @returns {string} - SVG with native text elements
   */
  convertForeignObjectToText(svgContent, textColor = null) {
    // Extract text content from foreignObject
    const textMatch = svgContent.match(/<div[^>]*style="display: inline-block[^"]*">([^<]*)<\/div>/);
    if (!textMatch) {
      return svgContent; // No foreignObject found, return as-is
    }

    const text = textMatch[1];

    // Extract font-size
    const fontSizeMatch = svgContent.match(/font-size:\s*(\d+)px/);
    const fontSize = fontSizeMatch ? fontSizeMatch[1] : '170';

    // Extract color (use provided color or extract from SVG)
    let color = textColor;
    if (!color) {
      const colorMatch = svgContent.match(/color:\s*light-dark\(([^,]+),/);
      color = colorMatch ? colorMatch[1] : '#b5eea5';
    }

    // Create native SVG text element
    const svgText = `
      <text x="750" y="330"
            font-family="Ubuntu"
            font-size="${fontSize}"
            font-weight="bold"
            fill="${color}"
            text-anchor="middle"
            dominant-baseline="middle">${this.escapeHtml(text)}</text>
    `;

    // Replace foreignObject with native SVG text
    // Remove the entire foreignObject block
    let converted = svgContent.replace(
      /<switch>.*?<\/switch>/s,
      svgText
    );

    return converted;
  }

  /**
   * Convert SVG to PNG using resvg-js
   *
   * @param {string} svgContent - SVG content to convert
   * @param {number} scale - Scale factor for PNG (default: 1)
   * @param {string|null} textColor - Optional text color override
   * @returns {Buffer} - PNG image buffer
   */
  convertToPNG(svgContent, scale = 1, textColor = null) {
    try {
      // Convert foreignObject HTML to native SVG text for resvg compatibility
      const convertedSvg = this.convertForeignObjectToText(svgContent, textColor);

      const resvg = new Resvg(convertedSvg, {
        fitTo: {
          mode: 'zoom',
          value: scale,
        },
        font: {
          loadSystemFonts: true, // Load system fonts for better rendering
        },
      });

      const pngData = resvg.render();
      return pngData.asPng();
    } catch (error) {
      throw new Error(`PNG conversion failed: ${error.message}`);
    }
  }

  /**
   * Save content to file
   *
   * @param {string|Buffer} content - Content to save
   * @param {string} filePath - Output file path
   */
  saveFile(content, filePath) {
    const dir = path.dirname(filePath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
  }

  /**
   * Generate SVG and optionally PNG files with new text
   *
   * @param {string} text - New text
   * @param {string} outputPath - Output file path (without extension)
   * @param {Object} options - Generation options
   * @param {number|null} options.fontSize - Fixed font size
   * @param {boolean} options.generatePNG - Whether to generate PNG
   * @param {number} options.pngScale - PNG scale factor
   * @param {string|null} options.backgroundImage - Path to background image
   * @param {boolean} options.autoColor - Auto-detect text color from background
   * @returns {Promise<Object>} - Generation result with file paths
   */
  async generate(text, outputPath, options = {}) {
    const {
      fontSize = null,
      generatePNG = true,
      pngScale = 1,
      backgroundImage = null,
      autoColor = true,
    } = options;

    let textColor = null;

    // Replace background image if provided
    if (backgroundImage) {
      this.replaceBackgroundImage(backgroundImage);

      // Auto-detect text color from background if enabled
      if (autoColor) {
        textColor = await this.analyzeImageForTextColor(backgroundImage);
      }
    }

    // Generate SVG content
    const svgContent = this.updateText(text, fontSize, textColor);
    const calculatedSize = fontSize || this.calculateFontSize(text);

    // Determine output paths
    const svgPath = outputPath.endsWith('.svg') ? outputPath : `${outputPath}.svg`;
    const pngPath = svgPath.replace(/\.svg$/, '.png');

    // Save SVG
    this.saveFile(svgContent, svgPath);
    console.log(`✅ SVG saved to: ${svgPath}`);

    const result = {
      text,
      fontSize: calculatedSize,
      textColor: textColor || 'default',
      textLength: text.length,
      svgPath,
      svgSize: fs.statSync(svgPath).size,
    };

    // Generate and save PNG if requested
    if (generatePNG) {
      try {
        const pngBuffer = this.convertToPNG(svgContent, pngScale, textColor);
        this.saveFile(pngBuffer, pngPath);
        console.log(`✅ PNG saved to: ${pngPath}`);

        result.pngPath = pngPath;
        result.pngSize = fs.statSync(pngPath).size;
      } catch (error) {
        console.error(`❌ PNG generation failed: ${error.message}`);
      }
    }

    // Print summary
    console.log(`\n📊 Summary:`);
    console.log(`   Text: "${text}"`);
    console.log(`   Font size: ${calculatedSize}px`);
    if (textColor) {
      console.log(`   Text color: ${textColor}`);
    }
    console.log(`   Text length: ${text.length} characters`);
    console.log(`   SVG size: ${this.formatBytes(result.svgSize)}`);
    if (result.pngSize) {
      console.log(`   PNG size: ${this.formatBytes(result.pngSize)}`);
    }

    return result;
  }

  /**
   * Format bytes to human-readable format
   *
   * @param {number} bytes - Bytes to format
   * @returns {string} - Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = SVGTextEditor;

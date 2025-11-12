#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const SVGTextEditor = require('./svg-editor');

const program = new Command();

program
  .name('svg-editor')
  .description('CLI tool to edit SVG text and convert to multiple formats')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate SVG and PNG with custom text')
  .argument('<text>', 'Text to display in the SVG')
  .option('-o, --output <file>', 'Output file path (without extension)', 'output')
  .option('-t, --template <file>', 'Template SVG file', '../notion.svg')
  .option('-s, --size <number>', 'Fixed font size (auto-calculated if not provided)')
  .option('-b, --background <file>', 'Background image (PNG/JPG) to embed in SVG')
  .option('--no-png', 'Skip PNG generation (SVG only)')
  .option('--png-scale <number>', 'PNG scale factor for higher resolution', '1')
  .option('--no-auto-color', 'Disable automatic text color detection from background')
  .action(async (text, options) => {
    try {
      const templatePath = path.resolve(options.template);
      const outputPath = path.resolve(options.output);
      const fontSize = options.size ? parseInt(options.size) : null;
      const backgroundImage = options.background ? path.resolve(options.background) : null;
      const generatePNG = options.png !== false;
      const pngScale = parseFloat(options.pngScale);
      const autoColor = options.autoColor !== false;

      console.log('🎨 SVG Text Editor\n');

      const editor = new SVGTextEditor(templatePath);
      await editor.generate(text, outputPath, {
        fontSize,
        backgroundImage,
        generatePNG,
        pngScale,
        autoColor,
      });

      console.log('\n✨ Generation complete!');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('batch')
  .description('Generate multiple SVG/PNG files from a list')
  .argument('<texts...>', 'List of texts (space-separated)')
  .option('-t, --template <file>', 'Template SVG file', '../notion.svg')
  .option('-p, --prefix <string>', 'Output file prefix', 'header-')
  .option('-d, --output-dir <dir>', 'Output directory', '.')
  .option('--no-png', 'Skip PNG generation (SVG only)')
  .option('--png-scale <number>', 'PNG scale factor', '1')
  .action(async (texts, options) => {
    try {
      const templatePath = path.resolve(options.template);
      const outputDir = path.resolve(options.outputDir);
      const generatePNG = options.png !== false;
      const pngScale = parseFloat(options.pngScale);

      console.log('🎨 SVG Text Editor - Batch Mode\n');
      console.log(`📦 Processing ${texts.length} items...\n`);

      const editor = new SVGTextEditor(templatePath);
      const results = [];

      for (let index = 0; index < texts.length; index++) {
        const text = texts[index];
        const outputPath = path.join(outputDir, `${options.prefix}${index + 1}`);

        console.log(`\n[${index + 1}/${texts.length}] Generating: "${text}"`);
        console.log('─'.repeat(50));

        const result = await editor.generate(text, outputPath, {
          generatePNG,
          pngScale,
          autoColor: false, // Disable auto-color for batch mode (no background change)
        });

        results.push(result);
      }

      // Summary
      console.log('\n' + '═'.repeat(50));
      console.log('📊 Batch Generation Summary');
      console.log('═'.repeat(50));
      console.log(`✅ Generated ${texts.length} sets of files`);
      console.log(`📁 Output directory: ${outputDir}`);

      const totalSVGSize = results.reduce((sum, r) => sum + r.svgSize, 0);
      const totalPNGSize = results.reduce((sum, r) => sum + (r.pngSize || 0), 0);

      console.log(`📏 Total SVG size: ${editor.formatBytes(totalSVGSize)}`);
      if (generatePNG) {
        console.log(`🖼️  Total PNG size: ${editor.formatBytes(totalPNGSize)}`);
      }

      console.log('\n✨ Batch generation complete!');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('convert')
  .description('Convert existing SVG to PNG')
  .argument('<input>', 'Input SVG file')
  .option('-o, --output <file>', 'Output PNG file (default: same name as input)')
  .option('-s, --scale <number>', 'Scale factor for PNG', '1')
  .action((input, options) => {
    try {
      const inputPath = path.resolve(input);
      const outputPath = options.output
        ? path.resolve(options.output)
        : inputPath.replace(/\.svg$/, '.png');
      const scale = parseFloat(options.scale);

      console.log('🎨 SVG to PNG Converter\n');
      console.log(`📂 Input: ${inputPath}`);
      console.log(`📂 Output: ${outputPath}`);
      console.log(`🔍 Scale: ${scale}x\n`);

      const fs = require('fs');
      const svgContent = fs.readFileSync(inputPath, 'utf-8');

      const editor = new SVGTextEditor(inputPath);
      const pngBuffer = editor.convertToPNG(svgContent, scale);

      editor.saveFile(pngBuffer, outputPath);

      const pngSize = fs.statSync(outputPath).size;
      console.log(`✅ PNG saved: ${outputPath}`);
      console.log(`📏 Size: ${editor.formatBytes(pngSize)}`);
      console.log('\n✨ Conversion complete!');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('replace-background')
  .description('Replace background image in an SVG template')
  .argument('<template>', 'SVG template file')
  .argument('<image>', 'Background image file (PNG/JPG)')
  .option('-o, --output <file>', 'Output file (default: overwrites template)')
  .action((template, image, options) => {
    try {
      const templatePath = path.resolve(template);
      const imagePath = path.resolve(image);
      const outputPath = options.output ? path.resolve(options.output) : templatePath;

      console.log('🎨 SVG Background Replacer\n');
      console.log(`📂 Template: ${templatePath}`);
      console.log(`🖼️  Image: ${imagePath}`);
      console.log(`📂 Output: ${outputPath}\n`);

      const editor = new SVGTextEditor(templatePath);
      const updatedSvg = editor.replaceBackgroundImage(imagePath);

      editor.saveFile(updatedSvg, outputPath);

      const fs = require('fs');
      const imageSize = fs.statSync(imagePath).size;
      const svgSize = fs.statSync(outputPath).size;

      console.log(`\n📊 Summary:`);
      console.log(`   Image size: ${editor.formatBytes(imageSize)}`);
      console.log(`   SVG size: ${editor.formatBytes(svgSize)}`);
      console.log('\n✨ Background replacement complete!');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();

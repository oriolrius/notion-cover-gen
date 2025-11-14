import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import * as path from 'path';
import * as fs from 'fs';
// @ts-ignore
import SVGTextEditor from '../../svg-editor';

export class NotionCoverGen implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Notion Cover Gen',
		name: 'notionCoverGen',
		icon: 'file:notionCoverGen.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate beautiful Notion blog covers with AI-powered image search',
		defaults: {
			name: 'Notion Cover Gen',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'notionCoverGenApi',
				required: false,
				displayOptions: {
					show: {
						operation: ['generate'],
						useFreepikSearch: [true],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate SVG and PNG with custom text',
						action: 'Generate notion cover',
					},
					{
						name: 'Convert',
						value: 'convert',
						description: 'Convert existing SVG to PNG',
						action: 'Convert SVG to PNG',
					},
					{
						name: 'Replace Background',
						value: 'replaceBackground',
						description: 'Replace background image in an SVG template',
						action: 'Replace background image',
					},
				],
				default: 'generate',
			},

			// Generate operation parameters
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Text to display in the cover',
			},
			{
				displayName: 'Template Path',
				name: 'templatePath',
				type: 'string',
				default: './templates/notion.svg',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Path to the SVG template file',
			},
			{
				displayName: 'Output Path',
				name: 'outputPath',
				type: 'string',
				default: './output',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Output file path (without extension)',
			},
			{
				displayName: 'Font Size',
				name: 'fontSize',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Fixed font size (0 = auto-calculated)',
			},
			{
				displayName: 'Use Freepik Search',
				name: 'useFreepikSearch',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Whether to search and use image from Freepik',
			},
			{
				displayName: 'Search Caption',
				name: 'searchCaption',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['generate'],
						useFreepikSearch: [true],
					},
				},
				description: 'Search caption for Freepik image search',
			},
			{
				displayName: 'Search Index',
				name: 'searchIndex',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['generate'],
						useFreepikSearch: [true],
					},
				},
				description: 'Index of Freepik search result to use (0=first, 1=second, etc.)',
			},
			{
				displayName: 'Background Image Path',
				name: 'backgroundImage',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['generate'],
						useFreepikSearch: [false],
					},
				},
				description: 'Path to background image (PNG/JPG) to embed in SVG',
			},
			{
				displayName: 'Crop to 5:2 Ratio',
				name: 'cropTo5x2',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Whether to crop background image to 5:2 aspect ratio',
			},
			{
				displayName: 'Gaussian Blur',
				name: 'gaussianBlur',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Apply Gaussian blur with sigma value (0 = no blur, 5 = light, 15 = heavy)',
			},
			{
				displayName: 'Generate PNG',
				name: 'generatePNG',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Whether to generate PNG file',
			},
			{
				displayName: 'PNG Scale',
				name: 'pngScale',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: ['generate'],
						generatePNG: [true],
					},
				},
				description: 'PNG scale factor for higher resolution',
			},
			{
				displayName: 'Auto Color',
				name: 'autoColor',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Whether to automatically detect text color from background',
			},

			// Convert operation parameters
			{
				displayName: 'Input SVG Path',
				name: 'inputSvgPath',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				description: 'Path to the input SVG file',
			},
			{
				displayName: 'Output PNG Path',
				name: 'outputPngPath',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				description: 'Path for the output PNG file (default: same name as input)',
			},
			{
				displayName: 'Scale',
				name: 'scale',
				type: 'number',
				default: 1,
				displayOptions: {
					show: {
						operation: ['convert'],
					},
				},
				description: 'Scale factor for PNG',
			},

			// Replace Background operation parameters
			{
				displayName: 'Template SVG Path',
				name: 'templateSvgPath',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['replaceBackground'],
					},
				},
				description: 'Path to the SVG template file',
			},
			{
				displayName: 'Image Path',
				name: 'imagePath',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['replaceBackground'],
					},
				},
				description: 'Path to the background image file (PNG/JPG)',
			},
			{
				displayName: 'Output SVG Path',
				name: 'outputSvgPath',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['replaceBackground'],
					},
				},
				description: 'Path for output file (default: overwrites template)',
			},
			{
				displayName: 'Crop to 5:2 Ratio',
				name: 'cropTo5x2Background',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['replaceBackground'],
					},
				},
				description: 'Whether to crop background image to 5:2 aspect ratio',
			},
			{
				displayName: 'Gaussian Blur',
				name: 'gaussianBlurBackground',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['replaceBackground'],
					},
				},
				description: 'Apply Gaussian blur with sigma value (0 = no blur, 5 = light, 15 = heavy)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'generate') {
					// Generate operation
					const text = this.getNodeParameter('text', i) as string;
					const templatePath = this.getNodeParameter('templatePath', i) as string;
					const outputPath = this.getNodeParameter('outputPath', i) as string;
					const fontSize = this.getNodeParameter('fontSize', i) as number;
					const useFreepikSearch = this.getNodeParameter('useFreepikSearch', i) as boolean;
					const cropTo5x2 = this.getNodeParameter('cropTo5x2', i) as boolean;
					const gaussianBlur = this.getNodeParameter('gaussianBlur', i) as number;
					const generatePNG = this.getNodeParameter('generatePNG', i) as boolean;
					const pngScale = this.getNodeParameter('pngScale', i) as number;
					const autoColor = this.getNodeParameter('autoColor', i) as boolean;

					let searchCaption = null;
					let searchIndex = 0;
					let backgroundImage = null;

					if (useFreepikSearch) {
						searchCaption = this.getNodeParameter('searchCaption', i) as string;
						searchIndex = this.getNodeParameter('searchIndex', i) as number;

						// Set API key from credentials
						const credentials = await this.getCredentials('notionCoverGenApi');
						process.env.FREEPIK_API_KEY = credentials.apiKey as string;
					} else {
						const bgImage = this.getNodeParameter('backgroundImage', i) as string;
						backgroundImage = bgImage || null;
					}

					const resolvedTemplatePath = path.resolve(templatePath);
					const resolvedOutputPath = path.resolve(outputPath);

					const editor = new SVGTextEditor(resolvedTemplatePath);
					const result = await editor.generate(text, resolvedOutputPath, {
						fontSize: fontSize || null,
						backgroundImage,
						searchCaption,
						searchIndex,
						generatePNG,
						pngScale,
						autoColor,
						cropTo5x2,
						gaussianBlur: gaussianBlur || null,
					});

					returnData.push({
						json: {
							success: true,
							operation: 'generate',
							...result,
						},
						pairedItem: { item: i },
					});
				} else if (operation === 'convert') {
					// Convert operation
					const inputSvgPath = this.getNodeParameter('inputSvgPath', i) as string;
					const outputPngPath = this.getNodeParameter('outputPngPath', i) as string;
					const scale = this.getNodeParameter('scale', i) as number;

					const resolvedInputPath = path.resolve(inputSvgPath);
					const resolvedOutputPath = outputPngPath
						? path.resolve(outputPngPath)
						: resolvedInputPath.replace(/\.svg$/, '.png');

					if (!fs.existsSync(resolvedInputPath)) {
						throw new NodeOperationError(
							this.getNode(),
							`Input SVG file not found: ${resolvedInputPath}`,
						);
					}

					const svgContent = fs.readFileSync(resolvedInputPath, 'utf-8');
					const editor = new SVGTextEditor(resolvedInputPath);
					const pngBuffer = editor.convertToPNG(svgContent, scale);

					editor.saveFile(pngBuffer, resolvedOutputPath);

					const pngSize = fs.statSync(resolvedOutputPath).size;

					returnData.push({
						json: {
							success: true,
							operation: 'convert',
							inputPath: resolvedInputPath,
							outputPath: resolvedOutputPath,
							scale,
							pngSize,
						},
						pairedItem: { item: i },
					});
				} else if (operation === 'replaceBackground') {
					// Replace Background operation
					const templateSvgPath = this.getNodeParameter('templateSvgPath', i) as string;
					const imagePath = this.getNodeParameter('imagePath', i) as string;
					const outputSvgPath = this.getNodeParameter('outputSvgPath', i) as string;
					const cropTo5x2 = this.getNodeParameter('cropTo5x2Background', i) as boolean;
					const gaussianBlur = this.getNodeParameter('gaussianBlurBackground', i) as number;

					const resolvedTemplatePath = path.resolve(templateSvgPath);
					const resolvedImagePath = path.resolve(imagePath);
					const resolvedOutputPath = outputSvgPath
						? path.resolve(outputSvgPath)
						: resolvedTemplatePath;

					if (!fs.existsSync(resolvedTemplatePath)) {
						throw new NodeOperationError(
							this.getNode(),
							`Template SVG file not found: ${resolvedTemplatePath}`,
						);
					}

					if (!fs.existsSync(resolvedImagePath)) {
						throw new NodeOperationError(
							this.getNode(),
							`Image file not found: ${resolvedImagePath}`,
						);
					}

					const editor = new SVGTextEditor(resolvedTemplatePath);
					const updatedSvg = await editor.replaceBackgroundImage(
						resolvedImagePath,
						cropTo5x2,
						gaussianBlur || null,
					);

					editor.saveFile(updatedSvg, resolvedOutputPath);

					const imageSize = fs.statSync(resolvedImagePath).size;
					const svgSize = fs.statSync(resolvedOutputPath).size;

					returnData.push({
						json: {
							success: true,
							operation: 'replaceBackground',
							templatePath: resolvedTemplatePath,
							imagePath: resolvedImagePath,
							outputPath: resolvedOutputPath,
							imageSize,
							svgSize,
						},
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							success: false,
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

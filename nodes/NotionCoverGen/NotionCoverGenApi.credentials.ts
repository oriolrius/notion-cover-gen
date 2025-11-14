import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NotionCoverGenApi implements ICredentialType {
	name = 'notionCoverGenApi';
	displayName = 'Notion Cover Gen API';
	documentationUrl = 'https://github.com/oriolrius/notion-cover-gen';
	properties: INodeProperties[] = [
		{
			displayName: 'Freepik API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Freepik API key for image search functionality',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-freepik-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.freepik.com',
			url: '/v1/resources?locale=en-US&term=test&limit=1',
			method: 'GET',
		},
	};
}

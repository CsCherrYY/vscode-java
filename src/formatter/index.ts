const fs = require('fs').promises;

export async function loadTextFromFile(resourceUri: string): Promise<string> {
	const buffer = await fs.readFile(resourceUri);
	return buffer.toString();
}

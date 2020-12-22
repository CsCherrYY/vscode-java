import { readFile as fsReadFile } from "fs";
import * as util from "util";

const readFile = util.promisify(fsReadFile);

export async function loadTextFromFile(resourceUri: string) {
	const buffer = await readFile(resourceUri);
	return buffer.toString();
}

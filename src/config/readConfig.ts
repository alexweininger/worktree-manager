import jsonfile from 'jsonfile';
import { IConfig } from './IConfig';

export async function readConfig(configFile: string): Promise<IConfig> {
	try {
		return await jsonfile.readFile(configFile);
	} catch (e) {
		console.error('Could not read config file', e);
		return {
			repos: [],
		};
	}
}

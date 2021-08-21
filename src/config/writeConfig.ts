import jsonfile from 'jsonfile';
import { IConfig } from './IConfig';

export async function writeConfig(configFile: string, config: IConfig): Promise<void> {
	return await jsonfile.writeFile(configFile, config);
}

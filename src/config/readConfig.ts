import jsonfile from 'jsonfile';
import { getConfigPath } from '../utils/configUtils';
import { IConfig } from './IConfig';

export async function readConfig(dir?: string): Promise<IConfig> {
	return await jsonfile.readFile(getConfigPath(dir));
}

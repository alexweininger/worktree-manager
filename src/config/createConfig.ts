import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';
import { configFileName } from '../constants';
import { getHomePath } from '../utils/pathUtils';
import { IConfig } from './IConfig';

export async function createConfig(
	dirPath: string = getHomePath()
): Promise<string> {
	const filePath = path.join(dirPath, configFileName);

	if (fs.existsSync(filePath)) {
		throw new Error(`Config file already exists at ${filePath}`);
	}

	const worktreesConfig: IConfig = {
		repos: [],
	};

	await jsonfile.writeFile(filePath, worktreesConfig, {
		spaces: 4,
	});

	return filePath;
}

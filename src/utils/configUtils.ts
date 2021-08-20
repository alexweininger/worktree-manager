import fs from 'fs';
import path from 'path';
import { configFileName } from '../constants';
import { getHomePath } from './pathUtils';

export function getConfigPath(dir: string = getHomePath()): string {
	return path.join(dir, configFileName);
}

export function findConfigPath(localDir: string): string | undefined {
	const localConfigPath = getConfigPath(localDir);
	const userConfigPath = getConfigPath();
	return fs.existsSync(localConfigPath) ? localConfigPath : userConfigPath;
}

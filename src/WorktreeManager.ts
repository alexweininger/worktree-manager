import { findConfigPath } from './utils/configUtils';

export class WorktreeManager {
	constructor(public readonly cwd: string) {}
	/**
	 * If no repo list file exists in current directory, look for in home directory.
	 * create one at default directory
	 */
	public async init() {
		const configPath = findConfigPath(this.cwd);
		console.log(configPath);
	}
}

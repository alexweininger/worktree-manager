import { createConfig } from './config/createConfig';
import { IConfig } from './config/IConfig';
import { IRepoConfig } from './config/IRepoConfig';
import { readConfig } from './config/readConfig';
import { writeConfig } from './config/writeConfig';
import { findConfigPath } from './utils/configUtils';

import simpleGit, { SimpleGit } from 'simple-git';
import { Repo } from './Repo';

interface IRepo extends IRepoConfig {
}

export class WorktreeManager {

	private repos: IRepoConfig[] = [];

	private readonly configPath: string;


	constructor(public readonly cwd: string) {
		let configPath = findConfigPath(cwd);
		if (!configPath) {
			throw new Error('No config found');
		}
		this.configPath = configPath;
	}

	private async saveConfig(): Promise<void> {
		await writeConfig(this.configPath, { repos: this.repos });
	}

	public async loadConfig(): Promise<IConfig> {
		const config = await readConfig(findConfigPath(this.cwd));
		this.repos = config.repos;
		return config;
	}

	/**
	 * If no repo list file exists in current directory, look for in home directory.
	 * create one at default directory
	 */
	public static async createConfig(dir?: string): Promise<string> {
		return await createConfig(dir);
	}

	/**
	 * Repo: add, remove, list, sync, clone all
	 * Worktree: add, remove list, open, move
	 */
	public async addRepo(repo: IRepoConfig): Promise<void> {

		if (!repo.url) {
			repo.url = await this.getRepoRemoteUrl(repo.path);
		}

		this.repos.push(repo);
		console.log(this.repos);
		await this.saveConfig();
	}

	/**
	 * Repo: add, remove, list, sync, clone all
	 * Worktree: add, remove list, open, move
	 */
	public async removeRepo(path: string): Promise<void> {
		this.repos = this.repos.filter((repo) => repo.path !== path);
		await this.saveConfig();
	}

	public listRepos(): Repo[] {
		return this.repos.map((repo) => new Repo(repo));
	}

	public getRepo(path: string): IRepo | undefined {
		return this.repos.find((repo) => repo.path === path);
	}

	public async getRepoRemoteUrl(path: string): Promise<string | undefined> {
		const git = this.getGit(path);
		const remoteNames = await git.getRemotes();
		if (remoteNames.length > 0) {
			const remoteName = remoteNames[0].name;
			const remoteUrl = (await git.remote(['get-url', remoteName]));
			if (remoteUrl) {
				return remoteUrl.trim();
			}
		}
		return undefined;
	}

	private getGit(dir: string): SimpleGit {
		try {
			return simpleGit(dir, { binary: 'git' });
		} catch (e) {
			throw new Error(`${dir} is not a git repository`);
		}
	}
}

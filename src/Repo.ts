import os from "os";
import path from 'path';
import { IRepoConfig } from './config/IRepoConfig';
import { WorktreeClient } from 'git-worktree';
import { IWorktree, Worktree } from './Worktree';
import { WorktreeManager } from ".";
import { worktreeFolderName } from "./constants";

export class Repo implements IRepoConfig {
	private worktreeClient: WorktreeClient;
	public path: string;
	public alias?: string;
	public url?: string;

	constructor(repoData: IRepoConfig, private manager: WorktreeManager) {
		if (repoData.path.endsWith('/')) {
			this.worktreeClient = new WorktreeClient(repoData.path.substr(0, repoData.path.length - 1));
		} else {
			this.worktreeClient = new WorktreeClient(repoData.path);
		}
		this.path = repoData.path;
		this.alias = repoData.alias;
		this.url = repoData.url;
	}

	public get name(): string {
		return path.basename(this.path);
	}

	public async getWorktrees(): Promise<Worktree[]> {
		const lockedWorktreePaths = await this.worktreeClient.list({ locked: true });
		const worktreePaths = await this.worktreeClient.list();
		const worktrees: Worktree[] =
			worktreePaths?.map((path: string) => new Worktree(this, path)) ?? [];
		return worktrees;
	}

	public async addWorktree(name: string, branchName: string, type?: string): Promise<void> {
		const aliasPrefix = this.alias ? `${this.alias}-` : undefined;
		const worktreePath = path.join(os.homedir(), worktreeFolderName, this.name, type ?? '', `${aliasPrefix ?? ''}${name}`);
		this.worktreeClient.add(worktreePath, branchName);
	}

	public async remove(): Promise<void> {
		await this.manager.removeRepo(this.path);
	}
}

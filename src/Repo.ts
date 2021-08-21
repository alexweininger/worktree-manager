import path from 'path';
import { IRepoConfig } from './config/IRepoConfig';
import { WorktreeClient } from 'git-worktree';
import { Worktree } from './Worktree';

export class Repo implements IRepoConfig {
	private worktreeClient: WorktreeClient;
	public path: string;
	public alias?: string;
	public url?: string;

	constructor(repoData: IRepoConfig) {
		this.worktreeClient = new WorktreeClient(repoData.path);
		this.path = repoData.path;
		this.alias = repoData.alias;
		this.url = repoData.url;
	}

	public get name(): string {
		return path.basename(this.path);
	}

	public async getWorktrees(): Promise<Worktree[]> {
		const worktreePaths = await this.worktreeClient.list();
		const worktrees: Worktree[] =
			worktreePaths?.map((path: string) => new Worktree(this, path)) ?? [];
		return worktrees;
	}
}

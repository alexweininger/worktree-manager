import { WorktreeClient } from 'git-worktree';
import path from 'path';
import simpleGit from 'simple-git';
import { Repo } from './Repo';

export interface IWorktree {
	readonly path: string;
	readonly name: string;
	readonly type?: string;
}

export class Worktree implements IWorktree {
	private client = new WorktreeClient(this.repo.path);

	constructor(public readonly repo: Repo, public path: string) { }

	public get name(): string {
		return path.basename(this.path);
	}

	public get type(): string | undefined {
		const typeOrRepoName = path.basename(path.dirname(this.path));
		if (typeOrRepoName === this.repo.name) {
			return undefined;
		}
		return typeOrRepoName;
	}

	public async branch(): Promise<string> {
		const git = simpleGit(this.path, { binary: 'git' });
		const branch = await git.branch();
		return branch.current;
	}

	public async remove(): Promise<void> {
		await this.client.remove(this.path);
	}

	public async lock(reason?: string): Promise<void> {
		await this.client.lock(this.path, reason);
	}

	public async unlock(): Promise<void> {
		await this.client.unlock(this.path);
	}

	public async move(newPath: string, force?: boolean): Promise<void> {
		await this.client.move(this.path, newPath, force);
	}

	public async isLocked(): Promise<boolean> {
		return await this.client.isWorktreeLocked(this.path);
	}
}

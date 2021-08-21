import { WorktreeClient } from "git-worktree";
import path from "path";
import simpleGit from "simple-git";
import { Repo } from "./Repo";
export interface IWorktree {
	readonly path: string;
	readonly name: string;
	readonly type?: string;
}

export class Worktree implements IWorktree {
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
}

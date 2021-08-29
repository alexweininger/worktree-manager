import { WorktreeManager } from './WorktreeManager';

export async function main() {
	const wtm = new WorktreeManager(process.cwd());
	const config = await wtm.loadConfig();
	console.log(config);
	// await wtm.addRepo({
	// 	path: '/Users/alex/Desktop/streamlux/streamlux/'
	// });

	// await wtm.removeRepo('/Users/alex/Desktop/streamlux/streamlux/');
	const repos = wtm.listRepos();
	const wts = await repos[0].getWorktrees();
	console.log(wts);
	console.log(wts[0].type, wts[0].name);

	await repos[0].addWorktree('worktree35', 'alex/newWorktree35', 'feature');
}

main();

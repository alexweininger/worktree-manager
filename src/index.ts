import { WorktreeManager } from './WorktreeManager';

async function main() {
	const wtm = new WorktreeManager(process.cwd());
	wtm.init();
}

main();

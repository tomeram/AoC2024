import { solveD1P1, solveD1P2 } from './day1/solution.ts';
import { solveD10P1, solveD10P2 } from './day10/solution.ts';
import { solveD11P1, solveD11P2 } from './day11/solution.ts';
import { solveD12P1, solveD12P2 } from './day12/solution.ts';
import { solveD2P1, solveD2P2 } from './day2/solution.ts';
import { solveD3P1, solveD3P2 } from './day3/solution.ts';
import { solveD4P1, solveD4P2 } from './day4/solution.ts';
import { solveD5P1, solveD5P2 } from './day5/solution.ts';
import { solveD6P1, solveD6P2 } from './day6/solution.ts';
import { solveD7P1, solveD7P2 } from './day7/solution.ts';
import { solveD8P1, solveD8P2 } from './day8/solution.ts';
import { solveD9P1, solveD9P2 } from './day9/solution.ts';

const solutions = [
	solveD1P1,
	solveD1P2,
	solveD2P1,
	solveD2P2,
	solveD3P1,
	solveD3P2,
	solveD4P1,
	solveD4P2,
	solveD5P1,
	solveD5P2,
	solveD6P1,
	solveD6P2,
	solveD7P1,
	solveD7P2,
	solveD8P1,
	solveD8P2,
	solveD9P1,
	solveD9P2,
	solveD10P1,
	solveD10P2,
	solveD11P1,
	solveD11P2,
	solveD12P1,
	solveD12P2,
];

async function runAll() {
	const toRun = solutions.slice(0, solutions.length - 1);
	console.time('previous');
	await Promise.all(toRun.map((_) => _()));
	console.timeEnd('previous');
}

async function runLast() {
	console.time('last');
	const res = await solutions[solutions.length - 1]();
	console.timeEnd('last');
	console.log(res);
}

console.time('all');
await runLast();
await runAll();
console.timeEnd('all');

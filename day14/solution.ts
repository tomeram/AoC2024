import { getLines } from '../utils.ts';

const mod = (m: number, n: number) => ((m % n) + n) % n;

const dimX = 103;
const dimY = 101;
export async function solveD14P1() {
	const bots = await getBots();

	for (let i = 0; i < 1000; i++) {
		moveBots(bots);
	}

	const qs = getQNums(dimX, dimY, bots);

	return Object.values(qs).reduce((p, c) => p * c, 1);
}

export async function solveD14P2() {
	const bots = await getBots();

	let i = 0;
	while (true) {
		const map = printMap(bots, false);

		if (/[^\.]{10}/.exec(map)) {
			console.log(map);
			break;
		}

		moveBots(bots);
		i++;
	}

	return i;
}

function moveBots(bots: { x: number; y: number; vx: number; vy: number }[]) {
	for (const bot of bots) {
		bot.x += bot.vx;
		bot.x = mod(bot.x, dimX);
		bot.y += bot.vy;
		bot.y = mod(bot.y, dimY);
	}
}

async function getBots() {
	return (await getLines(14)).filter((_) => _.trim() !== '').map((_) =>
		/p=(?<py>\d+),(?<px>\d+) v=(?<vy>(\-)?\d+),(?<vx>(\-)?\d+)/.exec(_)!.groups as {
			px: string;
			py: string;
			vx: string;
			vy: string;
		}
	).map(({ px, py, vx, vy }) => ({
		x: parseInt(px),
		y: parseInt(py),
		vx: parseInt(vx),
		vy: parseInt(vy),
	}));
}

function getQNums(
	dimX: number,
	dimY: number,
	bots: { x: number; y: number; vx: number; vy: number }[],
) {
	const { qs } = buildMap(dimX, dimY, bots);

	return qs;
}

function printMap(
	bots: { x: number; y: number; vx: number; vy: number }[],
	ommitMid = true,
) {
	const { map, midX, midY } = buildMap(dimX, dimY, bots);
	return map.map((row, i) =>
		row.map((_, j) => ommitMid && (i == midX || j == midY) ? ' ' : _ === 0 ? '.' : _.toString())
			.join('')
	).join('\n');
}

function buildMap(
	dimX: number,
	dimY: number,
	bots: { x: number; y: number; vx: number; vy: number }[],
) {
	const qs = { q1: 0, q2: 0, q3: 0, q4: 0 };
	const map = new Array(dimX).fill([]).map(() => new Array(dimY).fill(0));
	const midX = Math.ceil(dimX / 2) - 1;
	const midY = Math.ceil(dimY / 2) - 1;

	for (const bot of bots) {
		map[bot.x][bot.y]++;
		if (bot.x < midX && bot.y < midY) qs.q1++;
		else if (bot.x < midX && bot.y > midY) qs.q2++;
		else if (bot.x > midX && bot.y < midY) qs.q3++;
		else if (bot.x > midX && bot.y > midY) qs.q4++;
	}
	return { map, midX, midY, qs };
}

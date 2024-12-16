import { getLines } from '../utils.ts';

export async function solveD15P1() {
	const { map, botPos, movements } = await readInput();

	for (const move of movements) {
		const dir = dirs[move];
		if (!canMoveInDir(map, botPos, dir)) {
			continue;
		}

		push('@', map, botPos, dir);
		map[botPos.x][botPos.y] = '.';
		botPos.x += dir.x;
		botPos.y += dir.y;
	}

	let total = 0;
	for (let i = 0; i < map.length; i++) {
		const row = map[i];
		for (let j = 0; j < row.length; j++) {
			const element = row[j];

			if (element !== 'O') {
				continue;
			}

			total += (100 * i) + j;
		}
	}

	return total;
}

const dirs = {
	'<': { x: 0, y: -1 },
	'^': { x: -1, y: 0 },
	'>': { x: 0, y: 1 },
	'v': { x: 1, y: 0 },
};

type DirChar = keyof typeof dirs;

function printMap(map: string[][]) {
	console.log(map.map((_) => _.join('')).join('\n'));
}

async function readInput(): Promise<
	{ map: string[][]; botPos: { x: number; y: number }; movements: DirChar[] }
> {
	const lines = await getLines(15);

	const map: string[][] = [];
	const botPos = { x: -1, y: -1 };
	let movements: DirChar[] = [];
	let readMovements = false;
	for (const line of lines) {
		if (line.trim() === '') {
			readMovements = true;
			continue;
		}

		if (!readMovements) {
			const row = line.split('');
			map.push(row);
			const pos = row.indexOf('@');

			if (pos > 0) {
				botPos.x = map.length - 1;
				botPos.y = pos;
			}
		} else {
			movements = movements.concat(line.split('') as DirChar[]);
		}
	}
	return { map, botPos, movements };
}

function canMoveInDir(
	map: string[][],
	botPos: { x: number; y: number },
	dir: { x: number; y: number },
): boolean {
	const pos = { ...botPos };

	while (pos.x >= 0 && pos.x < map.length && pos.y >= 0 && pos.y < map[0].length) {
		if (map[pos.x][pos.y] === '#') {
			return false;
		}

		if (map[pos.x][pos.y] === '.') {
			return true;
		}

		pos.x += dir.x;
		pos.y += dir.y;
	}

	return false;
}

function push(
	char: string,
	map: string[][],
	pos: { x: number; y: number },
	dir: { x: number; y: number },
) {
	if (map[pos.x][pos.y] === '.') {
		map[pos.x][pos.y] = char;
		return;
	}

	push(map[pos.x][pos.y], map, { x: pos.x + dir.x, y: pos.y + dir.y }, dir);
	map[pos.x][pos.y] = char;
}

export async function solveD15P2() {
	const { map, botPos, movements } = await readInputWide();

	for (const move of movements) {
		const dir = dirs[move];
		if (!canMoveInDirWide(map, { x: botPos.x + dir.x, y: botPos.y + dir.y }, dir)) {
			continue;
		}

		pushWide('@', map, botPos, dir);
		map[botPos.x][botPos.y] = '.';
		botPos.x += dir.x;
		botPos.y += dir.y;
	}

	let total = 0;
	for (let i = 0; i < map.length; i++) {
		const row = map[i];
		for (let j = 0; j < row.length; j++) {
			const element = row[j];

			if (element !== '[') {
				continue;
			}

			total += (100 * i) + j;
		}
	}

	return total;
}

async function readInputWide(): Promise<
	{ map: string[][]; botPos: { x: number; y: number }; movements: DirChar[] }
> {
	const lines = await getLines(15);

	const map: string[][] = [];
	const botPos = { x: -1, y: -1 };
	let movements: DirChar[] = [];
	let readMovements = false;
	for (const line of lines) {
		if (line.trim() === '') {
			readMovements = true;
			continue;
		}

		if (!readMovements) {
			const row = line.split('').flatMap((_) => {
				switch (_) {
					case '.':
						return ['.', '.'];
					case 'O':
						return ['[', ']'];
					case '#':
						return ['#', '#'];
					case '@':
						return ['@', '.'];
					default:
						return [];
				}
			});
			map.push(row);
			const pos = row.indexOf('@');

			if (pos > 0) {
				botPos.x = map.length - 1;
				botPos.y = pos;
			}
		} else {
			movements = movements.concat(line.split('') as DirChar[]);
		}
	}
	return { map, botPos, movements };
}

function canMoveInDirWide(
	map: string[][],
	pos: { x: number; y: number },
	dir: { x: number; y: number },
): boolean {
	const curr = map[pos.x][pos.y];
	if (curr === '#') {
		return false;
	}

	if (curr === '.') {
		return true;
	}

	if (curr === '[') {
		return canMoveInDirWide(map, { x: pos.x + dir.x, y: pos.y + (dir.y !== 0 ? 2 : 1) }, dir) &&
			(dir.y !== 0 || canMoveInDirWide(map, { x: pos.x + dir.x, y: pos.y + dir.y }, dir));
	}

	if (curr === ']') {
		return canMoveInDirWide(map, { x: pos.x + dir.x, y: pos.y - (dir.y !== 0 ? 2 : 1) }, dir) &&
			(dir.y !== 0 || canMoveInDirWide(map, { x: pos.x + dir.x, y: pos.y + dir.y }, dir));
	}

	return false;
}

function pushWide(
	char: string,
	map: string[][],
	pos: { x: number; y: number },
	dir: { x: number; y: number },
) {
	if (map[pos.x][pos.y] === '.') {
		map[pos.x][pos.y] = char;
		return;
	}

	const nextPos = { x: pos.x + dir.x, y: pos.y + dir.y };

	if (map[nextPos.x][nextPos.y] === '[') {
		pushWide(
			'.',
			map,
			{ x: pos.x + dir.x, y: pos.y + dir.y + 1 },
			dir,
		);
	}

	if (map[nextPos.x][nextPos.y] === ']') {
		pushWide(
			'.',
			map,
			{ x: pos.x + dir.x, y: pos.y + dir.y - 1 },
			dir,
		);
	}

	pushWide(map[pos.x][pos.y], map, nextPos, dir);
	map[pos.x][pos.y] = char;
}

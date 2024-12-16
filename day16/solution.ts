import { getLines } from '../utils.ts';
import _ from 'npm:lodash';

const debug = false;

export async function solveD16P1() {
	const map = (await getLines(16)).map((_) => _.split(''));

	const pos = { x: -1, y: -1, dir: Dir.right };
	for (let i = 0; i < map.length && pos.x < 0; i++) {
		const row = map[i];
		for (let j = 0; j < row.length && pos.x < 0; j++) {
			if (row[j] === 'S') {
				pos.x = i;
				pos.y = j;
			}
		}
	}

	const visited = new Array(map.length).fill([]).map(() =>
		new Array(map[0].length).fill(Number.MAX_VALUE)
	);

	const res = findMinRoute(map, pos, 0, visited);
	if (debug) {
		console.table(
			visited.map((_, i) => _.map((__, j) => __ === Number.MAX_VALUE ? map[i][j] : __)),
		);
	}
	return res;
}

export async function solveD16P2() {
	const map = (await getLines(16)).map((_) => _.split(''));

	const pos = { x: -1, y: -1, dir: Dir.right };
	for (let i = 0; i < map.length && pos.x < 0; i++) {
		const row = map[i];
		for (let j = 0; j < row.length && pos.x < 0; j++) {
			if (row[j] === 'S') {
				pos.x = i;
				pos.y = j;
			}
		}
	}

	const visited = new Array(map.length).fill([]).map(() =>
		new Array(map[0].length).fill(Number.MAX_VALUE)
	);

	const places = new Array(map.length).fill([]).map(() =>
		new Array(map[0].length).fill(Number.MAX_VALUE)
	);

	const res = countPlacesToSit(map, pos, 0, visited, places);
	if (debug) {
		console.log(
			places.map((_, i) =>
				_.map((__, j) => __ === res ? 'O' : map[i][j] === '#' ? '#' : '.').join('')
			).join('\n'),
		);
	}
	return places.flatMap((_) => _).filter((_) => _ === res).length + 1;
}

function findMinRoute(
	map: string[][],
	pos: { x: number; y: number; dir: Dir },
	score = 0,
	visited: number[][],
): number {
	if (map[pos.x][pos.y] === 'E') {
		return score;
	}

	if (map[pos.x][pos.y] === '#') {
		return Number.MAX_VALUE;
	}

	if (visited[pos.x][pos.y] < score) {
		return Number.MAX_VALUE;
	}

	visited[pos.x][pos.y] = score;

	let minScore = Number.MAX_VALUE;

	let dir = pos.dir;
	for (let i = 0; i < 4; i++) {
		const d = dirs[dir];
		const newPos = { x: pos.x + d.x, y: pos.y + d.y, dir: dir };
		const newScore = findMinRoute(
			map,
			newPos,
			score + (i === 0 ? 1 : ((1000 * (i === 2 ? 2 : 1)) + 1)),
			visited,
		);

		if (newScore < minScore) {
			minScore = newScore;
		}

		dir = d.next;
	}

	return minScore;
}

function countPlacesToSit(
	map: string[][],
	pos: { x: number; y: number; dir: Dir },
	score = 0,
	visited: number[][],
	places: number[][],
): number {
	if (map[pos.x][pos.y] === 'E') {
		return score;
	}

	if (map[pos.x][pos.y] === '#') {
		return Number.MAX_VALUE;
	}

	if (visited[pos.x][pos.y] < score) {
		return Number.MAX_VALUE;
	}

	visited[pos.x][pos.y] = score;

	let minScore = Number.MAX_VALUE;
	let minExit = Number.MAX_VALUE;

	let dir = pos.dir;
	for (let i = 0; i < 4; i++) {
		const d = dirs[dir];
		const newPos = { x: pos.x + d.x, y: pos.y + d.y, dir: dir };
		const exitScore = score + (i === 0 ? 1 : ((1000 * (i === 2 ? 2 : 1)) + 1));
		const newScore = countPlacesToSit(
			map,
			newPos,
			exitScore,
			visited,
			places,
		);

		if (newScore < minScore) {
			minScore = newScore;
			minExit = exitScore;
		}

		dir = d.next;
	}

	if (places[pos.x][pos.y] >= minScore) {
		if (minExit < Number.MAX_VALUE) {
			visited[pos.x][pos.y] = minExit;
		}
		places[pos.x][pos.y] = minScore;
	}

	return minScore;
}

enum Dir {
	left = 'left',
	up = 'up',
	right = 'right',
	down = 'down',
}

const dirs = {
	[Dir.left]: { x: 0, y: -1, next: Dir.up },
	[Dir.up]: { x: -1, y: 0, next: Dir.right },
	[Dir.right]: { x: 0, y: 1, next: Dir.down },
	[Dir.down]: { x: 1, y: 0, next: Dir.left },
};

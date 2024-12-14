import { getLines } from '../utils.ts';

export async function solveD12P1() {
	const map = (await getLines(12)).map((_) => _.split(''));
	const visited = createEmptyVisitationMap(map);

	let cost = 0;
	for (let i = 0; i < map.length; i++) {
		const line = map[i];
		for (let j = 0; j < line.length; j++) {
			const [size, sides] = calcRegion(map, visited, i, j);

			if (size !== 0) {
				cost += size * sides;
			}
		}
	}

	return cost;
}

function calcRegion(
	map: string[][],
	visited: boolean[][],
	x: number,
	y: number,
) {
	if (visited[x][y]) return [0, 0];
	visited[x][y] = true;

	let size = 1;
	let sides = 0;
	for (const [v, h] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
		const cx = x + v;
		const cy = y + h;

		if (
			cx < 0 ||
			cx >= map.length ||
			cy < 0 ||
			cy >= map[0].length ||
			map[x][y] !== map[cx][cy]
		) {
			sides++;
			continue;
		}

		const [csize, csides] = calcRegion(map, visited, cx, cy);
		size += csize;
		sides += csides;
	}

	return [size, sides];
}

export async function solveD12P2() {
	const map = (await getLines(12)).map((_) => _.split(''));
	const visited = createEmptyVisitationMap(map);

	let cost = 0;
	for (let i = 0; i < map.length; i++) {
		const line = map[i];
		for (let j = 0; j < line.length; j++) {
			if (visited[i][j]) continue;
			const plotMap = createEmptyVisitationMap(map);

			const size = calcRegionWithMap(map, visited, i, j, plotMap);
			const sides = countSides(plotMap);
			cost += size * sides;
		}
	}

	return cost;
}

function calcRegionWithMap(
	map: string[][],
	visited: boolean[][],
	x: number,
	y: number,
	plotMap: boolean[][],
) {
	if (visited[x][y]) return 0;
	visited[x][y] = true;
	plotMap[x][y] = true;

	let size = 1;
	for (const [v, h] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
		const cx = x + v;
		const cy = y + h;

		if (
			cx < 0 ||
			cx >= map.length ||
			cy < 0 ||
			cy >= map[0].length ||
			map[x][y] !== map[cx][cy]
		) {
			continue;
		}

		const res = calcRegionWithMap(map, visited, cx, cy, plotMap);

		size += res;
	}

	return size;
}

function createEmptyVisitationMap(map: string[][]): boolean[][] {
	return new Array(map.length).fill([]).map((_) => new Array(map[0].length).fill(false));
}

function countSides(map: boolean[][]): number {
	let total = 0;
	for (let i = 0; i < map.length; i++) {
		const row = map[i];

		let up = false;
		let down = false;
		for (let j = 0; j < row.length; j++) {
			if (map[i][j]) {
				if (!map[i - 1]?.[j]) {
					if (!up) {
						total++;
						up = true;
					}
				} else {
					up = false;
				}

				if (!map[i + 1]?.[j]) {
					if (!down) {
						total++;
						down = true;
					}
				} else {
					down = false;
				}
			} else {
				up = false;
				down = false;
			}
		}
	}

	for (let i = 0; i < map[0].length; i++) {
		let left = false;
		let right = false;
		for (let j = 0; j < map.length; j++) {
			if (map[j][i]) {
				if (!map[j][i - 1]) {
					if (!right) {
						total++;
						right = true;
					}
				} else {
					right = false;
				}

				if (!map[j][i + 1]) {
					if (!left) {
						total++;
						left = true;
					}
				} else {
					left = false;
				}
			} else {
				right = false;
				left = false;
			}
		}
	}

	return total;
}

/*
 * Working, except for holes in plots, so abandoned
 */
function countSidesCircle(
	map: boolean[][],
	x: number,
	y: number,
): number {
	let sides = 0;
	let looking = rotations[Dirs.Down];
	let dir = rotations[Dirs.Right];

	let h = x - 1;
	let v = y;
	// console.log(map);

	do {
		// console.log(h, v, dir, looking);

		while (
			map[h + looking.h]?.[v + looking.v] && !map[h + dir.h]?.[v + dir.v]
		) {
			h += dir.h;
			v += dir.v;
		}

		if (!map[h + looking.h]?.[v + looking.v]) {
			h += looking.h;
			v += looking.v;
		}
		sides++;
		dir = findTurn(map, h, v, dir);
		looking = rotations[dir.looking];
	} while (h !== x - 1 || v !== y || dir.h !== 0 || dir.v !== 1);

	return sides;
}

function findTurn(
	map: boolean[][],
	x: number,
	y: number,
	dir: Direction,
): Direction {
	const right = rotations[dir.looking];
	const look = rotations[right.looking];

	if (
		!map[x]?.[y] &&
		map[x + look.h]?.[y + look.v]
	) {
		return right;
	}

	return rotations[rotations[rotations[dir.looking].looking].looking];
}

enum Dirs {
	Up = 'Up',
	Right = 'Right',
	Down = 'Down',
	Left = 'Left',
}

type Direction = {
	v: number;
	h: number;
	looking: Dirs;
};

const rotations = {
	[Dirs.Right]: { h: 0, v: 1, looking: Dirs.Down },
	[Dirs.Down]: { h: 1, v: 0, looking: Dirs.Left },
	[Dirs.Left]: { h: 0, v: -1, looking: Dirs.Up },
	[Dirs.Up]: { h: -1, v: 0, looking: Dirs.Right },
};

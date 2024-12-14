import { getLines } from '../utils.ts';

export async function solveD3P1() {
	let sum = 0;
	const lines = await getLines(3);

	for (const line of lines) {
		for (const match of line.matchAll(/(mul\((?<n1>\d+),(?<n2>\d+)\))/g)) {
			const { n1, n2 } = match.groups as { n1: string; n2: string };

			sum += parseInt(n1) * parseInt(n2);
		}
	}

	return sum;
}

export async function solveD3P2() {
	let sum = 0;
	const lines = await getLines(3);

	let shouldDo = true;
	for (const line of lines) {
		for (const m of line.matchAll(/(mul\((?<n1>\d+),(?<n2>\d+)\))|(do(n't)?\(\))/g)) {
			const [match] = m;
			if (match.startsWith("don't")) {
				shouldDo = false;
				continue;
			} else if (match === 'do()') {
				shouldDo = true;
				continue;
			}

			if (!shouldDo) {
				continue;
			}

			const { n1, n2 } = m.groups as { n1: string; n2: string };

			sum += parseInt(n1) * parseInt(n2);
		}
	}

	return sum;
}

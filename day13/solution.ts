import { Decimal } from 'npm:decimal.js';
import { getLines } from '../utils.ts';

export async function solveD13P1() {
	const addition = 0;
	return await doWork(addition);
}

export async function solveD13P2() {
	const addition = 10000000000000;
	return await doWork(addition);
}

async function doWork(addition: number) {
	const lines = await getLines(13);
	let total = 0;

	let ax = new Decimal(0);
	let ay = new Decimal(0);
	let bx = new Decimal(0);
	let by = new Decimal(0);
	for (const line of lines) {
		if (line.startsWith('Button A')) {
			[ax, ay] = line.split(': ')[1].split(', ').map((_) => new Decimal(_.split('+')[1]));
		}

		if (line.startsWith('Button B')) {
			[bx, by] = line.split(': ')[1].split(', ').map((_) => new Decimal(_.split('+')[1]));
		}

		if (line.startsWith('Prize')) {
			const [x, y] = line.split(': ')[1].split(', ').map((_) =>
				new Decimal(_.split('=')[1]).plus(addition)
			);

			const cx = ax.div(ay);
			const resB = x.minus(y.mul(cx)).div(bx.minus(by.mul(cx)));
			if (resB.toNumber() % 1 !== 0) {
				continue;
			}
			const resA = (x.minus(resB.mul(bx))).div(ax);
			if (resA.toNumber() % 1 !== 0) {
				continue;
			}

			if (resA.toNumber() < 0 || resB.toNumber() < 0) {
				continue;
			}

			const res = 3 * resA.toNumber() + resB.toNumber();

			if (res % 1 === 0) {
				total += res;
			}
		}
	}

	return total;
}

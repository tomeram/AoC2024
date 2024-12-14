import { getLines } from '../utils.ts';

export async function solveD2P1() {
	let res = 0;
	const lines = await getLines(2);

	for (const report of lines) {
		const levels = report.split(' ').map((_) => parseInt(_));

		if (isSafeReport(levels)) {
			res++;
			continue;
		}

		levels.reverse();
		if (isSafeReport(levels)) {
			res++;
		}
	}

	return res;
}

function isSafeReport(report: number[]) {
	for (let i = 1; i < report.length; i++) {
		if (report[i - 1] > report[i]) {
			return false;
		}

		const diff = Math.abs(report[i - 1] - report[i]);
		if (diff < 1 || diff > 3) {
			return false;
		}
	}

	return true;
}

export async function solveD2P2() {
	let res = 0;
	const lines = await getLines(2);

	for (const report of lines) {
		const levels = report.split(' ').map((_) => parseInt(_));

		if (isSafeReportWithDampener(levels)) {
			res++;
			continue;
		}

		levels.reverse();
		if (isSafeReportWithDampener(levels)) {
			res++;
		}
	}

	return res;
}

function isSafeReportWithDampener(report: number[]) {
	if (isSafeReport(report)) {
		return true;
	}

	for (let i = 0; i < report.length; i++) {
		const copy = [...report];
		copy.splice(i, 1);

		if (isSafeReport(copy)) {
			return true;
		}
	}

	return false;
}

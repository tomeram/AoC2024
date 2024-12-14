import { getLines } from '../utils.ts';

type Rule = {
	applies: (input: number) => boolean;
	transform: (input: number) => number[];
};

const rules: Rule[] = [
	{
		applies: (input) => input === 0,
		transform: () => [1],
	},
	{
		applies: (input) => input.toString().length % 2 === 0,
		transform: (input) => {
			const s = input.toString();
			return [
				Math.floor(input / (10 ** (s.length / 2))),
				input % (10 ** (s.length / 2)),
			];
		},
	},
	{
		applies: () => true,
		transform: (input) => [input * 2024],
	},
];
export async function solveD11P1() {
	let nums = (await getLines(11))[0].split(' ').map((_) => parseInt(_));

	for (let i = 0; i < 25; i++) {
		const newNums: number[] = [];

		for (const number of nums) {
			const rule = rules.find((_) => _.applies(number))!;
			newNums.push(...rule.transform(number));
		}

		nums = newNums;
	}

	return nums.length;
}

export async function solveD11P2() {
	const nums = (await getLines(11))[0].split(' ').map((_) => parseInt(_));

	return calcLength(nums, 75);
}

const mem = new Map<string, number>();

function calcLength(nums: number[], iterations: number): number {
	if (iterations === 0) {
		return nums.length;
	}

	let total = 0;

	for (const number of nums) {
		if (mem.has([number, iterations].join(','))) {
			total += mem.get([number, iterations].join(','))!;
			continue;
		}

		const rule = rules.find((rule) => rule.applies(number))!;
		const res = calcLength(rule.transform(number), iterations - 1);

		mem.set([number, iterations].join(','), res);

		total += res;
	}

	return total;
}

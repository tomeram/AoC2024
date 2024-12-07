import { getLines } from "../utils.ts";

export async function solveD7P1() {
    const equations = await getLines(7);
    let total = 0;

    for (const eq of equations) {
        const [strRes, ...strNums] = eq.split(": ");
        const res = parseInt(strRes);

        const nums = strNums.flatMap((s) =>
            s.split(" ").map((_) => parseInt(_))
        );

        if (canCalc(res, nums[0], nums.slice(1))) {
            total += res;
        }
    }

    return total;
}

function canCalc(res: number, num: number, rest: number[]): boolean {
    if (rest.length === 0) {
        return res === num;
    }

    const result = canCalc(res, num + rest[0], rest.slice(1)) ||
        canCalc(res, num * rest[0], rest.slice(1));

    return result;
}

export async function solveD7P2() {
    const equations = await getLines(7);
    let total = 0;

    for (const eq of equations) {
        const [strRes, ...strNums] = eq.split(": ");
        const res = parseInt(strRes);

        const nums = strNums.flatMap((s) =>
            s.split(" ").map((_) => parseInt(_))
        );

        if (canCalc2(res, nums[0], nums.slice(1))) {
            total += res;
        }
    }

    return total;
}

function canCalc2(res: number, num: number, rest: number[]): boolean {
    if (rest.length === 0) {
        return res === num;
    }

    const result = canCalc(res, num + rest[0], rest.slice(1)) ||
        canCalc(res, num * rest[0], rest.slice(1)) ||
        canCalc(res, parseInt(`${num}${rest[0]}`), rest.slice(1));

    return result;
}

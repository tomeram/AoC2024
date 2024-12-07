import { solveD1P1, solveD1P2 } from "./day1/solution.ts";
import { solveD2P1, solveD2P2 } from "./day2/solution.ts";
import { solveD3P1, solveD3P2 } from "./day3/solution.ts";
import { solveD4P1, solveD4P2 } from "./day4/solution.ts";
import { solveD5P1, solveD5P2 } from "./day5/solution.ts";
import { solveD6P1, solveD6P2 } from "./day6/solution.ts";

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
];

async function runAll() {
    const toRun = solutions.slice(0, solutions.length - 1);
    console.time("previous");
    await Promise.all(toRun.map((_) => _()));
    console.timeEnd("previous");
}

async function runLast() {
    console.time("last");
    const res = await solutions[solutions.length - 1]();
    console.timeEnd("last");
    console.log(res);
}

console.time("all");
await Promise.all([runAll(), runLast()]);
console.timeEnd("all");

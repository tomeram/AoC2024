import { getLines } from "../utils.ts";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

export async function solveD10P1() {
    const lines = await getLines(10);
    const map = lines.map((_) => _.split("").map((c) => parseInt(c)));

    let total = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 0) {
                const count = countHeads(
                    map,
                    i,
                    j,
                    0,
                    [],
                    true,
                    createTrace(map),
                );
                total += count;
                // console.log("total", i, j, count);
            }
        }
    }

    return total;
}

export async function solveD10P2() {
    const lines = await getLines(10);
    const map = lines.map((_) => _.split("").map((c) => parseInt(c)));

    let total = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 0) {
                const count = countTrails(
                    map,
                    i,
                    j,
                    0,
                    true,
                    createTrace(map),
                );
                total += count;
            }
        }
    }

    return total;
}

function countHeads(
    map: number[][],
    x: number,
    y: number,
    prev: number,
    found: string[],
    isHead = false,
    trace: string[][] | null = null,
): number {
    if (map[x] == null || map[x][y] == null) {
        return 0;
    }
    const curr = map[x][y];

    if (!isHead && curr - prev !== 1) return 0;

    const pos = `${x},${y}`;
    if (curr === 9 && !found.includes(pos)) {
        found.push(pos);
        if (trace != null) {
            trace = _.cloneDeep(trace);
            trace[x][y] = curr.toString();
            console.log("------------------------");
            console.log(trace.map((_) => _.join("")).join("\n"));
            console.log("------------------------");
        }
        return 1;
    }

    if (trace != null) {
        trace[x][y] = curr.toString();
    }

    return countHeads(map, x + 1, y, curr, found, false, _.cloneDeep(trace)) +
        countHeads(map, x - 1, y, curr, found, false, _.cloneDeep(trace)) +
        countHeads(map, x, y + 1, curr, found, false, _.cloneDeep(trace)) +
        countHeads(map, x, y - 1, curr, found, false, _.cloneDeep(trace));
}

function countTrails(
    map: number[][],
    x: number,
    y: number,
    prev: number,
    isHead = false,
    trace: string[][] | null = null,
): number {
    if (map[x] == null || map[x][y] == null) {
        return 0;
    }
    const curr = map[x][y];
    // console.log(x, y, prev, curr);

    if (!isHead && curr - prev !== 1) return 0;

    if (curr === 9) {
        if (trace != null) {
            trace = _.cloneDeep(trace);
            trace[x][y] = curr.toString();
            console.log("------------------------");
            console.log(trace.map((_) => _.join("")).join("\n"));
            console.log("------------------------");
        }
        return 1;
    }

    if (trace != null) {
        trace[x][y] = curr.toString();
    }

    return countTrails(map, x + 1, y, curr, false, _.cloneDeep(trace)) +
        countTrails(map, x - 1, y, curr, false, _.cloneDeep(trace)) +
        countTrails(map, x, y + 1, curr, false, _.cloneDeep(trace)) +
        countTrails(map, x, y - 1, curr, false, _.cloneDeep(trace));
}

const debug = false;

function createTrace(map: number[][]) {
    if (debug) {
        const arr = new Array(map.length).fill([]);
        return arr.map(() => new Array(map[0].length).fill("."));
    }

    return null;
}

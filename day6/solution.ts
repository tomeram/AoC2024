import { getLines, sleep } from "../utils.ts";
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";
import chalk from "npm:chalk";

const debug = true;

export async function solveD6P1() {
    const lines = await getLines(6);
    const { map, pos } = readMap(lines);

    printMap(map);

    while (guardInBound(map, pos)) {
        moveGuard();
        printMap(map);
        // await sleep(10);
    }

    printMap(map);

    let res = 0;
    for (const row of map) {
        for (const cell of row) {
            if (cell === "X") {
                res++;
            }
        }
    }

    return res;

    function moveGuard() {
        const dir = dirToCell[pos.d];
        const nextPos = { ...pos, x: pos.x + dir.x, y: pos.y + dir.y };
        const nextCell = guardInBound(map, nextPos)
            ? map[pos.x + dir.x][pos.y + dir.y]
            : ".";
        if (nextCell === "#") {
            pos.d = dir.r;
            map[pos.x][pos.y] = pos.d;
            return;
        }

        map[pos.x][pos.y] = "X";
        pos.x += dir.x;
        pos.y += dir.y;
        if (guardInBound(map, pos)) {
            map[pos.x][pos.y] = pos.d;
        }
    }
}

export async function solveD6P2() {
    const lines = await getLines(6);
    const { map, pos } = readMap(lines);
    const startPos = { ...pos };

    const blockPositions = new Set<string>();

    while (guardInBound(map, pos)) {
        const block = canBlockHere();
        if (block != null && block.x !== startPos.x && block.y !== startPos.y) {
            const posString = `${block.x},${block.y}`;
            blockPositions.add(posString);
            await keypress();
        }
        moveGuard(pos, map);
    }

    if (debug) {
        for (const pos of Array.from(blockPositions)) {
            const [x, y] = pos.split(",").map((_) => parseInt(_));

            map[x][y] = "O";
        }

        printMap(map);
    }

    return blockPositions.size;

    function moveGuard(pos: Pos, map: string[][]) {
        const dir = dirToCell[pos.d];
        const { nextCell } = getNextCell(pos, map);
        if (nextCell === "#" || nextCell === "O") {
            pos.d = dir.r;
            return;
        }

        pos.x += dir.x;
        pos.y += dir.y;
        if (guardInBound(map, pos)) {
            map[pos.x][pos.y] = pos.d;
        }
    }

    function canBlockHere(): Pos | null {
        const { nextCell, nextPos: potentialBlock } = getNextCell(pos, map);

        if (!guardInBound(map, potentialBlock) || nextCell === "#") {
            return null;
        }

        const nextPos = {
            x: pos.x,
            y: pos.y,
            d: dirToCell[pos.d].r,
        };
        const workingMap = _.cloneDeep(map);
        workingMap[potentialBlock.x][potentialBlock.y] = "O";

        while (true) {
            if (!guardInBound(workingMap, nextPos)) {
                return null;
            }

            const { nextCell } = getNextCell(nextPos, workingMap);
            if (nextCell === nextPos.d) {
                printMap(workingMap, map);
                return potentialBlock;
            }

            moveGuard(nextPos, workingMap);
        }
    }
}

function readMap(
    lines: string[],
): { map: string[][]; pos: Pos } {
    const map: string[][] = [];
    const pos = { x: 0, y: 0, d: Dir.up };
    for (const line of lines) {
        const row = line.split("");
        map.push(row);
        const guardPos = row.indexOf("^");

        if (guardPos > 0) {
            pos.x = map.length - 1;
            pos.y = guardPos;
            pos.d = row[guardPos] as Dir;
        }
    }

    return { map, pos };
}

function getNextCell(
    pos: Pos,
    map: string[][],
) {
    const dir = dirToCell[pos.d];
    const nextPos = { ...pos, x: pos.x + dir.x, y: pos.y + dir.y };
    const nextCell = guardInBound(map, nextPos)
        ? map[pos.x + dir.x][pos.y + dir.y]
        : ".";
    return { nextCell, nextPos };
}

function guardInBound(map: string[][], pos: Pos) {
    return pos.x >= 0 &&
        pos.x < map.length &&
        pos.y >= 0 &&
        pos.y < map[0].length;
}

enum Dir {
    up = "^",
    down = "V",
    left = "<",
    right = ">",
}

const dirToCell = {
    [Dir.up]: { x: -1, y: 0, r: Dir.right },
    [Dir.right]: { x: 0, y: 1, r: Dir.down },
    [Dir.down]: { x: 1, y: 0, r: Dir.left },
    [Dir.left]: { x: 0, y: -1, r: Dir.up },
};

function printMap(map: string[][], globalMap: string[][] | null = null) {
    if (!debug) return;
    console.log("------------------------------------------------------------");
    for (let i = 0; i < map.length; i++) {
        const row = map[i];
        console.log(
            row.map((_, j) => {
                if (_ === "#") {
                    return chalk.green(_);
                }

                if (_ === "O") {
                    return chalk.red(_);
                }

                if (globalMap == null) {
                    return _;
                }

                return globalMap[i][j] === _ ? _ : chalk.bgBlue(_);
            }).join(""),
        );
    }
    console.log("------------------------------------------------------------");
}

function keypress() {
    process.stdin.setRawMode(true);
    return new Promise((resolve) =>
        process.stdin.once("data", () => {
            process.stdin.setRawMode(false);
            resolve(null);
        })
    );
}

type Pos = { x: number; y: number; d: Dir };

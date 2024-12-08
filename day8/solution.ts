import { getLines } from "../utils.ts";

export async function solveD8P1() {
    const { frequencyToNodes, map, resMap } = await setup();

    for (const [frequency, nodes] of Object.entries(frequencyToNodes)) {
        for (const n1 of nodes) {
            for (const n2 of nodes) {
                if (n1 == n2) continue;

                const distx = n1.x - n2.x;
                const disty = n1.y - n2.y;
                const x = n1.x + distx;
                const y = n1.y + disty;

                if (x >= 0 && x < map.length) {
                    if (y >= 0 && y < map[0].length) {
                        resMap[x][y] = frequency;
                    }
                }
            }
        }
    }

    return resMap.flatMap((_) => _).filter((_) => _ !== ".").length;
}

export async function solveD8P2() {
    const { frequencyToNodes, map, resMap } = await setup();

    for (
        const [frequency, nodes] of Object.entries(frequencyToNodes).filter((
            [_, nodes],
        ) => nodes.length > 1)
    ) {
        for (const n1 of nodes) {
            resMap[n1.x][n1.y] = frequency;
            for (const n2 of nodes) {
                if (n1 == n2) continue;

                const distx = n1.x - n2.x;
                const disty = n1.y - n2.y;
                let x = n1.x + distx;
                let y = n1.y + disty;

                while (true) {
                    if (
                        x >= 0 && x < map.length && y >= 0 && y < map[0].length
                    ) {
                        resMap[x][y] = frequency;
                        x += distx;
                        y += disty;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    return resMap.flatMap((_) => _).filter((_) => _ !== ".").length;
}

async function setup() {
    const map = await readMap();
    const frequencyToNodes: { [key: string]: Pos[] } = buildFrequencyToNodes(
        map,
    );

    const resMap = Array.from(
        { length: map.length },
        (_) => Array<string>(map[0].length).fill("."),
    );
    return { frequencyToNodes, map, resMap };
}

function buildFrequencyToNodes(map: string[][]) {
    const frequencyToNodes: { [key: string]: Pos[] } = {};

    for (let i = 0; i < map.length; i++) {
        const line = map[i];
        for (let j = 0; j < line.length; j++) {
            const point = line[j];

            if (point === ".") continue;

            frequencyToNodes[point] ??= [];
            frequencyToNodes[point].push({ x: i, y: j });
        }
    }
    return frequencyToNodes;
}

async function readMap() {
    const lines = await getLines(8);
    const map: string[][] = [];

    for (const line of lines) {
        map.push(line.split(""));
    }

    return map;
}

type Pos = { x: number; y: number };

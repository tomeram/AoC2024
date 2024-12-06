import { getLines } from "../utils.ts";

export async function solveD4P1() {
    let count = 0;
    const lines = await getLines(4);

    for (let row = 0; row < lines.length; row++) {
        for (let col = 0; col < lines[row].length; col++) {
            count += countWords(lines, row, col);
        }
    }

    return count;
}

function countWords(lines: string[], row: number, col: number): number {
    const line = lines[row];

    if (line[col] !== "X") return 0;

    const dirs = {
        r: { condition: col + 3 < line.length, v: 0, h: 1 },
        l: { condition: col >= 3, v: 0, h: -1 },
        d: { condition: row < lines.length - 3, v: 1, h: 0 },
        u: { condition: row >= 3, v: -1, h: 0 },
    };

    const words: { [key: string]: string[] } = {
        r: [],
        l: [],
        u: [],
        d: [],
        ru: [],
        rd: [],
        lu: [],
        ld: [],
    };

    for (let i = 0; i < 4; i++) {
        for (const [key, word] of Object.entries(words)) {
            let relevant = true;

            for (const char of key) {
                if (!dirs[char as keyof typeof dirs].condition) {
                    relevant = false;
                    break;
                }
            }

            if (!relevant) continue;

            const wd = key.split("") as Array<keyof typeof dirs>;

            const dir1 = dirs[wd[0]];
            const dir2 = dirs[wd[1]];

            const h = (dir1.h || dir2?.h) ?? 0;
            const v = (dir1.v || dir2?.v) ?? 0;

            word.push(
                lines[
                    row + i * v
                ][
                    col + i * h
                ],
            );
        }
    }

    return Object.values(words)
        .map((_) => _.join(""))
        .filter((_) => _ === "XMAS")
        .length;
}

export async function solveD4P2() {
    let count = 0;
    const lines = await getLines(4);

    for (let row = 1; row < lines.length - 1; row++) {
        for (let col = 1; col < lines[row].length - 1; col++) {
            count += countXs(lines, row, col);
        }
    }

    return count;
}

function countXs(lines: string[], row: number, col: number): number {
    const line = lines[row];

    if (line[col] !== "A") return 0;

    const dirs = {
        r: { v: 0, h: 1 },
        l: { v: 0, h: -1 },
        d: { v: 1, h: 0 },
        u: { v: -1, h: 0 },
    };

    const words: { [key: string]: string } = {
        ru: "",
        rd: "",
        lu: "",
        ld: "",
    };

    for (let i = 1; i < 2; i++) {
        for (const key of Object.keys(words)) {
            const wd = key.split("") as Array<keyof typeof dirs>;

            const dir1 = dirs[wd[0]];
            const dir2 = dirs[wd[1]];

            const h = (dir1.h || dir2?.h) ?? 0;
            const v = (dir1.v || dir2?.v) ?? 0;

            words[key] = lines[
                row + i * v
            ][
                col + i * h
            ];
        }
    }

    let res = 0;
    if (words.lu + words.rd == "SM" || words.lu + words.rd == "MS") {
        if (words.ru + words.ld == "SM" || words.ru + words.ld == "MS") {
            res++;
        }
    }

    return res;
}

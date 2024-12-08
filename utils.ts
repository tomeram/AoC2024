import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export async function getLines(day: number) {
    return (await fs.readFile(
        path.join(import.meta.dirname ?? "", `day${day}`, "./input.txt"),
    )).toString().split("\n");
}

export function sleep(time: number = 1000) {
    return new Promise((res) => setTimeout(res, time));
}

export function awaitKeypress() {
    process.stdin.setRawMode(true);
    return new Promise((resolve) =>
        process.stdin.once("data", () => {
            process.stdin.setRawMode(false);
            resolve(null);
        })
    );
}

export function printMap(map: string[][]) {
    console.log(map.map((_) => _.join("")).join("\n"));
}

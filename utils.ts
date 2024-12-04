import fs from "node:fs/promises";
import path from "node:path";

export async function getLines(day: number) {
    return (await fs.readFile(path.join(import.meta.dirname ?? '', `day${day}`, './input.txt'))).toString().split('\n');
}

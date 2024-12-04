import fs from 'node:fs/promises';
import path from "node:path";

export async function solveD1P1() {
    const { left, right } = await getLists();

    left.sort();
    right.sort();
    
    let dist = 0;

    for (let i = 0; i < left.length; i++) {
        dist += Math.abs(left[i] - right[i]); 
    }
    
    return dist;
}

export async function solveD1P2() {
    const { left, right } = await getLists();
    
    const r_count = new Map<number, number>();

    for (let i = 0; i < right.length; i++) {
        const element = right[i];
        
        if (!r_count.has(element)) {
            r_count.set(element, 1);
        } else {
            r_count.set(element, 1 + r_count.get(element)!); 
        }
    }

    let total = 0;
    for (let i = 0; i < left.length; i++) {
        const element = left[i];
        
        if (r_count.has(element)) {
            total += element * r_count.get(element)!;
        }
    }

    return total;
}

async function getLists() {
  const text = (await fs.readFile(path.join(import.meta.dirname ?? '', '/input.txt'))).toString();
  const left = [];
  const right = [];
  for (const line of text.split('\n')) {
    if (line.trim() === '') {
      continue;
    }
    const [l, r] = line.split(/\s+/);
    left.push(parseInt(l));
    right.push(parseInt(r));
  }
  return { left, right };
}

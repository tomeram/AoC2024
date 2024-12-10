import { getLines } from "../utils.ts";

export async function solveD9P1() {
    const disk = (await getLines(9))[0]
        .split("")
        .map((_) => parseInt(_));

    const segments: Segment[] = [];

    let fileId = 0;
    for (let i = 0; i < disk.length; i++) {
        const segment = disk[i];
        segments.push({
            index: i,
            size: segment,
            isFile: i % 2 === 0,
            id: i % 2 === 0 ? fileId++ : null,
        });
    }

    let resDisk: number[] = [];
    let i = 0;
    let j = segments.length - (segments[segments.length - 1].isFile ? 1 : 2);

    while (i <= j) {
        if (segments[i].isFile) {
            const file = segments[i];
            resDisk = resDisk.concat(new Array(file.size).fill(file.id!));
            i++;
            continue;
        }

        while (segments[i].size > 0) {
            const file = segments[j];
            const space = segments[i];

            if (space.size >= file.size) {
                space.size -= file.size;
                resDisk = resDisk.concat(new Array(file.size).fill(file.id!));
                j -= 2;
            } else {
                file.size -= space.size;
                resDisk = resDisk.concat(new Array(space.size).fill(file.id!));
                space.size = 0;
                break;
            }
        }

        if (segments[i].size === 0) {
            i++;
        }
    }

    return resDisk.reduce(
        (v, e, i) => v + (e * i),
        0,
    );
}

/*
 * O(n^2) solution which works in 2.5 seconds :/
 */
export async function solveD9P2() {
    const disk = (await getLines(9))[0]
        .split("")
        .map((_) => parseInt(_));

    let data: number[] = [];
    for (let i = 0; i < disk.length; i++) {
        data = [
            ...data,
            ...new Array(disk[i]).fill(i % 2 == 0 ? i / 2 : -1),
        ];
    }

    const movedNums = new Set<number>();

    for (let i = data.length - 1; i >= 0;) {
        const id = data[i];

        if (id < 0 || movedNums.has(id)) {
            i--;
            continue;
        } else {
            movedNums.add(id);
        }

        let len = 1;
        while (i - len >= 0 && data[i - len] === id) {
            len++;
        }

        i -= len;

        let spaceLen = 0;
        let j = 0;
        for (; j <= i; j++) {
            if (spaceLen === len) {
                break;
            }
            if (data[j] < 0) {
                spaceLen++;
            } else {
                spaceLen = 0;
            }
        }

        if (spaceLen < len) {
            continue;
        }

        for (let c = i + 1; c <= i + len; c++) {
            data[c] = -1;
        }

        for (let c = j - len; c < j; c++) {
            data[c] = id;
        }
    }

    return data.reduce((total, val, i) => total + ((val > 0 ? val : 0) * i), 0);
}

/*
 * O(n) solution which probably has some list manipulation bug
 */
export async function solveD9P2_not_working() {
    const disk = (await getLines(9))[0]
        .split("")
        .map((_) => parseInt(_));

    const segments: ListNode = new ListNode({
        id: null,
        index: -1,
        isFile: false,
        size: 0,
    });
    let lastSegment = segments;
    const fileIndexes: ListNode[] = [];
    const spaces = new Map<number, ListNode[]>();

    let fileId = 0;
    for (let i = 0; i < disk.length; i++) {
        const segment = disk[i];
        const isFile = i % 2 === 0;
        lastSegment.next = new ListNode({
            index: i,
            size: segment,
            isFile: isFile,
            id: isFile ? fileId++ : null,
        }, lastSegment);
        lastSegment = lastSegment.next;

        if (isFile) {
            fileIndexes.push(lastSegment);
        } else {
            spaces.set(segment, [...spaces.get(segment) ?? [], lastSegment]);
        }
    }

    for (let i = fileIndexes.length - 1; i >= 0; i--) {
        // console.log(segments.getString());
        const file = fileIndexes[i];
        const maxSize = Math.max(...spaces.keys());

        if (maxSize < file.segment.size) {
            continue;
        }

        let currSpaces: ListNode[] = [];
        let index = Number.MAX_VALUE;

        for (let size = file.segment.size; size <= maxSize; size++) {
            if (!spaces.has(size)) continue;
            const s = spaces.get(size)!;

            if (index < (s[0]?.segment.index ?? Number.MAX_VALUE)) continue;

            currSpaces = s;
            index = s[0].segment.index;
        }

        if (currSpaces.length === 0) {
            continue;
        }
        const space = currSpaces[0];

        if (space.segment.index > file.segment.index) {
            continue;
        }

        if (space.segment.size === file.segment.size) {
            replaceSegments(space, file, spaces);
        } else if (space.segment.size > file.segment.size) {
            space.segment.size -= file.segment.size;
            spaces.set(
                maxSize,
                currSpaces.filter((_) => _ != space),
            );
            addToSpaces(spaces, space);

            const newSpace = new ListNode({
                index: space.segment.index + 0.5,
                id: space.segment.id! + 0.5,
                isFile: false,
                size: file.segment.size,
            });

            newSpace.next = space;
            newSpace.prev = space.prev;
            space.prev!.next = newSpace;
            space.prev = newSpace;
            replaceSegments(newSpace, file, spaces);
            addToSpaces(spaces, newSpace);
        }

        if (currSpaces.length == 0) {
            spaces.delete(maxSize);
        }
    }

    let node = segments.next;
    let sum = 0;
    let i = 0;
    const res: string[] = [];

    // console.log(segments.getString());

    while (node != null) {
        const value = node.segment.isFile ? node.segment.id : 0;
        for (let j = 0; j < node.segment.size; j++) {
            res.push(node.segment.isFile ? node.segment.id!.toString() : ".");
            sum += 1 * value! * i++;
        }
        node = node.next;
    }

    return sum;
}

type Segment = {
    index: number;
    size: number;
    isFile: boolean;
    id: number | null;
};

class ListNode {
    constructor(
        public segment: Segment,
        public prev?: ListNode | null,
        public next?: ListNode | null,
    ) {}

    public print() {
        console.log(this.segment, this.prev?.segment.id, this.next?.segment.id);
        this.next?.print();
    }

    public getString(): string {
        let curr: ListNode | null | undefined = this;
        let res = "";

        while (curr != null) {
            // if (curr.segment.size < 1) continue;

            res += new Array(curr.segment.size).fill(
                curr.segment.isFile ? curr.segment.id?.toString() : ".",
            ).join("");
            curr = curr.next;
        }

        return res;
    }
}

function addToSpaces(spaces: Map<number, ListNode[]>, newSpace: ListNode) {
    spaces.set(
        newSpace.segment.size,
        [
            newSpace,
            ...spaces.get(newSpace.segment.size) ?? [],
        ].sort((a, b) => a.segment.index - b.segment.index),
    );
}

function replaceSegments(
    space: ListNode,
    file: ListNode,
    spaces: Map<number, ListNode[]>,
) {
    const s_p = space.prev;
    space.prev = file.prev;
    space.prev!.next = space;
    file.prev = s_p;
    s_p!.next = file;

    const s_n = space.next;
    space.next = file.next;
    if (space.next != null) {
        space.next.prev = space;
    }

    file.next = s_n;
    if (s_n != null) {
        s_n.prev = file;
    }

    const s_i = space.segment.index;
    space.segment.index = file.segment.index;
    file.segment.index = s_i;
    spaces.set(
        space.segment.size,
        [
            space,
            ...spaces.get(space.segment.size) ?? [],
        ].sort((a, b) => a.segment.index - b.segment.index),
    );

    const prev = space.prev!;
    defrag(space, prev, spaces);
    if (space.next != null && !space.next.segment.isFile) {
        defrag(space.next, space, spaces);
    }
}

function defrag(
    space: ListNode,
    prev: ListNode,
    spaces: Map<number, ListNode[]>,
) {
    if (!space.segment.isFile) {
        if (!prev!.segment.isFile) {
            const joinedSpace = new ListNode({
                index: prev.segment.index,
                size: prev.segment.size + space.segment.size,
                id: null,
                isFile: false,
            });

            joinedSpace.prev = prev.prev;
            prev.prev!.next = joinedSpace;
            joinedSpace.next = space.next;
            if (space.next != null) {
                space.next.prev = joinedSpace;
            }

            const spaceArr = spaces
                .get(space.segment.size)!
                .filter((_) => _ != space);
            if (spaceArr.length > 0) {
                spaces.set(
                    space.segment.size,
                    spaceArr,
                );
            } else {
                spaces.delete(space.segment.size);
            }

            const prevArr = spaces.get(prev.segment.size)!.filter((_) =>
                _ != prev
            );
            if (prevArr.length > 0) {
                spaces.set(
                    prev.segment.size,
                    prevArr,
                );
            } else {
                spaces.delete(prev.segment.size);
            }
            addToSpaces(spaces, joinedSpace);
        }
    }
}

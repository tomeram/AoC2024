import { getLines } from "../utils.ts";

export async function solveD5P1() {
    let res = 0;
    const lines = await getLines(5);

    const rules: { [key: string]: string[] } = {};

    let i = 1;
    for (const line of lines) {
        if (line === "") break;
        i++;

        line.split("|").forEach((page) => {
            rules[page] ??= [];

            rules[page] = [...rules[page], line];
        });
    }

    for (; i < lines.length; i++) {
        const update = lines[i];

        let isValid = true;
        const pages = update.split(",");
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const pageRules = rules[page];

            if (
                pageRules.some((rule) => {
                    const [p1] = rule.split("|");
                    if (p1 === page) return false;

                    return pages.slice(i).includes(p1);
                })
            ) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            res += parseInt(pages[Math.floor(pages.length / 2)]);
        }
    }

    return res;
}

export async function solveD5P2() {
    let res = 0;
    const lines = await getLines(5);

    const rules: { [key: string]: string[] } = {};

    let i = 1;
    for (const line of lines) {
        if (line === "") break;
        i++;

        line.split("|").forEach((page) => {
            rules[page] ??= [];

            rules[page] = [...rules[page], line];
        });
    }

    for (; i < lines.length; i++) {
        const update = lines[i];

        let wasValid = true;
        const pages = update.split(",");
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            let violatedRule = getViolatingRule(page, pages, i);

            if (
                violatedRule == null
            ) {
                continue;
            }

            wasValid = false;

            while (violatedRule != null) {
                const [p1, p2] = violatedRule.split("|");
                const i2 = pages.indexOf(p1);
                pages[i] = p1;
                pages[i2] = p2;
                page = p1;

                violatedRule = getViolatingRule(page, pages, i);
            }
        }

        if (!wasValid) {
            res += parseInt(pages[Math.floor(pages.length / 2)]);
        }
    }

    return res;

    function getViolatingRule(page: string, pages: string[], i: number) {
        const pageRules = rules[page];

        const violatedRule = pageRules.find((rule) => {
            const [p1] = rule.split("|");
            if (p1 === page) return false;

            return pages.slice(i).includes(p1);
        });
        return violatedRule;
    }
}

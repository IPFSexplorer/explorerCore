import fs from "fs";
import path from "path";

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// function makeFunctionFromString(value) {
//     var args = value
//         .replace(/\/\/.*$|\/\*[\s\S]*?\*\//mg, '') //strip comments
//         .match(/\(.*?\)/m)[0]                      //find argument list
//         .replace(/^\(|\)$/, '')                    //remove parens
//         .match(/[^\s(),]+/g) || [],                //find arguments
//         body = value.match(/\{(.*)\}/)[1]          //extract body between curlies

//     return Function.apply(0, args.concat(body);
// }

export function makeFunctionFromString(value: string) {
    return new Function("return " + value)();
}

export class TimeMeaseure {
    static NS_PER_SEC = 1e9;
    hrstart: [number, number];
    hrend: [number, number];
    identificator: string;
    static results: Map<string, [[number, number]]> = new Map<string, [[number, number]]>();
    public constructor(identificator: string) {
        this.identificator = identificator;
        this.hrstart = process.hrtime();
    }
    public static start(identificator: string) {
        return new TimeMeaseure(identificator);
    }

    public stop() {
        this.hrend = process.hrtime(this.hrstart);
        if (!TimeMeaseure.results.has(this.identificator)) {
            TimeMeaseure.results.set(this.identificator, [this.hrend]);
        } else TimeMeaseure.results.get(this.identificator).push(this.hrend);
        return this;
    }

    public static async print(filePath: string = "./") {
        for (const ident of this.results.keys()) {
            const outPath = path.join(filePath, ident + ".txt");
            await fs.promises.writeFile(
                outPath,
                TimeMeaseure.results
                    .get(ident)
                    .map((res) => `${res[0] * TimeMeaseure.NS_PER_SEC + res[1] / 1000000}`)
                    .join("\n"),
            );
        }
    }

    public valueOf() {
        return this.toString();
    }

    public toString() {
        return `Execution time of ${this.identificator}: ${this.hrend[0]}s ${this.hrend[1] / 1000000}ms`;
    }
}

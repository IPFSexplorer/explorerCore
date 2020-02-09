export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    return eval(value);
}

import { JsonCustomConvert, JsonConverter } from "json2typescript";
import { makeFunctionFromString } from '@/common';

@JsonConverter
export class FunctionConverter implements JsonCustomConvert<Function> {
    serialize(value: Function): string {
        return value.toString();
    }
    deserialize(value: string): Function {
        return makeFunctionFromString(value)
    }
}
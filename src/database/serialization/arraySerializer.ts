import { Serialize, deflate, inflate } from "serialazy";

type Constructor<T> = new (...args: any[]) => T;

export default function SerializeAnArrayOf<Type>(ctor: Constructor<Type>) {
    return Serialize.Custom({
        down: (instances: Array<Type>) => {
            if (!instances) { return; }
            return instances.map(instance => deflate(instance))
        },
        up: (jsonObjs: Array<any>) => {
            if (!jsonObjs) { return; }
            return jsonObjs.map(jsonObj => inflate(ctor, jsonObj))
        }
    })
}
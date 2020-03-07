import { Serialize, deflate, inflate } from "serialazy";

type Constructor<T> = new (...args: any[]) => T;

export default function SerializeAnObjectOf<Type>(ctor: Constructor<Type>) {
    return Serialize.Custom({
        down: (instances: Object) => {
            if (!instances) { return; }
            const res = {}
            Object.keys(instances).forEach(k => res[k] = deflate(instances[k]))
            return res
        },
        up: (jsonObjs: Object) => {
            if (!jsonObjs) { return; }
            const res = {}
            Object.keys(jsonObjs).forEach(k => res[k] = inflate(ctor, jsonObjs[k]))
            return res
        }
    })
}
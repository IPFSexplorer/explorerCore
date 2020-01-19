import Index from ".";

export default interface iIndex {
    find(key: any): any;
    add(key: any, value: any);
}

import logger from "@/logger";
import { delay } from "@/common";
import CID from "cids";
import multihashing from "multihashing";
import { stringify } from "flatted";
import { Child } from "@/database/index/bTree/Interfaces";

// initial state
const state = {
    delayBetweenNodes: 500,
    query: null,
    result: new Set(),
    graphNodes: []
};

// getters
const getters = {
    getNodeDelay: state => {
        return state.delayBetweenNodes;
    },
    hasQuery: state => {
        return state.query !== null;
    },
    nodes: state => {
        let results = [];
        let xforlevels = {};
        for (const node of state.graphNodes) {
            if (node.node) {
                let nodeLevel = getNodeLevel(node.node);
                if (!xforlevels[nodeLevel]) {
                    xforlevels[nodeLevel] = 0;
                }
                results.push({
                    data: node.data,
                    position: { x: xforlevels[nodeLevel], y: nodeLevel * 100 }
                });

                xforlevels[nodeLevel] += 75;
            } else {
                results.push({ data: node.data });
            }
        }
        return results;

        function getNodeLevel(node) {
            let level = 0;
            while (node.parent) {
                node = node.parent;
                level++;
            }
            console.log("node level is " + level);
            return level;
        }
    },
    result: state => {
        return state.result;
    }
};

// actions
const actions = {
    setQueryResult({ commit }, result) {
        commit("setResult", result);
    },
    setDelay({ commit }, newDelay) {
        commit("setDelay", newDelay);
    },
    newQuery({ commit }, query) {
        commit("setNewQuery", query);
        logger.info(query);
    },
    async addNode({ commit }, child: Child<any, any>) {
        if (!this.getters.hasQuery) return;
        console.log("start delay");
        await delay(this.getters.getNodeDelay);
        console.log("end delay");

        // root node does not have parent
        let parentId;
        if (child.key === "root") {
            commit("addNode", {
                data: {
                    id: getLableFromNode(child.node),
                    label: getLableFromNode(child.node)
                }
            });
        }

        for (let i = 0; i < child.node.children.items.length; i++) {
            if (!child.node.isLeaf) {
                commit("addNode", {
                    data: {
                        id: getLableFromNode(child.node.children.items[i].node),
                        label: getLableFromNode(
                            child.node.children.items[i].node
                        )
                    },
                    node: child.node.children.items[i].node
                });

                commit("addNode", {
                    data: {
                        id:
                            getLableFromNode(child.node) +
                            child.node.children.items[i].key,
                        source: getLableFromNode(child.node),
                        target: getLableFromNode(
                            child.node.children.items[i].node
                        ),
                        label:
                            child.node.children.items[i].key == null
                                ? "inf"
                                : child.node.children.items[i].key
                    }
                });
            } else {
                commit("addNode", {
                    data: {
                        id: child.node.children.items[i].key,
                        label: child.node.children.items[i].key
                    },
                    node: {
                        ...child.node.children.items[i],
                        parent: child.node
                    }
                });

                commit("addNode", {
                    data: {
                        id:
                            getLableFromNode(child.node) +
                            child.node.children.items[i].key,
                        source: getLableFromNode(child.node),
                        target: child.node.children.items[i].key,
                        label:
                            child.node.children.items[i].key == null
                                ? "inf"
                                : child.node.children.items[i].key
                    }
                });
            }
        }

        if (child.node.isLeaf) {
            if (child.node.previousNode) {
                commit("addNode", {
                    data: {
                        id: getLableFromNode(child.node.previousNode),
                        label: getLableFromNode(child.node.previousNode)
                    },
                    node: child.node.previousNode
                });

                commit("addNode", {
                    data: {
                        id:
                            getLableFromNode(child.node.previousNode) +
                            getLableFromNode(child.node),
                        source: getLableFromNode(child.node.previousNode),
                        target: getLableFromNode(child.node)
                    },
                    classes: ["toWay"]
                });
            }

            if (child.node.nextNode) {
                commit("addNode", {
                    data: {
                        id: getLableFromNode(child.node.nextNode),
                        label: getLableFromNode(child.node.nextNode)
                    },
                    node: child.node.nextNode
                });

                commit("addNode", {
                    data: {
                        id:
                            getLableFromNode(child.node) +
                            getLableFromNode(child.node.nextNode),
                        source: getLableFromNode(child.node.nextNode),
                        target: getLableFromNode(child.node)
                    },
                    classes: ["toWay"]
                });
            }
        }
    }
};

// mutations
const mutations = {
    setDelay(state, delay) {
        state.delayBetweenNodes = delay;
    },
    setResult(state, result) {
        state.result = result;
    },
    setNewQuery(state, query) {
        state.graphNodes = [];
        state.query = query;
        state.result = new Set();
    },
    addNode(state, node) {
        state.graphNodes.push(node);
    }
};

export default {
    namespaced: false,
    state,
    getters,
    actions,
    mutations
};

function getLableFromNode(node) {
    return node.children.items
        .map(ch => (ch.key === null ? "inf" : ch.key))
        .join();
}

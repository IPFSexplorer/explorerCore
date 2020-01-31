import logger from "@/logger";
import { delay } from "@/common";

// initial state
const state = {
    delayBetweenNodes: 500,
    query: null,
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
        return state.graphNodes;
    }
};

// actions
const actions = {
    setDelay({ commit }, newDelay) {
        commit("setDelay", newDelay);
    },
    newQuery({ commit }, query) {
        commit("setNewQuery", query);
        logger.info(query);
    },
    async addNode({ commit }, node) {
        if (!this.getters.hasQuery) return;
        await delay(this.getters);
    }
};

// mutations
const mutations = {
    setDelay(state, delay) {
        state.delayBetweenNodes = delay;
    },
    setNewQuery(state, query) {
        state.graphNodes = [];
        state.query = query;
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

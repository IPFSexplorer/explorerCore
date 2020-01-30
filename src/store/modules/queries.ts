import logger from "@/logger";

// initial state
const state = {
    query: null,
    all: []
};

// getters
const getters = {
    hasQuery: state => {
        return state.query !== null;
    }
};

// actions
const actions = {
    newQuery({ commit }, query) {
        commit("setNewQuery", query);
        logger.info(query);
    },
    addNode({ commit }, node) {
        if (!this.getters["queries/hasQuery"]) return;
        console.log(node);
    },
    addValue({ commit }, value) {
        if (!this.getters["queries/hasQuery"]) return;
        //logger.info(value);
    },
    addLeaf({ commit }, leaf) {
        if (!this.getters["queries/hasQuery"]) return;
        //logger.info(leaf);
    }
};

// mutations
const mutations = {
    setNewQuery(state, query) {
        state.query = query;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};

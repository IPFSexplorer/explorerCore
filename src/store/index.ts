import Vue from "vue";
import Vuex from "vuex";
import queries from "./modules/queries";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
    modules: {
        queries
    },
    strict: debug
});

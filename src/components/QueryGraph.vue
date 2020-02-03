<template>
    <div class="graphContainer height100 width100">
        <h2 class="header">Query graph</h2>
        <cytoscape
            ref="cy"
            :config="config"
            :afterCreated="afterCreated"
            class="graph height100 width100"
            :preConfig="preConfig"
        >
            <cy-element
                v-for="def in nodes"
                :key="`${def.data.id}`"
                :definition="def"
            />
        </cytoscape>
    </div>
</template>

<script lang="ts">
import VueCytoscape from "vue-cytoscape";

import { Component, Prop, Vue } from "vue-property-decorator";

Vue.use(VueCytoscape);

@Component({
    components: {}
})
export default class QueryGraph extends Vue {
    preConfig(cytoscape) {}

    afterCreated(cy) {}

    get nodes() {
        return this.$store.getters.nodes;
    }

    data() {
        return {
            config: {
                style: [
                    {
                        selector: "node",
                        style: {
                            "background-color": "#666",
                            label: "data(label)"
                        }
                    },
                    {
                        selector: "node.flash",
                        style: {
                            "background-color": "#fff"
                        }
                    },
                    {
                        selector: "edge",
                        style: {
                            width: 1,
                            label: "data(label)",
                            "target-arrow-shape": "triangle",
                            "line-color": "#9dbaea",
                            "target-arrow-color": "#9dbaea",
                            "curve-style": "bezier"
                        }
                    },
                    {
                        selector: "edge.toWay",
                        style: {
                            width: 4,
                            label: "data(label)",
                            "target-arrow-shape": "triangle",
                            "source-arrow-shape": "triangle",
                            "line-color": "#9dbaea",
                            "target-arrow-color": "#9dbaea",
                            "source-arrow-color": "#9dbaea",
                            "curve-style": "bezier"
                        }
                    }
                ]
            }
        };
    }
}
</script>

<style>
.graphContainer {
    width: 100%;
    height: 100%;
}

.graph {
    width: 100%;
    height: 100%;
}

.graph canvas {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}

#cytoscape-div {
    height: 100%;
}

.header {
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
}
</style>

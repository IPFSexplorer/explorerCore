<template>
    <div class="graphContainer height100 width100">
        <div>{{ nodes }}</div>
        <cytoscape
            ref="cy"
            :config="config"
            :afterCreated="afterCreated"
            class="graph height100 width100"
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
    afterCreated(cy) {
        cy.resize();
    }

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
                            label: "data(id)"
                        }
                    }
                ]
            },

            elements: [
                {
                    // node a
                    data: { id: "a" }
                }
            ]
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
</style>

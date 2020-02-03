<template>
    <div class="resultsCont">
        <h2 class="center">Query Result</h2>
        <code class="result">{{ value }}</code>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {}
})
export default class QueryResult extends Vue {
    get value() {
        return Array.from(this.$store.getters.result);
    }
}
</script>

<style scoped>
.result {
    text-align: left;
    white-space: pre;
}

.resultsCont {
    height: 100%;
    overflow: auto;
    text-align: left;
}

.center {
    text-align: center;
}
</style>

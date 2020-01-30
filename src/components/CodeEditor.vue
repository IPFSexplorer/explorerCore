<template>
    <div class="code">
        <h2>Write query</h2>
        <prism-editor v-model="code" language="js"></prism-editor>
        <button @click="runQuery">Execute</button>
    </div>
</template>

<script lang="ts">
import "prismjs";
import "prismjs/themes/prism.css";
import PrismEditor from "vue-prism-editor";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Block } from "../models/Block";

@Component({
    components: {
        "prism-editor": PrismEditor
    }
})
export default class CodeEditor extends Vue {
    data() {
        return {
            code: `new this.Block()
                .where("height")
                .gt(5)
                .and("height")
                .lt(10)
                .all()`
        };
    }

    runQuery() {
        this.$store.dispatch("queries/newQuery", this.$data.code);
        console.log(this.$data.code);
        console.log(this.evalWithCOntext(this.$data.code));
    }

    evalWithCOntext(code) {
        return function(code) {
            return eval(code);
        }.call(
            {
                Block: Block
            },
            code
        );
    }
}
</script>

<style scoped>
.code {
    display: block;
    overflow: auto;
    height: 100%;
}
</style>

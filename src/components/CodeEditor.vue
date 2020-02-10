<template>
    <div class="code">
        <h2>Write query</h2>
        <prism-editor v-model="code" language="js" class="elevation-0"></prism-editor>
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
            code: `return await new this.Block()
                .where("height")
                .greatherThan(5)
                .all();`
        };
    }

    async runQuery() {
        console.log(this.$data.code);
        console.log(await this.evalWithContext(this.$data.code));
    }

    evalWithContext(code) {
        return function(code) {
            return eval("(async () => {" + code + "})()");
        }.call(
            {
                Block
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
<style>
code {
    box-shadow: none;
}
</style>

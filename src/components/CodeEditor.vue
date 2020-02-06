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
            code: `await new this.Block()
                .where("hash")
                .equal(
                    "000000006a906fbef861f23ce8ff5fae146675508fa5ec64817db5c81be04019"
                )
                .all();`
        };
    }

    async runQuery() {
        this.$store.dispatch("newQuery", this.$data.code);
        console.log(this.$data.code);
        console.log(await this.evalWithCOntext(this.$data.code));
    }

    evalWithCOntext(code) {
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

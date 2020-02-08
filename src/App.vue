<template>
    <div id="app">
        <split-pane :min-percent="20" :default-percent="30" split="vertical">
            <template slot="paneL">
                <CodeEditor></CodeEditor>
            </template>
            <template slot="paneR">
                <QueryResult />
            </template>
        </split-pane>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import splitPane from "vue-splitpane";
import CodeEditor from "@/components/CodeEditor.vue";
import QueryResult from "@/components/QueryResult.vue";

@Component({
    components: {
        "split-pane": splitPane,
        CodeEditor,
        QueryResult
    }
})
export default class App extends Vue {}
</script>

<style>
#app {
    height: 100vh;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

body {
    margin: 0;
    padding: 0;
}

.height100 {
    height: 100%;
}

.width100 {
    width: 100%;
}

.panel {
    background: white;
    overflow: auto;
}
</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  }
};
</script>

<style>
html,
body,
div#app {
  height: 100%;
  width: max-content;
  font-family: sans-serif;
  overflow-x: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

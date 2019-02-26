<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "Cello",

  data() {
    return {};
  }
};
</script>

<style>
html,
body {
  height: 100%;
  width: max-content;
  overflow-x: hidden;
  overflow-y: hidden;
}
div#app {
  height: 100%;
  font-family: sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

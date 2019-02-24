<template>
  <div ref="el" :class="['list', {selected}]">
    <p>List!</p>

    <slot>
      <p style="margin: 10px;">No cards!</p>
    </slot>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: ["selected"]
};
</script>

<style scoped>
div.list {
  background-color: rgba(255, 0, 0, 0.3);
}

div.list {
  height: 100%;
  border: 2px solid transparent;
  grid-row: 1 / -1;
}

div.list.selected {
  border: 2px solid black;
}
</style>
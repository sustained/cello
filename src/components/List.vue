<template>
  <div ref="el" :class="['list', {selected}]">
    <div class="list-wrapper">
      <p>List!</p>

      <slot>
        <p style="margin: 20px 10px;">No cards!</p>
      </slot>
    </div>

    <div class="list-add-card">
      <router-link to="card/add" append>Add Card</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ["selected"]
};
</script>

<style scoped>
div.list-wrapper {
  overflow-x: hidden;
  overflow-y: auto;

  flex-grow: 1;
}

div.list-add-card {
  padding: 0.5em;
}

div.list {
  width: 222px;

  display: flex;
  flex-direction: column;

  background-color: rgba(255, 0, 0, 0.3);
}

div.list {
  border: 2px solid transparent;
  margin-right: 0.5em;
}
div.list:last-child {
  margin-right: 0;
}
div.list.selected {
  border: 2px solid black;
}

p {
  margin: 10px;
}
</style>
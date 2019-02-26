<template>
  <div class="card">
    <!--NOTE: Couldn't get this working by passing an object with route: 'card', 
    investigate more + note that append here can cause issues in some cases.-->
    <router-link :to="`card/${card.id}`" append>
      <p>{{ card.title }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ["card"]
};
</script>

<style scoped>
div.card {
  background-color: rgb(0, 255, 0, 0.3);
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
}

div.card pre {
  margin-top: 1em;
  font-size: 0.5em;
}
</style>
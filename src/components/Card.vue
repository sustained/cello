<template>
  <div class="card">
    <p>
      <strong>Card #{{ card.id }}</strong>
    </p>
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
}
</style>
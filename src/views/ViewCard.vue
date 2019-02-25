<template>
  <div class="background">
    <div class="wrapper">
      <p>{{ card }}</p>
      <p>
        <a @click="$router.go(-1)">close card</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["card"]
};
</script>

<style>
div.background {
  background-color: rgba(0, 0, 0, 0.5);

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

div.wrapper {
  position: fixed;
  top: 15vh;
  bottom: 15vh;
  left: 15vw;
  right: 15vw;
  background-color: rgba(0, 0, 255, 0.25);
}

p {
  margin: 1em;
}
</style>
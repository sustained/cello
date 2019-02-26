<template>
  <input v-focus v-model="model" @focus="focus" @blur="blur" @keydown="keydown" type="text">
</template>

<script>
export default {
  props: ["data", "active"],

  data() {
    return { model: "", initialValue: "" };
  },

  mounted() {
    this.model = this.initialValue = this.data;
  },

  methods: {
    focus() {
      this.$emit("editing", true);
      this.$store.commit("DISABLE_NAVIGATION");
    },

    blur() {
      if (this.model !== this.initialValue) this.initialValue = this.model;

      this.$emit("edited", this.model);
      this.$emit("editing", false);

      this.$store.commit("ENABLE_NAVIGATION");
    },

    keydown(event) {
      if (event.key === "Enter" || event.key === "Escape") {
        this.blur();
      }
    }
  }
};
</script>

<style scoped>
</style>
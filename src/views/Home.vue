<template>
  <div class="home">
    <h1>This is a home page</h1>

    <mini-board v-for="board in boards" :key="board.id" :board="board"/>
  </div>
</template>

<script>
import { mapState } from "vuex";

import MiniBoard from "@/components/MiniBoard.vue";

export default {
  components: { MiniBoard },

  data() {
    return {};
  },

  computed: {
    ...mapState(["boards"])
  },

  mounted() {
    this.$store.dispatch("loadBoards");
  }
};
</script>

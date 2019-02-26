<template>
  <div class="home">
    <h1>This is a home page</h1>

    <mini-board v-for="board in boards" :key="board.id" :board="board"/>

    <h2>Create a board</h2>

    <form @submit.prevent="submit">
      <div>
        <label for="title">Title</label>
        <input type="text" name="title" v-model="createBoard.title">
        <input type="hidden" name="author" v-model="createBoard.author">
        <button>Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";

import cello from "@/services/CelloService.js";

import MiniBoard from "@/components/MiniBoard.vue";

export default {
  components: { MiniBoard },

  data() {
    return {
      createBoard: {
        title: "",
        author: "sustained",
        counts: { lists: 0, cards: 0 }
      }
    };
  },

  computed: {
    ...mapState(["boards"])
  },

  mounted() {
    this.$store.dispatch("loadBoards");
  },

  methods: {
    submit() {
      cello.createBoard(this.createBoard);
    }
  }
};
</script>

<template>
  <div id="board">
    <div class="grid" :style="style">
      <list v-for="list in board.lists" :key="list.id" :selected="isSelected(list.id)" ref="lists">
        <card v-for="card in cardsForList(list.id)" :key="card.id" :card="card"></card>
      </list>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";

import throttle from "lodash.throttle";

import List from "@/components/List.vue";
import Card from "@/components/Card.vue";

export default {
  components: { List, Card },

  data() {
    return {
      currentList: 0
    };
  },

  created() {},

  mounted() {
    window.scrollTo(0, 0);

    document.addEventListener("keydown", event => {
      console.log(event, event.keyCode);

      switch (event.keyCode) {
        case 65:
          this.scrollLeft();
          break;

        case 68:
          this.scrollRight();
          break;
      }
    });

    document.addEventListener(
      "mousewheel",
      throttle(event => {
        let current = this.$refs.lists[this.currentList];

        if (!current)
          return console.debug(
            "couldn't find list???",
            this.$refs.lists.length,
            this.currentList
          );

        // console.log(window.scrollX, current.$el.offsetLeft);

        if (event.deltaY < 0) this.currentList--;
        else if (event.deltaY > 0) this.currentList++;

        if (this.currentList < 0)
          this.currentList = this.$refs.lists.length - 1;
        if (this.currentList > this.$refs.lists.length - 1)
          this.currentList = 0;

        this.scrollToCurrentList();
        // window.scrollTo({
        //   top: 0,
        //   left: Math.max(
        //     0,
        //     this.$refs.lists[this.currentList].$el.offsetLeft - 16
        //   )
        // });
      }, 50),
      { passive: true }
    );

    if (this.$route.params.id) {
      this.$store.dispatch("loadBoard", this.$route.params.id);
    }
  },

  computed: {
    ...mapState(["board"]),
    ...mapGetters(["cardsForList"]),

    overflows() {
      return document.body.scrollWidth > document.body.clientWidth;
    },

    style() {
      return {
        "grid-template-columns": `repeat(${this.board.lists.length}, 200px)`
      };
    }
  },

  methods: {
    isSelected(listId) {
      // DB indexes start at 1.
      return listId - 1 === this.currentList;
    },

    scrollLeft() {
      if (--this.currentList < 0)
        this.currentList = this.$refs.lists.length - 1;
      this.scrollToCurrentList();
    },

    scrollRight() {
      if (++this.currentList > this.$refs.lists.length - 1)
        this.currentList = 0;
      this.scrollToCurrentList();
    },

    scrollToCurrentList() {
      if (!this.$refs.lists) return console.warn("no lists refs???");
      const element = this.$refs.lists[this.currentList].$el;
      element.scrollIntoView({
        behavior: "smooth", // TODO: Let user choose.
        inline: "center"
      });
    }
  }
};
</script>

<style>
div#board,
div.grid {
  height: 100%;
  width: 100%;
}

div.grid {
  display: grid;
  grid-gap: 1em;
  padding: 1em;
}
</style>
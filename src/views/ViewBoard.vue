<template>
  <div id="board" :class="classList" :style="styleList">
    <router-view></router-view>

    <template v-if="loadingState === 'loaded'">
      <board-introduction/>

      <div
        :class="gridClassList"
        :style="gridStyleList"
        v-for="(group, groupIndex) in groups"
        :key="group.id"
      >
        <list
          v-for="(list, listIndex) in listsForGroup(group.id)"
          :key="list.id"
          :row="groupIndex"
          :selected="isSelected(listIndex, group.id)"
          :list="list"
        >
          <card v-for="card in cardsForList(list.id)" :key="card.id" :card="card"></card>
        </list>
      </div>
    </template>

    <template v-else-if="loadingState === 'errored'">
      <p>
        An error occured while loading the board. Is the API running (
        <code>npm run api</code>)?
      </p>

      <p>{{ errorMessage }}</p>
    </template>
  </div>
</template>

<script>
// import Vue from "vue";
import { mapState, mapGetters } from "vuex";

import List from "@/components/List.vue";
import Card from "@/components/Card.vue";
import BoardIntroduction from "@/views/BoardIntroduction.vue";

export default {
  components: { List, Card, BoardIntroduction },

  data() {
    return {};
  },

  watch: {
    // HACK: Slightly hacky but works for now (when there is no boardPadding heh).
    loadingState(state) {
      if (state === "loaded") setTimeout(() => window.scrollTo(0, 0), 100);
    }
  },

  beforeDestroy() {
    // console.info("cleaning up event listeners");
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("mousewheel", this.handleMouseWheel);
  },

  async mounted() {
    // console.info("registering event listeners");
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("mousewheel", this.handleMouseWheel, {
      passive: true
    });

    if (this.$route.params.id)
      this.$store.dispatch("loadBoard", this.$route.params.id);
  },

  computed: {
    ...mapState([
      "board",
      "lists",
      "cards",
      "groups",
      "currentList",
      "currentGroup",
      "loadingState",
      "errorMessage",
      "options"
    ]),

    ...mapGetters(["cardsForList", "listsForGroup", "isLastGroupActive"]),

    classList() {
      return {
        loaded: this.loadingState === "loaded",
        loading: this.loadingState === "loading",
        errored: this.loadingState === "errored"
      };
    },

    styleList() {
      return {
        // height: this.options.gridHeight + "vh",
        padding:
          this.options.boardPadding[0] +
          "vh " +
          this.options.boardPadding[1] +
          "vh"
      };
    },

    gridClassList() {
      return ["grid"];
    },

    gridStyleList() {
      return {
        height: this.options.gridHeight + "vh"
      };
    }
  },

  methods: {
    isSelected(listIndex, groupId) {
      // NOTE: DB indexes start at 1.
      return (
        listIndex === this.currentList && groupId - 1 === this.currentGroup
      );
    },

    handleKeyDown(event) {
      switch (event.keyCode) {
        case 87: // W
          this.$store.dispatch("navigateUp");
          break;

        case 65: // A
          this.$store.dispatch("navigateLeft");
          break;

        case 83: // S
          this.$store.dispatch("navigateDown");
          break;

        case 68: // D
          this.$store.dispatch("navigateRight");
          break;

        case 69: // E
          // this.$store.dispatch("editListTitle");
          break;

        case 33: // Page Up
          this.$store.dispatch("navigateLeft", true);
          break;

        case 34: // Page Down
          this.$store.dispatch("navigateRight", true);
          break;
      }
    }
  }
};
</script>

<style>
div#board {
  /* height: 100vh; */
}

div#board {
  opacity: 0;
  transition: opacity 1s ease-in-out;
}
div#board.loaded,
div#board.errored {
  opacity: 1;
}

div.grid {
  display: flex;
  flex-direction: row;
  padding: 0.5em;
}
div.grid + div.grid {
  padding-top: 0;
}
</style>
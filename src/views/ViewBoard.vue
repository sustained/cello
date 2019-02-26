<template>
  <div id="board">
    <router-view></router-view>

    <div class="grid" v-for="(group) in groups" :key="'group-' + group.id">
      <list
        v-for="(list, listIndex) in listsForGroup(group.id)"
        :key="'list-' + list.id"
        :selected="isSelected(listIndex, group.id)"
        :list="list"
      >
        <!-- TODO: ^ Get rid of refs. -->
        <!-- NOTE: ^ group.lists was before "the changes" - cardsForList (vuex) -->
        <card v-for="card in cardsForList(list.id)" :key="'card-' + card.id" :card="card"></card>
      </list>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
import { mapState, mapGetters } from "vuex";

// import throttle from "lodash.throttle";

import List from "@/components/List.vue";
import Card from "@/components/Card.vue";

export default {
  components: { List, Card },

  data() {
    return {};
  },

  beforeDestroy() {
    // console.info("cleaning up event listeners");
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("mousewheel", this.handleMouseWheel);
  },

  async mounted() {
    // HACK: Not really sure what else to do, we need to reset the scroll position since at least Chrome
    // remembers the previous scroll position which looks kind of odd if you refresh the page.
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => window.scrollTo(0, 0), 100);
      });
    else window.scrollTo(0, 0);

    /*
    const randBetween = (minimum, maximum) =>
      Math.max(minimum, Math.floor(Math.random() * maximum));

    const randString = () =>
      Math.random()
        .toString(36)
        .slice(2);

    let currListId = 0;
    let currCardId = 0;

    for (let i = 0; i < 5; i++) {
      const group = { lists: [] };

      for (let j = 0, jm = randBetween(7, 15); j < jm; j++) {
        const list = {
          id: currListId++,
          title: randString(),
          cards: []
        };

        for (let k = 0, km = randBetween(5, 10); k < km; k++) {
          const card = {
            id: currCardId++,
            title: randString()
          };

          list.cards.push(card);
        }

        group.lists.push(list);
      }

      // console.log("setting group", group);
      Vue.set(this.groups, i, group);
    }
    */

    console.info("registering event listeners");
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
      "currentGroup"
    ]),
    ...mapGetters(["cardsForList", "listsForGroup"]),

    // overflows() {
    //   return document.body.scrollWidth > document.body.clientWidth;
    // },

    style() {
      return {
        // "grid-template-columns": `repeat(${this.board.lists.length}, 200px)`
      };
    }
  },

  methods: {
    isSelected(listIndex, groupId) {
      // NOTE: DB indexes start at 1 but we switched to using local state for the new navigation prototype thing.
      return (
        listIndex === this.currentList && groupId - 1 === this.currentGroup
      );
    },

    /*
      TODO: Move all navigation-related stuff to Vuex / remove refs.

      https://github.com/sustained/cello/issues/9

      We can store a mapping of groupId => listCount (needed for when we navigate up/down).
    */

    scrollLeft() {
      this.$store.dispatch("navigateLeft");
    },

    scrollRight() {
      this.$store.dispatch("navigateRight");
    },

    scrollDown() {
      this.$store.dispatch("navigateDown");
    },

    scrollUp() {
      this.$store.dispatch("navigateUp");
    },

    handleKeyDown(event) {
      // if (this.navigating) return;

      switch (event.keyCode) {
        case 65:
          this.scrollLeft();
          break;

        case 68:
          this.scrollRight();
          break;

        case 87:
          this.scrollUp();
          break;

        case 83:
          this.scrollDown();
          break;
      }
    }
    /*
    handleMouseWheel(event) {
      return throttle(() => {
        event.preventDefault();

        let current = this.$refs.lists[this.currentList];

        if (!current)
          return console.warn("couldn't find list " + this.currentList);

        if (event.deltaY < 0) this.currentList--;
        else if (event.deltaY > 0) this.currentList++;

        if (this.currentList < 0)
          this.currentList = this.$refs.lists.length - 1;
        else if (this.currentList > this.$refs.lists.length - 1)
          this.currentList = 0;

        this.scrollToCurrentList();
      }, 50);
    }
    */
  }
};
</script>

<style>
div#board,
div.grid {
  height: 100vh;
}

div.grid {
  display: flex;
  flex-direction: row;
  padding: 0.5em;
  /*
  display: grid;
  grid-gap: 1em;
  padding: 1em;
  */
}
</style>
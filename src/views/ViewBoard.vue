<template>
  <div id="board">
    <router-view></router-view>

    <div class="grid" v-for="(group, groupIndex) in groups" :key="groupIndex">
      <list
        v-for="(list, listIndex) in group.lists"
        :key="list.id"
        :selected="isSelected(listIndex, groupIndex)"
        :ref="`lists-${groupIndex}`"
      >
        <!-- TODO: ^ Get rid of refs. -->
        <!-- NOTE: ^ group.lists was before "the changes" - cardsForList (vuex) -->
        <card v-for="card in list.cards" :key="card.id" :card="card"></card>
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
      currentGroup: 0,
      currentList: 0,

      groups: []
    };
  },

  beforeDestroy() {
    console.info("cleaning up event listeners");
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("mousewheel", this.handleMouseWheel);
  },

  async mounted() {
    window.scrollTo(0, 0);

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

      console.log("setting group", group);
      Vue.set(this.groups, i, group);
    }

    console.info("registering event listeners");

    document.addEventListener("keydown", this.handleKeyDown);

    document.addEventListener("mousewheel", this.handleMouseWheel, {
      passive: true
    });

    if (this.$route.params.id)
      this.$store.dispatch("loadBoard", this.$route.params.id);
  },

  computed: {
    ...mapState(["board"]),
    ...mapGetters(["cardsForList"]),

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
    isSelected(listId, groupIndex) {
      // NOTE: DB indexes start at 1 but we switched to using local state for the new navigation prototype thing.
      return listId === this.currentList && groupIndex === this.currentGroup;
    },

    /*
      TODO: Move all navigation-related stuff to Vuex.

      We can store a mapping of groupId => listCount (needed for when we navigate up/down).
    */

    scrollLeft() {
      if (--this.currentList < 0)
        this.currentList = this.$refs["lists-" + this.currentGroup].length - 1;

      this.scrollToCurrentList();
    },

    scrollRight() {
      if (
        ++this.currentList >
        this.$refs["lists-" + this.currentGroup].length - 1
      )
        this.currentList = 0;

      this.scrollToCurrentList();
    },

    scrollDown() {
      let didWrap = false;

      // Bottom wraps back around to top.
      if (++this.currentGroup > this.groups.length - 1) {
        didWrap = true;
        this.currentGroup = 0;
      }

      // Select final list if we were scrolled further right in the previous group.
      if (
        this.currentList >
        this.$refs["lists-" + this.currentGroup].length - 1
      )
        this.currentList = this.$refs["lists-" + this.currentGroup].length - 1;

      this.scrollToCurrentList(didWrap);
    },

    scrollUp() {
      let didWrap = false;

      // Top wraps back around to top.
      if (--this.currentGroup < 0) {
        didWrap = true;
        this.currentGroup = this.groups.length - 1;
      }

      // Select final list if we were scrolled further right in the previous group.
      if (
        this.currentList >
        this.$refs["lists-" + this.currentGroup].length - 1
      )
        this.currentList = this.$refs["lists-" + this.currentGroup].length - 1;

      this.scrollToCurrentList(didWrap);
    },

    /* IDEA: We could intelligently handle the disableSmoothBehaviour thing.
      
      The scrolling with the smooth behaviour enabled with large numbers of groups 
      is extremely jarring (and may well be (one of) the cause(s) of the frame rate 
      drops from the performance test (mostly 60 FPS but the odd dip to ~10).

      We can probably make it so that if there are too many groups, then it will just 
      intelligently set behaviour to "auto".
    */
    scrollToCurrentList(disableSmoothBehaviour) {
      const lists = this.$refs["lists-" + this.currentGroup];

      if (!lists) return console.warn("no refs for group " + this.currentGroup);

      const component = lists[this.currentList];

      if (!component || !component.$el)
        return console.warn(
          "no component/el for group " + this.currentGroup,
          component,
          component.$el
        );

      const element = component.$el;

      element.scrollIntoView({
        behavior: disableSmoothBehaviour ? "auto" : "smooth", // TODO: Let user choose auto/smooth.
        inline: "center"
      });
    },

    handleKeyDown(event) {
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
    },

    handleMouseWheel(event) {
      /*
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
      */
    }
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
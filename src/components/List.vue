<template>
  <div
    ref="list"
    :class="['list', {selected}]"
    @click="selectThisList('single')"
    @dblclick="selectThisList('double')"
  >
    <div class="list-wrapper">
      <p>{{ list.title }}</p>

      <slot>
        <p style="margin: 20px 10px;">No cards!</p>
      </slot>
    </div>

    <div class="list-add-card" v-show="!options.hideBottomButtons">
      <router-link to="card/add" append>Add Card</router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  props: ["list", "row", "selected"],

  watch: {
    selected(selected) {
      this.selected = selected;

      if (selected) this.bringIntoView(false, false);
    }
  },

  computed: {
    ...mapState([
      "wrappedToTop",
      "wrappedToBottom",
      "currentGroup",
      "options",
      "lists"
    ]),

    ...mapGetters(["listsForGroup"])
  },

  methods: {
    /* IDEA: We could intelligently handle the disableSmoothBehaviour thing.
      
      The scrolling with the smooth behaviour enabled with large numbers of groups 
      is extremely jarring (and may well be (one of) the cause(s) of the frame rate 
      drops from the performance test (mostly 60 FPS but the odd dip to ~10).

      We can probably make it so that if there are too many groups, then it will just 
      intelligently set behaviour to "auto".
    */
    bringIntoView(disableObserver = false) {
      const list = this.$refs["list"];

      if (!list) return console.warn("no ref for list " + this.list.id);

      if (!disableObserver) this.createObserver(list);

      let behaviour;
      if (this.wrappedToTop || this.wrappedToBottom)
        behaviour = this.options.wrappingBehaviour.vertical;
      else behaviour = this.options.scrollBehaviour;

      // console.log("scrolling to element");
      list.scrollIntoView({ behavior: behaviour, inline: "center" });
    },

    createObserver(element) {
      // console.log("creating observer");
      let observer = new IntersectionObserver(
        entry => {
          let ratio = entry[0].intersectionRatio;

          // HACK: Workaround potential Chrome bug (or IntersectionObserver quirk).
          if (ratio >= 1.0) {
            observer.unobserve(element);
            this.$store.commit("SET_NAVIGATING", false);

            if (this.$store.state.wrappedToTop)
              this.$store.commit("SET_DID_WRAP_TO_TOP", false);

            if (this.$store.state.wrappedToBottom)
              this.$store.commit("SET_DID_WRAP_TO_BOTTOM", false);
          }
        },
        {
          root: document.getElementById("div#board"),
          threshold: [1.0]
        }
      );

      // console.log("observing element", element);
      observer.observe(element);
    },

    selectThisList(click) {
      const option = this.options.clickToSelectList;

      if (option === "none" || !(click === option)) return;

      const lists = this.listsForGroup(this.list.groupId);

      if (this.row !== this.currentGroup)
        this.$store.commit("SET_CURRENT_GROUP", this.row);

      this.$store.commit(
        "SET_CURRENT_LIST",
        lists.findIndex(list => list.id === this.list.id)
      );
    }
  }
};
</script>

<style scoped>
div.list-wrapper {
  overflow-x: hidden;
  overflow-y: auto;

  flex-grow: 1;
}

div.list-add-card {
  padding: 0.5em;
}

div.list {
  width: 222px;

  display: flex;
  flex-direction: column;

  background-color: rgba(255, 0, 0, 0.3);
}

div.list {
  border: 2px solid transparent;
  margin-right: 0.5em;
}
div.list:last-child {
  margin-right: 0;
}
div.list.selected {
  border: 2px solid black;
}

p {
  margin: 10px;
}
</style>
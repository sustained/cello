<template>
  <article
    ref="list"
    :class="['list', {selected}]"
    @click="selectThisList('single')"
    @dblclick="selectThisList('double')"
  >
    <header>
      <list-title :title="list.title" :parent="list.id" @editing-title="onEditingTitle"/>

      <!-- <nav>
        <ul>
          <li>
            <a href="#" @click="$emit('edit', list.id)">edit</a>
          </li>
        </ul>
      </nav>-->
    </header>

    <main>
      <slot>
        <p>No cards!</p>
      </slot>
    </main>

    <footer v-show=" ! options.hideBottomButtons">
      <ul>
        <li>
          <router-link to="card/add" append>Add Card</router-link>
        </li>
      </ul>
    </footer>
  </article>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import ListTitle from "./list/ListTitle.vue";

export default {
  props: ["list", "row", "selected"],

  components: { ListTitle },

  data() {
    return {
      isEditingTitle: false,
      editedTitle: ""
    };
  },

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

  mounted() {
    this.editedTitle = this.list.title;
  },

  methods: {
    editTitle(editing) {
      this.isEditingTitle = editing;
    },

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
      list.scrollIntoView({
        behavior: behaviour,
        inline: "center",
        block: "center"
      });
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

    selectThisList(click, mode) {
      const option = this.options.clickToSelectList;

      if (option === "none" || !(click === option)) return;

      this.select();
    },

    select() {
      const lists = this.listsForGroup(this.list.groupId);

      if (this.row !== this.currentGroup)
        this.$store.commit("SET_CURRENT_GROUP", this.row);

      this.$store.commit(
        "SET_CURRENT_LIST",
        lists.findIndex(list => list.id === this.list.id)
      );
    },

    onEditingTitle(editing) {
      if (editing) {
        this.select();
        this.$nextTick(() => {
          this.bringIntoView();
        });
      }
    }
  }
};
</script>

<style scoped>
article {
  width: 222px;

  display: flex;
  flex-direction: column;

  background-color: rgba(255, 0, 0, 0.3);

  border-radius: 4px;

  border: 2px solid transparent;
  margin-right: 0.5em;
}
article.selected {
  border: 2px solid rgba(0, 0, 0, 0.4);
}
article:last-child {
  margin-right: 0;
}

p {
  margin: 10px;
}

header {
  display: flex;
  width: 100%;
  padding: 4px;
  background-color: rgba(255, 255, 0, 0.5);
}
header div.edit-title {
  flex-grow: 1;
}

header nav ul {
  background-color: rgba(255, 0, 0, 0.5);
  list-style-type: none;
}

main {
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
}

footer {
  padding: 0.5em;
}
</style>
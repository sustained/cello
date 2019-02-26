<template>
  <div ref="list" :class="['list', {selected}]">
    <div class="list-wrapper">
      <p>{{ list.title }}</p>

      <slot>
        <p style="margin: 20px 10px;">No cards!</p>
      </slot>
    </div>

    <div class="list-add-card">
      <router-link to="card/add" append>Add Card</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list", "selected"],

  data() {
    return {
      refsSet: false
    };
  },

  watch: {
    selected(selected) {
      this.selected = selected;

      if (selected) this.bringIntoView(false, false);
    }
  },

  mounted() {},

  methods: {
    /* IDEA: We could intelligently handle the disableSmoothBehaviour thing.
      
      The scrolling with the smooth behaviour enabled with large numbers of groups 
      is extremely jarring (and may well be (one of) the cause(s) of the frame rate 
      drops from the performance test (mostly 60 FPS but the odd dip to ~10).

      We can probably make it so that if there are too many groups, then it will just 
      intelligently set behaviour to "auto".
    */
    bringIntoView(disableSmoothBehaviour, disableObserver = false) {
      const list = this.$refs["list"];

      if (!list) return console.warn("no ref for list " + this.list.id);

      if (!disableObserver) this.createObserver(list);

      // console.log("scrolling to element");
      list.scrollIntoView({
        behavior: disableSmoothBehaviour ? "auto" : "smooth", // TODO: Let user choose auto/smooth.
        inline: "center"
      });

      // setTimeout(() => {
      //   this.$store.commit("SET_NAVIGATING", false);
      // }, 1000);
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
          }
        },
        {
          root: document.getElementById("div#board"),
          threshold: [1.0]
        }
      );

      // console.log("observing element", element);
      observer.observe(element);
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
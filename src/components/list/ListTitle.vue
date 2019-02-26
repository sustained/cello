<template>
  <div class="edit-title">
    <h2 v-if=" ! isEditingTitle" @click="setEditingTitle(true)">{{ title }}</h2>

    <!-- <textarea v-model="title"></textarea> -->
    <c-input
      v-if=" isEditingTitle"
      @click="setEditingTitle(true)"
      @edited="onTitleEdit"
      :data="title"
    ></c-input>
  </div>
</template>

<script>
export default {
  props: ["title", "parent"],

  data() {
    return {
      editedTitle: "",
      isEditingTitle: false
    };
  },

  mounted() {
    this.editedTitle = this.title;
  },

  methods: {
    setEditingTitle(editing) {
      this.isEditingTitle = editing;

      if (editing) {
        this.$emit("editing-title", true);
      } else {
        this.$emit("editing-title", false);
      }
    },

    onTitleEdit(newTitle) {
      this.$store.dispatch("updateList", {
        id: this.parent,
        data: {
          title: newTitle
        }
      });
      this.setEditingTitle(false);
    }
  }
};
</script>

<style scoped>
input,
textarea {
  background-color: transparent;
  border: 0;
}

textarea {
  resize: none;
  min-height: 24px;
  max-height: 128px;
  padding: 4px;
  overflow-y: hidden;
}

input,
textarea,
h2 {
  font-size: 1em;
  padding: 0 4px;
  font-weight: normal;
}
</style>
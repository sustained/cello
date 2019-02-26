<template>
  <div v-show="boardIsEmpty">
    <p>Board is empty!</p>
    <p>Show guide/introduction?</p>
    <p>Offer to create a board from a template?</p>
    <p>Etc.</p>

    <ul>
      <li>
        <router-link to="create/group">Create Group</router-link>
      </li>
      <li>
        <router-link to="create/list">Create List</router-link>
      </li>
      <li>
        <router-link to="create/card" disabled>Create Card</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: mapGetters(["boardIsEmpty"])
};
</script>

<style scoped>
</style>
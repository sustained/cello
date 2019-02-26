import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import cello from "@/services/CelloService";

export default new Vuex.Store({
  state: {
    currentList: 0,
    currentGroup: 0,
    groupListCounts: [],
    isNavigating: false,
    scrollBehaviour: "smooth", // smooth | auto
    wrappedToTop: false,
    wrappedToBottom: false,

    loadingState: "unloaded",
    errorMessage: null,

    cards: [],
    lists: [],
    groups: [],
    // fields: [],
    // votes: [],

    boards: [],
    board: {
      lists: [],
      cards: []
    }
  },

  mutations: {
    SET_LOADING_STATE: (state, value) => (state.loadingState = value),
    SET_ERROR_MESSAGE: (state, value) => (state.errorMessage = value),
    SET_NAVIGATING: (state, value) => (state.isNavigating = value),

    SET_BOARD: (state, board) => (state.board = board),
    SET_BOARDS: (state, value) => (state.boards = value),

    SET_CARDS: (state, value) => (state.cards = value),
    SET_LISTS: (state, value) => (state.lists = value),
    SET_GROUPS: (state, value) => (state.groups = value),
    // SET_FIELDS: (state, value) => (state.fields = value),
    // SET_VOTES: (state, value) => (state.votes= value),

    SET_CURRENT_LIST: (state, index) => (state.currentList = index),
    SET_CURRENT_GROUP: (state, index) => (state.currentGroup = index),
    SET_GROUP_LIST_COUNTS: (state, value) => (state.groupListCounts = value),

    SET_DID_WRAP_TO_TOP: (state, value) => (state.wrappedToTop = value),
    SET_DID_WRAP_TO_BOTTOM: (state, value) => (state.wrappedToBottom = value)
  },

  actions: {
    navigateLeft({ commit, state }) {
      if (state.isNavigating) return;
      commit("SET_NAVIGATING", true);

      if (state.currentList - 1 < 0) commit("SET_CURRENT_LIST", state.groupListCounts[state.currentGroup] - 1);
      else commit("SET_CURRENT_LIST", state.currentList - 1);
    },

    navigateRight({ commit, state }) {
      if (state.isNavigating) return;
      commit("SET_NAVIGATING", true);

      if (state.currentList + 1 > state.groupListCounts[state.currentGroup] - 1) commit("SET_CURRENT_LIST", 0);
      else commit("SET_CURRENT_LIST", state.currentList + 1);
    },

    navigateUp({ commit, getters, state }) {
      if (state.isNavigating) return;
      commit("SET_NAVIGATING", true);

      // Top wraps back around to bottom.
      if (state.currentGroup - 1 < 0) {
        commit("SET_DID_WRAP_TO_BOTTOM", true);
        // setTimeout(() => commit("SET_DID_WRAP_TO_BOTTOM", false), 500);
        commit("SET_CURRENT_GROUP", state.groups.length - 1);
      } else {
        commit("SET_CURRENT_GROUP", state.currentGroup - 1);
      }

      // Select final list if we were scrolled further right in the previous group than this group allows for.
      if (state.currentList > getters.listCountsForGroup(state.currentGroup) - 1)
        commit("SET_CURRENT_LIST", getters.listCountsForGroup(state.currentGroup) - 1);
    },

    navigateDown({ commit, getters, state }) {
      if (state.isNavigating) return;
      commit("SET_NAVIGATING", true);

      // Bottom wraps back around to top.
      if (state.currentGroup + 1 > state.groups.length - 1) {
        commit("SET_DID_WRAP_TO_TOP", true);
        // setTimeout(() => commit("SET_DID_WRAP_TO_TOP", false), 500);
        commit("SET_CURRENT_GROUP", 0);
      } else {
        commit("SET_CURRENT_GROUP", state.currentGroup + 1);
      }

      // Select final list if we were scrolled further right in the previous group than this group allows for.
      if (state.currentList > getters.listCountsForGroup(state.currentGroup) - 1)
        commit("SET_CURRENT_LIST", getters.listCountsForGroup(state.currentGroup) - 1);
    },

    loadBoards({ commit }) {
      return cello.getBoards().then(boards => {
        commit("SET_BOARDS", boards.data);
      });
    },

    loadBoard({ commit, state }, id) {
      commit("SET_LOADING_STATE", "loading");

      return cello
        .getBoard(id, ["cards", "lists", "fields", "votes", "groups"])
        .then(response => {
          commit("SET_CARDS", response.data.cards);
          commit("SET_LISTS", response.data.lists);
          commit("SET_GROUPS", response.data.groups);

          const groupListCounts = [];
          for (let i = 0; i < state.groups.length; i++) {
            groupListCounts[i] = state.lists.filter(list => list.groupId === state.groups[i].id).length;
          }

          commit("SET_GROUP_LIST_COUNTS", groupListCounts);
          commit("SET_LOADING_STATE", "loaded");
        })
        .catch(error => {
          commit("SET_LOADING_STATE", "errored");
          commit("SET_ERROR_MESSAGE", error.message);
        });
    }
  },

  getters: {
    cardsForList(state) {
      return listId => state.cards.filter(card => card.listId === listId);
    },

    listsForGroup(state) {
      return groupId =>
        state.lists.filter(list => {
          return list.groupId === groupId;
        });
    },

    listCountsForGroup(state) {
      return groupId => state.groupListCounts[groupId];
    }
  }
});

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import cello from "@/services/CelloService";

export default new Vuex.Store({
  state: {
    boards: [],
    board: {
      lists: [],
      cards: []
    }
  },

  mutations: {
    SET_BOARD: (state, board) => (state.board = board),
    SET_BOARDS: (state, boards) => (state.boards = boards)
  },

  actions: {
    loadBoards({ commit }) {
      return cello.getBoards().then(boards => {
        commit("SET_BOARDS", boards.data);
      });
    },

    loadBoard({ commit }, id) {
      return cello.getBoard(id, ["cards", "lists", "fields", "votes"]).then(response => {
        commit("SET_BOARD", response.data);
      });
    }
  },

  getters: {
    cardsForList(state) {
      return listId => state.board.cards.filter(card => card.listId === listId);
    }
  }
});

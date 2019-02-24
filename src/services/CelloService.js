import API from "@/api";

const api = API();

export default {
  /*
      Request all boards.
    */
  getBoards() {
    return api.get("/boards");
  },

  /*
      Request a specific board, optionally with lists.
    */
  getBoard(id, embed = []) {
    let url = `/boards/${id}`;

    if (embed.length) url += "?" + embed.map(i => `_embed=${i}`).join("&");

    console.log(url);

    return api.get(url);
  },

  /*
      Request all lists belonged to a specific boardId or 
      request all lists (with optional embeded cards).
    */
  getLists(params, withCards = false) {
    if (params.boardId) return api.get(`/lists?boardId=${params.boardId}`);

    return withCards ? api.get("/lists?_embed=cards") : api.get("/lists");
  },

  /*
      Request a specific card.
    */
  getCard(params) {
    return api.get(`/cards/${params.id}?include=fields&include=votes`);
  },

  getCards(params) {
    if (params.listId) return api.get(`/cards?listId=${params.listId}`);

    return api.get(`/cards`);
  }
};

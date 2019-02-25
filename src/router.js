import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ViewBoard from "./views/ViewBoard.vue";
import ViewCard from "./views/ViewCard.vue";
import AddCard from "./views/AddCard.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/boards/:id",
      name: "board",
      component: ViewBoard,
      children: [
        {
          path: "card/add",
          component: AddCard
        },
        {
          path: "card/:card",
          component: ViewCard
        }
      ]
    }
  ]
});

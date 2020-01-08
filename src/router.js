import Vue from "vue";
import Router from "vue-router";
import Hosts from "./components/Hosts.vue";
import Program from "./components/Program.vue"
import Shopping from "./components/Shopping.vue"
import Amount from "./components/Amount.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/shopping"
    },
    {
      path: "/hosts",
      name: "hosts",
      component: Hosts
    },
    {
      path: "/program",
      name: "program",
      component: Program
    },
    {
      path: "/shopping",
      name: "shopping",
      component: Shopping
    },
    {
      path: "/amount",
      name: "amount",
      component: Amount
    }
  ]
});
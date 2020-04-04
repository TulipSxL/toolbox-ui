import Vue from "vue";
import Router from "vue-router";
import Hosts from "./components/Hosts.vue";
import Program from "./components/Program.vue"
import Shopping from "./components/Shopping.vue"
import Amount from "./components/Amount.vue"
import Record from "./components/record/Record.vue"
import RecordRank from "./components/record/RecordRank.vue"
import HsHero from "./components/HsHero.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/hs/record"
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
    },
    {
      path: "/hs/record",
      name: "record",
      component: Record
    },
    {
      path: "/hs/hero",
      name: "hero",
      component: HsHero
    },
    {
      path: "/record/rank",
      name: "recordRank",
      component: RecordRank
    }
  ]
});
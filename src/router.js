/*
 * @Author: SxL
 * @Date: 2020-04-03 21:16:47
 * @LastEditTime: 2020-04-23 14:42:53
 * @Description: vue router
 * @FilePath: /toolbox-ui/src/router.js
 */
import Vue from "vue";
import Router from "vue-router";
import Record from "./components/hs/Record.vue"
import RecordRank from "./components/hs/RecordRank.vue"
import HsHero from "./components/hs/HsHero.vue"
import UrlEncodeDecode from "./components/tool/Url.vue"
import GuidGenerator from "./components/tool/Guid.vue"
import Penguin from "./components/video_website/Penguin.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/hs/record"
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
    },
    {
      path: "/tool/url",
      name: "urlEncodeDecode",
      component: UrlEncodeDecode
    },
    {
      path: "/tool/guid",
      name: "guidGenerator",
      component: GuidGenerator
    },
    {
      path: "/va",
      name: "penguin",
      component: Penguin
    }
  ]
});
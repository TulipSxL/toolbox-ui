<!--
 * @Author: SxL
 * @Date: 2020-04-08 15:43:06
 * @LastEditTime: 2020-04-23 14:40:55
 * @Description: tx video address
 * @FilePath: /toolbox-ui/src/components/video_website/Penguin.vue
 -->
<template>
  <div>
    <b-jumbotron header="调试">
      <hr class="my-4" />
      <b-button variant="primary" @click="analyse()">调试</b-button>
      <div class="pt-3">
        <b-form-textarea
          id="debug-info"
          v-model="debugInfoStr"
          placeholder="请输入调试信息"
          rows="4"
          @click="copyText($event)"
        ></b-form-textarea>
      </div>
    </b-jumbotron>

    <!-- result -->
    <div class="pl-3 pr-3">
      <b-form-textarea v-model="decodeUrl" plaintext rows="3"></b-form-textarea>
      <b-alert
        fade
        class="pt-3"
        :show="copySuccess"
        dismissible
        variant="success"
        @dismissed="copySuccess = 0"
        @dismiss-count-down="countDownChanged($event)"
      >调试成功，已复制到剪贴板。 {{ copySuccess }} 秒后关闭。</b-alert>
      <b-alert
        fade
        class="pt-3"
        :show="copyFailed"
        dismissible
        variant="danger"
        @dismissed="copyFailed = 0"
        @dismiss-count-down="countDownChanged($event)"
      >调试成功，复制到剪贴板失败，请手动复制。 {{ copyFailed }} 秒后关闭。</b-alert>
    </div>
  </div>
</template>
<script>
const axios = require("axios");
const DECODE_URL = "/api/url/decode";

export default {
  data() {
    return {
      decodeUrl: "",
      debugInfoStr: "",
      dismissSecs: 5,
      copySuccess: 0,
      copyFailed: 0
    };
  },
  methods: {
    async analyse() {
      let debugInfo = JSON.parse(this.debugInfoStr);
      let vurl = debugInfo.vurl;

      await axios.get(DECODE_URL + "?url=" + vurl).then(({ data }) => {
        this.decodeUrl = data;
      });

      this.$copyText(this.decodeUrl).then(
        () => {
          this.copySuccess = this.dismissSecs;
        },
        () => {
          this.copyFailed = this.dismissSecs;
        }
      );
    },
    countDownChanged(seconds) {
      if (this.copySuccess != 0) {
        this.copySuccess = seconds;
      }

      if (this.copyFailed != 0) {
        this.copyFailed = seconds;
      }
    }
  }
};
</script>
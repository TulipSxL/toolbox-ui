<!--
 * @Author: SxL
 * @Date: 2020-04-08 00:17:33
 * @LastEditTime: 2020-04-23 14:43:20
 * @Description: Generate GUID
 * @FilePath: /toolbox-ui/src/components/tool/Guid.vue
 -->
<!--
 * @Author: SxL
 * @Date: 2020-04-07 19:12:18
 * @LastEditTime: 2020-04-08 00:16:07
 * @Description: Url encode & decode
 * @FilePath: /toolbox-ui/src/components/tool/Url.vue
 -->
<template>
  <div>
    <b-jumbotron header="GUID 生成器" id="jumbotron">
      <hr class="my-4" />
      <b-button variant="primary" @click="generate()">生成</b-button>
      <div v-show="guid.length != 0" class="pt-5">
        <b-form-input id="guid_input" v-model="guid" plaintext class="pl-4"></b-form-input>
        <b-alert
          fade
          class="pt-3"
          :show="copySuccess"
          dismissible
          variant="success"
          @dismissed="copySuccess = 0"
          @dismiss-count-down="countDownChanged($event)"
        >GUID 生成成功，已复制到剪贴板。 {{ copySuccess }} 秒后关闭。</b-alert>
        <b-alert
          fade
          class="pt-3"
          :show="copyFailed"
          dismissible
          variant="danger"
          @dismissed="copyFailed = 0"
          @dismiss-count-down="countDownChanged($event)"
        >GUID 生成成功，复制到剪贴板失败，请手动复制。 {{ copyFailed }} 秒后关闭。</b-alert>
      </div>
    </b-jumbotron>
  </div>
</template>
<script>
const axios = require("axios");
const BASE_URL = "/api/tool/guid";

export default {
  data() {
    return {
      guid: "",
      dismissSecs: 5,
      copySuccess: 0,
      copyFailed: 0
    };
  },
  methods: {
    async generate() {
      await axios.get(BASE_URL).then(({ data }) => {
        this.guid = data;
      });

      this.$copyText(this.guid).then(
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
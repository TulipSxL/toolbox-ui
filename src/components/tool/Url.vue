<!--
 * @Author: SxL
 * @Date: 2020-04-07 19:12:18
 * @LastEditTime: 2020-04-23 14:43:30
 * @Description: Url encode & decode
 * @FilePath: /toolbox-ui/src/components/tool/Url.vue
 -->
<template>
  <div>
    <b-jumbotron header="URL 编码转换"></b-jumbotron>
    <b-container fluid class="text-center">
      <b-row>
        <b-col>
          <b-form-textarea
            id="decode-url"
            v-model="decodeUrl"
            placeholder="请输入原始 URL"
            rows="4"
          ></b-form-textarea>
        </b-col>
        <b-col md="auto">
          <b-button-group vertical class="pt-3">
            <b-button @click="encode()" variant="primary">
              转码
              <b-icon-arrow-right></b-icon-arrow-right>
            </b-button>
            <b-button @click="decode()" variant="success">
              <b-icon-arrow-left></b-icon-arrow-left>解码
            </b-button>
          </b-button-group>
        </b-col>
        <b-col>
          <b-form-textarea
            id="encode-url"
            v-model="encodeUrl"
            placeholder="请输入转码 URL"
            rows="4"
          ></b-form-textarea>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
const axios = require("axios");
const ENCODE_URL = "/api/tool/url/encode";
const DECODE_URL = "/api/tool/url/decode";

export default {
  data() {
    return {
      decodeUrl: "",
      encodeUrl: ""
    };
  },
  methods: {
    async encode() {
      await axios.get(ENCODE_URL + "?url=" + this.decodeUrl).then(({ data }) => {
        this.encodeUrl = data;
      });

      this.$copyText(this.encodeUrl);
    },
    async decode() {
      await axios.get(DECODE_URL + "?url=" + this.encodeUrl).then(({ data }) => {
        this.decodeUrl = data;
      });

      this.$copyText(this.decodeUrl);
    }
  }
};
</script>
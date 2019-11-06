<template>
  <div>
    <div>
      <navbar />
      <router-view />
    </div>
    <div>
      <div style="height: 50px"></div>
      <b-navbar type="dark" variant="info" fixed="bottom">
        <b-navbar-nav small>
          <b-navbar-item>津ICP备19009474号 Copyright © 2019 SxL. All Rights Reserved.</b-navbar-item>
        </b-navbar-nav>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
export default {
  components: {
    Navbar
  },
  mounted() {
    window.document.title = this.$t("message.title");
  }
};
</script>

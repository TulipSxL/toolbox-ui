<template>
  <div>
    <navbar/>
    <router-view />
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

<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">{{ $t('message.title') }}</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item
            v-for="title in navBarItem"
            :key="title.id"
            :class="{active : activeName.match(title)}"
            :href="'#/' + title"
            @click="active(title)"
          >{{ $t("message.navbar.item." + title) }}</b-nav-item>

          <b-nav-item-dropdown
            v-for="title in navBarItemDropdown"
            :key="title.id"
            :text="$t('message.navbar.item.' + title.name)"
            :class="{active : activeName.match(title.name)}"
          >
            <b-dropdown-item
              v-for="item in title.list"
              :key="item.id"
              :href="'#/' + title.prefix +  item"
              @click="activeFather(item)"
            >{{ $t('message.navbar.dropdown.' + item) }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text="$t('message.navbar.item.language')" right>
            <b-dropdown-item @click="changeLocale('zh_CN')">{{ $t('message.lang.cn') }}</b-dropdown-item>
            <b-dropdown-item @click="changeLocale('en_US')">{{ $t('message.lang.us') }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: this.$route.path,
      navBarItem: ["shopping"],
      navBarItemDropdown: [
        {
          name: "host",
          list: ["hosts", "program"],
          prefix: ""
        },
        {
          name: "consumption",
          list: ["amount", "consumeLog"],
          prefix: ""
        },
        {
          name: "hearthStone",
          list: ["record", "hero"],
          prefix: "hs/"
        }
      ]
    };
  },
  methods: {
    active(name) {
      this.activeName = name;
    },
    activeFather(name) {
      this.navBarItemDropdown.forEach(title => {
        title.list.forEach(item => {
          if (item == name || title.prefix + item == name) {
            this.active(title.name);
            return;
          }
        });
      });
    },
    changeLocale(locale) {
      this.$i18n.locale = locale;
      window.document.title = this.$t("message.title");
    }
  },
  mounted() {
    this.activeFather(this.$route.path.replace("/", ""));
  }
};
</script>

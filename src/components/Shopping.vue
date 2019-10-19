<template>
  <div>
    <!-- tool bar -->
    <div>
      <b-input-group class="m-2">
        <b-input-group-prepend>
          <b-dropdown
            :text="thing.categoryId == '' ? 
            $t('message.shopping.input.dropdown.category') :
            category.name"
            :variant="isSearch ? category.variant : 'info'"
            :disabled="isSearch"
          >
            <b-dropdown-item
              v-for="item in categoryList"
              :key="item.id"
              @click="changeCategory(item, false)"
            >{{ item.name }}</b-dropdown-item>
          </b-dropdown>
        </b-input-group-prepend>

        <b-form-input v-model="thing.name"></b-form-input>

        <b-input-group-append>
          <b-button-group style="width: 10em">
            <b-button
              text="Button"
              variant="primary"
              @click="addThing()"
              :disabled="isSendRequest"
            >{{ $t("message.shopping.input.button.add") }}</b-button>
            <b-button
              text="Button"
              class="mr-3"
              variant="warning"
              @click="search()"
              :disabled="canSearch || isSendRequest"
            >{{ $t("message.shopping.input.button.search") }}</b-button>
          </b-button-group>
        </b-input-group-append>
      </b-input-group>
    </div>

    <!-- show -->
    <div>
      <b-card-group columns class="m-2">
        <b-card
          no-body
          v-for="item in all"
          :key="item.id"
          :bg-variant="item.category.variant"
          text-variant="white"
        >
          <b-card-header class="text-center">{{ item.category.name }}</b-card-header>
          <b-list-group flush>
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
              v-for="thing in item.things"
              :key="thing.id"
              :variant="item.category.variant"
            >
              {{ thing.name }}
              <div>
                <b-badge
                  class="ml-1"
                  :disabled="isSendRequest"
                  v-for="category in categoryList"
                  :key="category.id"
                  :variant="category.variant"
                  href="#/shopping"
                  @click="changeCategory({
                    thing: thing,
                    category: category
                  }, true)"
                  pill
                  v-show="category.name != item.category.name"
                >+</b-badge>
                <b-badge
                  :disabled="isSendRequest"
                  variant="warning"
                  href="#/shopping"
                  @click="deleteThing(thing)"
                  pill
                >x</b-badge>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const BASE_URL_THING = "/api/thing";
const BASE_URL_THING_SLASH = "/api/thing/";
const BASE_URL_CATEGORY = "/api/category";
const BASE_URL_CATEGORY_SLASH = "/api/category/";
export default {
  data() {
    return {
      all: [],
      categoryList: [],
      thing: {
        categoryId: "",
        name: ""
      },
      isSearch: false,
      category: {},
      isSendRequest: false
    };
  },
  methods: {
    changeCategory(item, api) {
      if (api) {
        this.isSendRequest = true;
        this.thing.id = item.thing.id;
        this.thing.name = item.thing.name;
        this.thing.categoryId = item.category.id;

        axios.put(BASE_URL_THING, this.thing).then(() => {
          document.location.reload();
        });
      } else {
        this.thing.categoryId = item.id;
        this.category = item;
      }
    },
    getThings(item) {
      axios
        .get(BASE_URL_THING + "/category/" + item.category.name)
        .then(({ data }) => {
          item.things = data;
        });
    },
    addThing() {
      this.isSendRequest = true;
      axios.post(BASE_URL_THING, this.thing).then(data => {
        document.location.reload();
      });
    },
    search() {
      this.isSearch = true;
      this.isSendRequest = true;

      axios.get(BASE_URL_THING_SLASH + this.thing.name).then(({ data }) => {
        this.category = data.category;
        this.thing.categoryId = data.category.id;
        this.isSendRequest = false;
      });
    },
    async getCategory() {
      await axios.get(BASE_URL_CATEGORY).then(({ data }) => {
        this.categoryList = data;
      });
    },
    deleteThing(thing) {
      this.isSendRequest = true;

      axios.delete(BASE_URL_THING_SLASH + thing.id).then(() => {
        document.location.reload();
      });
    }
  },
  async mounted() {
    await this.getCategory();

    this.categoryList.forEach(category => {
      this.all.push({
        category: category,
        things: []
      });
    });

    this.all.forEach(item => {
      this.getThings(item);
    });
  },
  computed: {
    canSearch() {
      return this.thing.name.length <= 0;
    }
  }
};
</script>

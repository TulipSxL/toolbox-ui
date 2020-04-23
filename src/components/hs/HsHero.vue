<template>
  <div>
    <!-- Show All -->
    <div>
      <b-jumbotron header="战棋英雄">
        <hr class="my-4" />
        <b-button variant="primary" v-b-modal.add-new-hero>添加新英雄</b-button>
        <b-button variant="info" @click="changeHeroState()">上/下线</b-button>
      </b-jumbotron>
    </div>

    <div>
      <b-table
        striped
        selectable
        select-mode="multi"
        hover
        :items="all"
        :fields="fields"
        @row-selected="onRowSelected"
      >
        <template v-slot:cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </b-table>
    </div>

    <!-- Add New Hero -->
    <div>
      <b-modal id="add-new-hero" title="添加新英雄" @ok="addNewHero()">
        <label for="name">英雄名称:</label>
        <b-form-input id="name" v-model="newHero.name" placeholder="请输入名称"></b-form-input>
      </b-modal>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const BASE_URL = "/api/hs_hero";
const BASE_URL_SLASH = "/api/hs_hero/";

export default {
  data() {
    return {
      newHero: {
        name: null,
        state: true
      },
      selected: [],
      all: [],
      fields: [
        {
          key: "selected",
          label: "选中状态"
        },
        {
          key: "name",
          label: "名称"
        },
        {
          key: "state",
          label: "是否上线"
        }
      ]
    };
  },
  methods: {
    onRowSelected(items) {
      this.selected = items;
    },
    changeHeroState() {
      this.selected.forEach(async item => {
        await axios.put(BASE_URL_SLASH + item.id);
      });

      document.location.reload();
    },
    getAllHeroes() {
      axios.get(BASE_URL).then(({ data }) => {
        this.all = data;
      });
    },
    addNewHero() {
      axios.post(BASE_URL, this.newHero).then(() => {
        document.location.reload();
      })
    }
  },
  mounted() {
    this.getAllHeroes();
  }
};
</script>
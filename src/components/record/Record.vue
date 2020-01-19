<template>
  <div>
    <!-- Modal -->
    <div>
      <b-jumbotron header="炉石战棋" :lead="'分数：' + currentScore + '\t最高分：' + highestScore">
        <hr class="my-4" />
        <b-button variant="primary" v-b-modal.add-new-record>开搞</b-button>
        <b-button variant="primary" v-b-modal.search>查询</b-button>
        <b-button variant="primary" @click="clear()">清除</b-button>
        <b-button variant="primary" href="#/record/rank">排名</b-button>
      </b-jumbotron>
    </div>

    <!-- Datas -->
    <div>
      <b-card-group columns>
        <b-card no-body v-for="item in all" :key="item.id">
          <b-card-header class="d-flex justify-content-between align-items-center">
            <div>
              {{ item.date }}
              <b-badge
                :variant="item.changedScore >= 0 ? 'success' : 'danger'"
              >{{ item.changedScore >= 0 ? '+' + item.changedScore : item.changedScore }}</b-badge>
            </div>
            <div>
              <b-badge :disabled="isSendRequest" variant="primary" pill v-b-modal.add-new-record>+</b-badge>
              <b-badge :disabled="isSendRequest" variant="secondary" pill v-b-modal.edit-record>≡</b-badge>
              <b-badge
                :disabled="isSendRequest"
                variant="danger"
                pill
                href="#/record"
                @click="deleteRecord()"
              >x</b-badge>
            </div>
          </b-card-header>
          <b-table
            striped
            selectable
            select-mode="single"
            hover
            :items="item.records"
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
        </b-card>
      </b-card-group>
    </div>

    <!-- Add New Record -->
    <div>
      <b-modal id="add-new-record" title="添加新战绩" @ok="addNewRecord()">
        <label for="add-name">英雄名称:</label>
        <b-form-select id="add-name" v-model="newRecord.name" :options="heroes" class="mb-3">
          <template v-slot:first>
            <option :value="null" disabled>请选择你的英雄</option>
          </template>
        </b-form-select>
        <label for="add-rank">本场排名:</label>
        <b-form-input
          id="add-rank"
          type="number"
          v-model="newRecord.rank"
          :state="validate(newRecord.rank, ['NOT_NULL', 'RANGE'], [1, 8])"
          aria-describedby="add-rank-feedback"
          placeholder="请输入本场排名"
          trimadd
        ></b-form-input>
        <b-form-invalid-feedback id="add-rank-feedback">排名不能为空且只能为1～8的数字</b-form-invalid-feedback>
        <label for="add-increment">加减分数:</label>
        <b-form-input
          id="add-increment"
          type="number"
          v-model="newRecord.increment"
          :state="validate(newRecord.increment, ['NOT_NULL'])"
          aria-describedby="add-increment-feedback"
          placeholder="请输入分数变动"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="add-increment-feedback">加减分数不能为空且只能为数字</b-form-invalid-feedback>
        <label for="add-score">当前分数:</label>
        <b-form-input
          id="add-score"
          type="number"
          v-model="newRecord.score"
          :state="validate(newRecord.score, ['NOT_NULL'])"
          aria-describedby="add-score-feedback"
          placeholder="请输入当前分数"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="add-score-feedback">当前分数不能为空且只能为数字</b-form-invalid-feedback>
        <label for="add-time">时间:</label>
        <b-form-input
          id="add-time"
          v-model="newRecord.time"
          :state="validate(newRecord.time, ['NOT_NULL', 'TIME'])"
          aria-describedby="add-time-feedback"
          placeholder="请输入时间"
          trimedit
        ></b-form-input>
        <b-form-invalid-feedback id="add-time-feedback">时间不能为空且格式为HH:mm:SS</b-form-invalid-feedback>
      </b-modal>
    </div>

    <!-- Edit Record -->
    <div>
      <b-modal id="edit-record" title="编辑战绩" @ok="editRecord()">
        <label for="edit-name">英雄名称:</label>
        <b-form-select id="edit-name" v-model="selected.name" :options="heroes" class="mb-3">
          <template v-slot:first>
            <option :value="null" disabled>请选择你的英雄</option>
          </template>
        </b-form-select>
        <label for="edit-rank">本场排名:</label>
        <b-form-input
          id="edit-rank"
          type="number"
          v-model="selected.rank"
          :state="validate(selected.rank, ['NOT_NULL', 'RANGE'], [1, 8])"
          aria-describedby="edit-rank-feedback"
          placeholder="请输入本场排名"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="edit-rank-feedback">排名不能为空且只能为1～8的数字</b-form-invalid-feedback>
        <label for="edit-increment">加减分数:</label>
        <b-form-input
          id="edit-increment"
          type="number"
          v-model="selected.increment"
          :state="validate(selected.increment, ['NOT_NULL'])"
          aria-describedby="edit-increment-feedback"
          placeholder="请输入分数变动"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="edit-increment-feedback">加减分数不能为空且只能为数字</b-form-invalid-feedback>
        <label for="edit-score">当前分数:</label>
        <b-form-input
          id="edit-score"
          type="number"
          v-model="selected.score"
          :state="validate(selected.score, ['NOT_NULL'])"
          aria-describedby="edit-score-feedback"
          placeholder="请输入当前分数"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="edit-score-feedback">当前分数不能为空且只能为数字</b-form-invalid-feedback>
        <label for="edit-time">时间:</label>
        <b-form-input
          id="edit-time"
          v-model="selected.time"
          :state="validate(selected.time, ['NOT_NULL', 'TIME'])"
          aria-describedby="edit-time-feedback"
          placeholder="请输入时间"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="input-time-feedback">时间不能为空且格式为HH:mm:SS</b-form-invalid-feedback>
      </b-modal>
    </div>

    <!-- Search Record -->
    <div>
      <b-modal id="search" title="搜索" @ok="searchRecord()">
        <label for="search-name">英雄名称:</label>
        <b-form-select id="search-name" v-model="search.name" :options="heroes" class="mb-3">
          <template v-slot:first>
            <option :value="null" disabled>请选择你的英雄</option>
          </template>
        </b-form-select>
        <label for="search-begin-date">开始日期:</label>
        <b-form-input
          id="search-begin-date"
          type="date"
          v-model="search.beginDate"
          placeholder="请输入开始日期"
          trim
        ></b-form-input>
        <label for="search-begin-date">结束日期:</label>
        <b-form-input
          id="search-end-date"
          type="date"
          v-model="search.endDate"
          :state="validate(search.endDate, ['GE_BEGIN'], [search.beginDate])"
          aria-describedby="search-end-date"
          placeholder="请输入结束日期"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="search-end-date">结束日期不能小于开始日期</b-form-invalid-feedback>
      </b-modal>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const BASE_URL_HERO = "/api/hs_hero";
const BASE_URL_RECORD = "/api/hs_record";
const BASE_URL_RECORD_SLASH = "/api/hs_record/";
export default {
  data() {
    return {
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
          key: "rank",
          label: "排名"
        },
        {
          key: "increment",
          label: "分数变动"
        },
        {
          key: "score",
          label: "当前分数"
        },
        {
          key: "time",
          label: "时间"
        }
      ],
      currentScore: 0,
      highestScore: 0,
      selected: {},
      heroes: [],
      newRecord: {
        name: null
      },
      isSendRequest: false,
      search: {
        name: null
      }
    };
  },
  methods: {
    onRowSelected(items) {
      this.selected = items[0];
    },
    validate(value, ruler, range) {
      let validate = false;
      ruler.forEach(item => {
        if (item == "NOT_NULL") {
          validate = value !== null && value !== undefined;
        }

        if (item == "TIME") {
          const onlyTime = new RegExp(
            "^(([0-2][0-3])|([0-1][0-9])):[0-5][0-9]:[0-5][0-9]$"
          );
          validate = onlyTime.test(value);
        }

        if (item == "RANGE") {
          validate = value >= range[0] && value <= range[1];
        }

        if (item == "GE_BEGIN") {
          if (
            range[0] !== null &&
            range[0] !== undefined &&
            value !== null &&
            value !== undefined
          ) {
            validate =
              new Date(value).getTime() >= new Date(range[0]).getTime();
          } else {
            validate = true;
          }
        }
      });

      return validate;
    },
    addNewRecord() {
      this.isSendRequest = true;
      axios.post(BASE_URL_RECORD, this.newRecord).then(() => {
        document.location.reload();
      });
    },
    editRecord() {
      this.isSendRequest = true;
      axios.put(BASE_URL_RECORD, this.selected).then(() => {
        document.location.reload();
      });
    },
    deleteRecord() {
      this.isSendRequest = true;
      axios.delete(BASE_URL_RECORD_SLASH + this.selected.id).then(() => {
        document.location.reload();
      });
    },
    getAllHero() {
      axios.get(BASE_URL_HERO).then(({ data }) => {
        this.heroes = data;
      });
    },
    async getAllRecord() {
      await axios.get(BASE_URL_RECORD).then(({ data }) => {
        this.all = data;
      });
    },
    searchRecord() {
      let queryUrl = BASE_URL_RECORD;

      if (this.search.name != null) {
        queryUrl += "?name=" + this.search.name;
      }

      if (this.search.beginDate != undefined) {
        queryUrl += "?beginDate=" + this.search.beginDate;
      }

      if (this.search.endDate != undefined) {
        queryUrl += "?endDate=" + this.search.endDate;
      }

      axios.get(queryUrl).then(({ data }) => {
        this.all = data;
      });
    },
    clear() {
      document.location.reload();
    }
  },
  computed: {},
  async mounted() {
    this.getAllHero();
    await this.getAllRecord();

    this.currentScore = this.all[0].records[0].score;
    this.highestScore = this.all[0].highestScore;
  },
  watch: {
    "newRecord.increment": function() {
      this.newRecord.score =
        Number(this.currentScore) + Number(this.newRecord.increment);

      let now = new Date();
      this.newRecord.time =
        now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    }
  }
};
</script>
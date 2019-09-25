<template>
  <div>
    <!-- show all programs -->
    <div>
      <b-card-group columns v-show="show" class="mt-2">
        <b-card no-body v-for="item in programList" :key="item.program.id">
          <b-card-header class="d-flex justify-content-between align-items-center">
            {{ item.program.name }}
            <div>
              <b-badge variant="success" href="#/program" @click="addProgramReady()" pill>+</b-badge>
              <b-badge variant="info" href="#/program" @click="editProgramReady(item)" pill>≡</b-badge>
              <b-badge variant="danger" href="#/program" @click="deleteProgram(item.program)" pill>x</b-badge>
            </div>
          </b-card-header>
          <b-list-group flush>
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
              v-for="host in item.hostList"
              :key="host.id"
            >
              {{host.name}}
              <b-badge variant="primary" pill>{{host.ip}}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-card-group>
    </div>

    <!-- edit host -->
    <div v-if="edit" class="mt-3">
      <b-card-group deck class="m-auto" style="max-width: 40rem">
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            {{ $t('message.card.program.header.edit') }}
            <div>
              <b-badge variant="success" href="#/program" @click="editProgram()" pill>✓</b-badge>
              <b-badge variant="danger" href="#/program" @click="cancel()" pill>⤺</b-badge>
            </div>
          </b-card-header>

          <b-card-body>
            <b-input-group class="mb-3" :prepend="$t('message.program.name.title')">
              <b-form-input
                id="edit-program-name"
                :placeholder="$t('message.program.name.placeHolder')"
                v-model="program.name"
                :state="checkName"
              ></b-form-input>
              <b-form-invalid-feedback
                id="edit-program-name-feedback"
              >{{ $t('message.program.name.feedback') }}</b-form-invalid-feedback>
            </b-input-group>
            <b-input-group class="mt-2" v-for="item in prettyHostList" :key="item.id">
              <b-input-group-prepend is-text>
                <b-form-checkbox
                  switch
                  class="mr-n2"
                  :checked="isSelected(item)"
                  @change="changeSelected(item)"
                ></b-form-checkbox>
              </b-input-group-prepend>
              <b-form-input readonly :value="item"></b-form-input>
            </b-input-group>
          </b-card-body>
        </b-card>
      </b-card-group>
    </div>

    <!-- add program -->
    <div v-if="add" class="mt-3">
      <b-card-group deck class="m-auto" style="max-width: 40rem">
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            {{ $t('message.card.program.header.add')}}
            <div>
              <b-badge variant="success" href="#/program" @click="addProgram()" pill>✓</b-badge>
              <b-badge variant="danger" href="#/program" @click="cancel()" pill>⤺</b-badge>
            </div>
          </b-card-header>

          <b-card-body>
            <b-input-group class="mb-3" :prepend="$t('message.program.name.title')">
              <b-form-input
                id="add-program-name"
                :placeholder="$t('message.program.name.placeHolder')"
                v-model="program.name"
                :state="checkName"
              ></b-form-input>
              <b-form-invalid-feedback
                id="add-program-name-feedback"
              >{{ $t('message.program.name.feedback') }}</b-form-invalid-feedback>
            </b-input-group>
            <b-input-group class="mt-2" v-for="item in prettyHostList" :key="item.id">
              <b-input-group-prepend is-text>
                <b-form-checkbox switch class="mr-n2" @change="changeSelected(item)"></b-form-checkbox>
              </b-input-group-prepend>
              <b-form-input readonly :value="item"></b-form-input>
            </b-input-group>
          </b-card-body>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      programList: [],
      hostList: [],
      host: {
        id: 0,
        name: "",
        ip: ""
      },
      program: {
        id: 0,
        name: ""
      },
      show: true,
      edit: false,
      add: false,
      selected: [],
      prettyHostList: [],
      prettyHost: "",
      changeName: true
    };
  },
  methods: {
    getAllProgram() {
      axios.get("/api/program/host").then(({ data }) => {
        this.programList = data;
      });
    },
    editProgramReady(item) {
      this.show = false;
      this.edit = true;
      this.program = item.program;

      item.hostList.forEach(host => {
        this.selected.push(host.id + "-" + host.name + "-" + host.ip);
      });
    },
    cancel() {
      document.location.reload();
    },
    editProgram() {
      let host = {};
      let hostList = [];
      let hostStr = [];

      this.selected.forEach(item => {
        hostStr = item.split("-");

        host = {
          id: hostStr[0],
          name: hostStr[1],
          ip: hostStr[2]
        };

        hostList.push(host);
      });

      axios.put("/api/program/" + this.program.id + "/host", hostList).then(() => {
        document.location.reload();
      });
    },
    addProgramReady() {
      this.show = false;
      this.add = true;
      this.program = {
        name: ""
      };
    },
    async addProgram() {
      let host = {};
      let hostList = [];
      let hostStr = [];
      await axios.post("/api/program", this.program);

      this.selected.forEach(item => {
        hostStr = item.split("-");

        host = {
          id: hostStr[0],
          name: hostStr[1],
          ip: hostStr[2]
        };

        hostList.push(host);
      });

      alert(JSON.stringify(hostList));

      await axios
        .post("/api/program/" + this.program.name + "/host", hostList)
        .then(() => {
          document.location.reload();
        });
    },
    deleteProgram(program) {
      axios.delete("/api/program/" + program.id).then(() => {
        document.location.reload();
      });
    },
    getAllHost() {
      axios.get("/api/host").then(({ data }) => {
        this.hostList = data;

        this.hostList.forEach(host => {
          this.prettyHostList.push(host.id + "-" + host.name + "-" + host.ip);
        });
      });
    },
    isSelected(item) {
      return this.selected.indexOf(item) != -1;
    },
    changeSelected(item) {
      let indexOf = this.selected.indexOf(item);

      if (indexOf == -1) {
        this.selected.push(item);
      } else {
        this.selected.splice(indexOf, 1);
      }
    }
  },
  computed: {
    checkName() {
      return this.program.name.length > 0 ? true : false;
    }
  },
  mounted() {
    this.getAllProgram();
    this.getAllHost();
  }
};
</script>
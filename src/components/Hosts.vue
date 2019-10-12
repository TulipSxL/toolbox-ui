<template>
  <div>
    <!-- show all hosts -->
    <div>
      <b-card-group deck class="ml-2 mr-2" v-show="show">
        <b-card
          no-body
          style="min-width: 22rem; max-width: 24rem"
          class="mt-3"
          v-for="host in hostList"
          :key="host.id"
        >
          <b-card-header class="d-flex justify-content-between align-items-center">
            {{ host.name }}
            <div>
              <b-badge
                :variant="host.status ? 'warning' : 'success'"
                href="#/hosts"
                @click="changeStatus(host)"
                pill
              >{{ host.status ? '◼︎' : '▶' }}</b-badge>
              <b-badge variant="primary" href="#/hosts" @click="addHostReady()" pill>+</b-badge>
              <b-badge variant="info" href="#/hosts" @click="editHostReady(host)" pill>≡</b-badge>
              <b-badge variant="danger" href="#/hosts" @click="deleteHost(host)" pill>x</b-badge>
            </div>
          </b-card-header>

          <b-card-body>
            <b-card-text>{{ host.ip }}</b-card-text>
          </b-card-body>
        </b-card>
      </b-card-group>
    </div>

    <!-- edit host -->
    <div v-if="edit" class="mt-3">
      <b-card-group deck class="m-auto" style="max-width: 40rem">
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            {{ $t('message.card.host.header.edit')}}
            <div>
              <b-badge variant="success" href="#/hosts" @click="editHost()" pill>✓</b-badge>
              <b-badge variant="danger" href="#/hosts" @click="cancel()" pill>⤺</b-badge>
            </div>
          </b-card-header>

          <b-card-body>
            <b-input-group class="mb-3" :prepend="$t('message.host.name.title')">
              <b-form-input
                id="edit-host-name"
                :placeholder="$t('message.host.name.placeHolder')"
                v-model="host.name"
                :state="checkName"
              ></b-form-input>
              <b-form-invalid-feedback
                id="edit-host-name-feedback"
              >{{ $t('message.host.name.feedback') }}</b-form-invalid-feedback>
            </b-input-group>
            <b-input-group class="mb-3" :prepend="$t('message.host.ip.title')">
              <b-form-input
                id="edit-host-ip"
                :placeholder="$t('message.host.ip.placeHolder')"
                v-model="host.ip"
                :state="checkIp"
              ></b-form-input>
              <b-form-invalid-feedback
                id="edit-host-ip-feedback"
              >{{ $t('message.host.ip.feedback') }}</b-form-invalid-feedback>
            </b-input-group>
          </b-card-body>
        </b-card>
      </b-card-group>
    </div>

    <!-- add host -->
    <div v-if="add" class="mt-3">
      <b-card-group deck class="m-auto" style="max-width: 40rem">
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            {{ $t('message.card.host.header.add')}}
            <div>
              <b-badge variant="success" href="#/hosts" @click="addHost()" pill>✓</b-badge>
              <b-badge variant="danger" href="#/hosts" @click="cancel()" pill>⤺</b-badge>
            </div>
          </b-card-header>

          <b-card-body>
            <b-input-group class="mb-3" :prepend="$t('message.host.name.title')">
              <b-form-input
                id="add-host-name"
                :placeholder="$t('message.host.name.placeHolder')"
                v-model="host.name"
                :state="checkName"
              ></b-form-input>
              <b-form-invalid-feedback
                id="add-host-name-feedback"
              >{{ $t('message.host.name.feedback') }}</b-form-invalid-feedback>
            </b-input-group>
            <b-input-group class="mb-3" :prepend="$t('message.host.ip.title')">
              <b-form-input
                id="add-host-ip"
                :placeholder="$t('message.host.ip.placeHolder')"
                v-model="host.ip"
                :state="checkIp"
              ></b-form-input>
              <b-form-invalid-feedback
                id="add-host-ip-feedback"
              >{{ $t('message.host.ip.feedback') }}</b-form-invalid-feedback>
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
      hostList: [],
      host: {
        id: 0,
        name: "",
        ip: "",
        status: true
      },
      show: true,
      edit: false,
      add: false
    };
  },
  methods: {
    getAllHost() {
      axios.get("/api/host").then(({ data }) => {
        this.hostList = data;
      });
    },
    editHostReady(host) {
      this.show = false;
      this.edit = true;
      this.host = host;
    },
    cancel() {
      document.location.reload();
    },
    editHost() {
      axios.put("/api/host/", this.host).then(() => {
        document.location.reload();
      });
    },
    addHostReady() {
      this.show = false;
      this.add = true;
      this.host = {
        ip: "",
        name: ""
      };
    },
    addHost() {
      axios.post("/api/host", this.host).then(() => {
        document.location.reload();
      });
    },
    deleteHost(host) {
      axios.delete("/api/host/" + host.id).then(() => {
        document.location.reload();
      });
    },
    changeStatus(host) {
      host.status = !host.status;

      axios.put("/api/host/", host).then(() => {
        document.location.reload();
      });
    }
  },
  computed: {
    checkName() {
      return this.host.name.length > 0;
    },
    checkIp() {
      let ipReg = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;

      return ipReg.test(this.host.ip);
    }
  },
  mounted() {
    this.getAllHost();
  }
};
</script>
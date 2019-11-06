<template>
  <div>
    <div>
      <b-card-group class="m-2" v-for="item in all" :key="item.id" deck>
        <b-card no-body :header="item.year" class="text-center mb-2" style="min-width: 90%"></b-card>
        <b-card
          style="min-width: 18rem; max-width: 19rem"
          class="mb-2"
          v-for="amount in item.amountList"
          :key="amount.id"
          :header="$t('message.amount.month.' + amount.month) + $t('message.amount.card.total') + amount.total + $t('message.amount.card.yuan')"
          :title="$t('message.amount.card.current') + (amount.total - amount.cost).toFixed(2) + $t('message.amount.card.yuan')"
          :footer="$t('message.amount.card.remain') + remainDay(amount) + $t('message.amount.card.day')"
        >
          <b-card-text>{{$t("message.amount.card.average") + averageAmount(amount) + $t("message.amount.card.yuan")}}</b-card-text>
          <div v-if="isActive(amount)">
            <b-input-group class="mb-2" prepend="¥">
              <b-form-input v-model="tempAmount.consumption"></b-form-input>
              <b-input-group-append>
                <b-button
                  :disabled="isSendRequest"
                  variant="success"
                  @click="consume(amount)"
                >{{$t("message.amount.button.add")}}</b-button>
              </b-input-group-append>
            </b-input-group>
            <b-input-group class="mb-2" prepend="¥">
              <b-form-input v-model="tempAmount.total"></b-form-input>
              <b-input-group-append>
                <b-button
                  :disabled="isSendRequest"
                  variant="primary"
                  @click="addAmount(amount)"
                >{{$t("message.amount.button.set")}}</b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
const BASE_URL_AMOUNT = "/api/amount";
const BASE_URL_AMOUNT_SLASH = "/api/amount/";
export default {
  data() {
    return {
      all: [],
      dayArr: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      monthArr: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "Augest",
        "September",
        "October",
        "November",
        "December"
      ],
      tempAmount: {
        consumption: "",
        total: ""
      },
      isSendRequest: false
    };
  },
  methods: {
    averageAmount(amount) {
      const today = new Date();
      const now = today.getDate();
      const year = today.getYear();
      const month = today.getMonth();

      if (this.isActive(amount)) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          dayArr[1] = "29";
        }

        return ((amount.total - amount.cost) / this.remainDay(amount)).toFixed(2);
      } else {
        return ((amount.total - amount.cost) / this.dayArr[month]).toFixed(2);
      }
    },
    remainDay(amount) {
      const today = new Date();
      const now = today.getDate();
      const month = today.getMonth();

      if (this.isActive(amount)) {
        return this.dayArr[month] - now + 1;
      } else {
        return this.dayArr[month];
      }
    },
    consume(amount) {
      amount.cost = amount.cost + Number(this.tempAmount.consumption);
      this.isSendRequest = true;

      axios.put(BASE_URL_AMOUNT_SLASH, amount).then(() => {
        this.isSendRequest = false;
        this.tempAmount.consumption = "";
      });
    },
    isActive(amount) {
      const today = new Date();
      const month = today.getMonth();
      return month == this.monthArr.indexOf(amount.month);
    },
    addAmount(amount) {
      amount.total = amount.total + Number(this.tempAmount.total);
      this.isSendRequest = true;

      axios.put(BASE_URL_AMOUNT_SLASH, amount).then(() => {
        this.isSendRequest = false;
        this.tempAmount.total = "";
      });
    },
    getAllAmount() {
      axios.get(BASE_URL_AMOUNT).then(({ data }) => {
        this.all = data;
      });
    }
  },
  computed: {
    canSearch() {
      return this.thing.name.length <= 0;
    }
  },
  mounted() {
    this.getAllAmount();
  },
  watch: {
    "amount.cost": {
      handler(newValue, oldValue) {
        amount.cost = newValue;
        amount.current = amount.total - newValue;
      },
      deep: true
    }
  }
};
</script>

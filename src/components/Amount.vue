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
          :footer="$t('message.amount.card.remain.month') + remainDay(amount) + $t('message.amount.card.day')"
        >
          <div v-if="isActive(amount)">
            <b-card-text>{{$t("message.amount.card.average") + amount.average + $t("message.amount.card.yuan")}}</b-card-text>
            <b-card-text>{{$t("message.amount.card.remain.today") + today.remain + $t("message.amount.card.yuan")}}</b-card-text>
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
const TIMESTAMP = new Date().getTime();
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
      isSendRequest: false,
      today: {
        date: 0,
        remain: 0
      }
    };
  },
  methods: {
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
      amount.cost += Number(this.tempAmount.consumption);
      amount.consumption += Number(this.tempAmount.consumption);
      this.isSendRequest = true;

      axios.put(BASE_URL_AMOUNT_SLASH, amount).then(() => {
        window.location.reload();
      });
    },
    isActive(amount) {
      const month = new Date().getMonth();

      return month == this.monthArr.indexOf(amount.month);
    },
    addAmount(amount) {
      amount.total += Number(this.tempAmount.total);
      this.isSendRequest = true;

      axios.put(BASE_URL_AMOUNT_SLASH, amount).then(() => {
        this.isSendRequest = false;
        this.tempAmount.total = "";
      });
    },
    async getAllAmount() {
      await axios.get(BASE_URL_AMOUNT + "?timestamp=" + TIMESTAMP).then(({ data }) => {
        this.all = data;
      });
    }
  },
  async mounted() {
    await this.getAllAmount();

    this.all.forEach(item => {
      item.amountList.forEach(amount => {
        if (this.isActive(amount)) {
          this.today.remain = (amount.average - amount.consumption).toFixed(2);
        }
      });
    });
  }
};
</script>

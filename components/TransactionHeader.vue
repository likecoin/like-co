<template>
  <section class="section-avatar">
    <div class="heading">
      <section v-if="!isNotFound">
        <span class="send-state">{{ isPending ? "Sending" : "Sent" }}</span>
        <span v-if="amount" class="amount">{{ amount }} LikeCoin </span>
        <span v-if="name" class="user-section">to <span class="usertitle">{{ name }}</span></span>
      </section>
      <h1 v-else class="error"><md-icon class="md-size-2x">error</md-icon>Transaction Not Found or not a Likecoin store transaction</h1>
    </div>
    <div class="icon">
      <nuxt-link v-if="toId" :to="{ name: 'pay-id', params: { id: toId } }">
        <img alt="avatar" class="main-icon" :src="icon" />
      </nuxt-link>
      <img v-else alt="likecoin" class="main-icon" :src="defaultIcon" />
    </div>
    <section v-if="!isNotFound">
      <section v-if="isPending" class="transaction-container">
        <h1 style="color:#d9b503">Pending Confirmation</h1>
        <md-progress-bar md-mode="indeterminate"></md-progress-bar>
      </section>
      <section v-else class="transaction-container">
        <h1 style="color:#16a122">
          <md-icon style="color:#16a122" class="md-size-2x">check</md-icon>
          Transaction Completed
        </h1>
        <div class="date-content">{{ dateCompleted }}</div>
      </section>
    </section>
  </section>
</template>


<script>
import likeCoinIcon from '../assets/likecoin.svg';

export default {
  name: 'transaction-header',
  props: ['icon', 'toId', 'toName', 'toAddress', 'timestamp', 'amount', 'isNotFound'],
  data() {
    return {
      defaultText: 'Redeem your free LikeCoin',
      defaultIcon: likeCoinIcon,
    };
  },
  computed: {
    isPending() {
      return !this.timestamp;
    },
    name() {
      return this.toName || this.toId || '';
    },
    dateCompleted() {
      return new Date(this.timestamp * 1000).toString();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index.scss";

.section-avatar {
  position: relative;
  margin: -137px auto 0 auto;
  padding: 113px 0 1px 0;
  min-height: 408px;
  max-width: 560px;
  background: #f7f7f7;
  overflow: visible;
}

.icon {
  position: absolute;
  left: calc(50% - 64px);
  top: 113px;
  width: 128px;
  height: 128px;
  overflow: hidden;
  border-radius: 50%;
}

.main-icon {
  display: inline;
  margin: 0 auto;
  height: 100%;
  width: auto;
}

.heading {
  position: relative;
  width: 120%;
  left: -10%;
  margin: 114px 0 0 0;
  padding: 30px 30px 48px 30px;
  text-align: center;
  font-size: 42px;

  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);
}

.heading h1 {
  margin: 0;
  text-align: center;
}

.heading .send-state {
  float:left;
  font-size: 14px;
  margin: auto;
}

.heading .amount {
  position: absolute;
  top: 27px;
  left: 0;
  right: 0;
  margin: auto;
}

.heading .user-section {
  float:right;
  font-size: 14px;
  margin: auto;
}

.transaction-container {
  margin: 25px 30px;
  text-align: center;
}

.transaction-container h1 {
  font-size: 32px;
  margin: 40px 0 20px 0;
}

.date-content {
  margin: 0 auto;
  text-align: center;
  font-size: 20px;
}

.usertitle {
  font-weight: 600;
}

</style>

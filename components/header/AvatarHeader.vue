<template>
  <section class="section-avatar">
    <div class="heading">
      <h1 v-html="$t('Transaction.label.sendTo', { title, coin: isEth ? 'ETH' : 'LikeCoin' })" />
    </div>
    <div class="icon">
      <img alt="avatar" class="main-icon" :src="icon || defaultIcon" />
    </div>
    <section v-if="id" class="address-container">
      <div class="address-title">
        {{ $t('Transaction.label.recipientId') }}
      </div>
      <div class="address-content">{{ id }}</div>
    </section>
    <section v-if="address" class="address-container">
      <div class="address-title">
        {{ $t('Transaction.label.recipientAddress') }}
      </div>
      <div class="address-content">{{ address }}</div>
    </section>
  </section>
</template>


<script>
import likeCoinIcon from '@/assets/likecoin.svg';

export default {
  name: 'avatar-header',
  props: ['title', 'icon', 'id', 'address', 'isEth'],
  data() {
    return {
      defaultText: 'Redeem your free LikeCoin',
      defaultIcon: likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.section-avatar {
  position: relative;
  margin: -137px auto 0 auto;
  padding: 113px 0 20px 0;
  min-height: 408px;
  max-width: 560px;
  background: $like-gray-1;
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
  width: 121%;
  left: -10%;
  margin-top: 104px;
  padding: 24px 10px;
  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);
}

.heading h1 {
  margin: 0;
  text-align: center;
}

.address-container {
  margin: 17px 41px;
}

.address-title {
  font-size: 14px;
  margin: 5px -5px;
}

.address-content {
  margin: 0 auto;
  text-align: left;
  font-size: 20px;
}

.usertitle {
  font-weight: 600;
}

</style>

<template>
  <section class="section-avatar">
    <div class="heading">
        <h1>Send LikeCoin to <span class="usertitle">{{ title }}</span></h1>
    </div>
    <div class="icon">
      <img alt="like-coin" class="main-icon" :src="icon || defaultIcon" />
    </div>
    <section class="address-container">
      <div class="address-title">Recipients Address</div>
      <div class="address-content">{{ content }}</div>
    </section>
  </section>
</template>


<script>
export default {
  name: 'avatar-header',
  props: ['title', 'icon', 'content'],
  data() {
    return {
      defaultText: 'Redeem your free LikeCoin',
      defaultIcon: '',
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index.scss";

.section-avatar {
  position: relative;
  margin: -137px auto 0 auto;
  padding: 113px 0 0 0;
  height: 408px;
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
  margin-top: 104px;
  padding: 24px 0;

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
  text-align: center;
  font-size: 20px;
}

.usertitle {
  font-weight: 600;
}

</style>

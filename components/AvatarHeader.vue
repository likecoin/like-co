<template>
  <section class="section-avatar">
    <div id="intro"></div>
    <div class="md-layout md-alignment-top-center">
      <div class="icon">
        <img alt="like-coin" class="main-icon" :src="icon || defaultIcon" />
      </div>
    </div>
    <div class="md-layout md-alignment-top-center">
      <div class="heading "><h1 style="text-align:center">Send LikeCoin {{ title }}</h1></div>
    </div>
    <section class="address">
      <div>Recipients Address</div>
      <div>{{ content }}</div>
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
@import "../styles/index.scss";

.section-avatar {
  height: 608px;
}

#intro {
  margin-top: -146px;
  margin-left: 25%;
  margin-right: 25%;
  margin-bottom: -35%;
  padding: 106px 20px 20px 20px;
  height: 608px;
  background-color: #f7f7f7;
}

.icon {
  width: 128px;
  height: 128px;
  position: relative;
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
  width: 63%;
  margin-top: -24px;
  padding: 0 48px;

  border-radius: 8px;
	background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);
}

</style>

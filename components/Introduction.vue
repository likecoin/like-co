<template>
  <section id="intro" class="lc-padding-vertical-32 lc-mobile">
    <div class="icon">
      <img
        alt="like-coin"
        class="main-icon"
        :src="icon || likeCoinIcon" />
    </div>
    <div class="title">
      <h1 class="lc-font-size-42">
        {{ $t(title || defaultText) }}
      </h1>
    </div>
  </section>
</template>


<script>
import likeCoinIcon from '@/assets/logo/icon.svg';

export default {
  name: 'introduction',
  props: ['title', 'icon'],
  data() {
    return {
      defaultText: 'Register.header.redeem',
      likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

#intro {
  display: flex;

  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  @media (min-width: 601px) {
    align-items: center;
    flex-direction: row;

    border-radius: 8px;
  }

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;

    padding-bottom: 48px;
  }

  > * {
    flex-grow: 1;
  }

  > .title h1 {
    margin-left: 24px;

    @media (max-width: 768px) {
      font-size: 26px;
      font-weight: 400;
    }

    @media (max-width: 600px) {
      margin-top: 8px;
      margin-left: 0;

      font-size: 20px;
    }

    text-align: left;
  }

  > .icon {
    position: relative;
    overflow: hidden;
    border-radius: 50%;

    @media (min-width: 601px) {
      min-width: 250px;
      min-height: 250px;

      max-width: 275px;
      max-height: 275px;

      margin: -50px 0;
    }

    @media (max-width: 600px) {
      width: 144px;
      height: 144px;
    }

    .main-icon {
      width: 100%;
      height: 100%;
    }
  }

}

</style>

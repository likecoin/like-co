<template>
  <section id="intro">
    <div class="icon">
      <img alt="like-coin" class="main-icon" :src="icon || defaultIcon" />
    </div>
    <div class="title heading">
      <h1>{{ title || defaultText }}</h1>
    </div>
  </section>
</template>


<script>
import likeCoinIcon from '../assets/likecoin.svg';

export default {
  name: 'introduction',
  props: ['title', 'icon'],
  data() {
    return {
      defaultText: this.$t('Register.header.redeem'),
      defaultIcon: likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index";

.icon {
  min-width: 250px;
  min-height: 250px;
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

#intro {
  display: flex;
  align-items: center;

  margin-top: 72px;
  padding: 0 48px;

  border-radius: 8px;
	background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  > * {
    flex-grow: 1;
  }

  > .title h1 {
    display: flex;
    align-items: center;
    margin-left: 24px;
    line-height: 60px;

    text-align: left;
  }

  > .icon {
    margin: -50px 0;
    > img {
      width: 100%;
    }
  }

}

@media (max-width: 1024px) {
  body #intro {
    .title h1 {
      line-height: 48px;
      font-size: 36px;
    }
  }
}


@media (max-width: 768px) {
  #intro {
    h1 {
      font-size: 26px;
    }

    h2 {
      font-size: 18px;
    }
  }
}

@media (max-width: 500px) {
  #intro {
    flex-direction: column;

    padding: 0 24px;
    .title {
      margin-top: 12px;

      text-align: center;
    }
  }
}
</style>

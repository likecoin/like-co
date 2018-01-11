<template>
  <section id="intro">
    <div class="icon">
      <img alt="like-coin" class="main-icon" :src="iconSrc" />
    </div>
    <div class="title heading">
      <h1>{{ text }}</h1>
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
      text: this.title || 'Redeem your free LikeCoin',
      iconSrc: this.icon || likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/index.scss";

#intro {
  display: flex;

  margin-top: 48px;
  padding: 0 48px;

  border-radius: 8px;
	background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  > * {
    flex-grow: 1;
  }

  > .title {
    display: flex;
    align-items: center;

    text-align: left;
  }

  > .icon {
    order: 1;

    margin: -50px 0;
    > img {
      width: 100%;
    }
  }

  .heading {
    order: 2;
  }

}

@media (max-width: 1024px) {
  #intro {
    margin-top: 24px;

    h1 {
      font-size: 36px;
    }

    .icon {
      margin: unset !important;
    }
  }
}


@media (max-width: 950px) {
  #intro {
    h1 {
      font-size: 32px;
    }

    h2 {
      font-size: 20px;
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
  body #intro {
    flex-direction: column;

    padding: 0 24px;
    .title {
      margin-top: 12px;

      text-align: center;
    }
    
    .icon {
      order: 1;
    }
    
    .heading {
      order: 2;
    }
  }
}
</style>

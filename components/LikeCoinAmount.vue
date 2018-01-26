<template>
  <div>
    <section id="likecoin-amount">
      <div :class="[isOpaque ? 'text-opaque' : '', 'title']">
        Amount of LikeCoin
      </div>
      <div :class="[isOpaque ? 'text-opaque' : '', 'value']">
        {{ value || defaultValue }}
      </div>
    </section>
    <div v-if="linkHref && linkText" class="links">
      <div class="link what">
        <a
         :href="linkHref"
         target="_blank"
         rel="noopener noreferrer"
        >
          {{ linkText }}
        </a>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'like-coin-amount',
  props: ['value', 'isOpaque', 'linkHref', 'linkText'],
  data() {
    return {
      defaultValue: '0.0000',
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index.scss";

#likecoin-amount {
  display: flex;

  padding-left: 48px;
  padding-top: 24px;
  padding-bottom: 24px;

  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  > .title {
    padding-top: 32px;
    padding-bottom: 28px;
    width: 128px;
    margin-right: 48px;
    display: flex;
    align-items: center;
    text-align: left;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #462814;
  }

  > .value {
    font-size: 56px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #4a4a4a;
  }

  .text-opaque {
    opacity: 0.3;
  }
}
.links {
  height: 30px;
  margin-top: -30px;
  .link {
    float: right;
    margin-right: 100px;
    width: 25%;
    height: 60px;
    text-align: center;
    padding: 16px;
    display: flex;
    font-size: 24px;
    align-items: center;

    transition: opacity .2s ease-in-out;

    &.what {
      background-image: linear-gradient(63deg, $like-gradient-2 2%, $like-gradient-3 99%);
    }

    &:hover {
      opacity: 0.8;
    }

    > a {
      color: $like-white;
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

@media (max-width: 1024px) {
  .links {
    margin-top: -20px;
  }
}

@media (max-width: 500px) {
  #likecoin-amount {
    > .value {
      font-size: 28px;
    }
  }
}
</style>

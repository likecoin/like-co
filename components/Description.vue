<template>
  <section id="description">
    <div class="details">
      <div>{{ content || $t('Register.header.content') }}</div>
    </div>
    <div class="links">
      <div
        v-if="showButton"
        class="link what"
      >
        <a
          href="https://likecoin.foundation/#/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('Register.header.button.what') }}
        </a>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  name: 'description',
  props: {
    content: {
      type: String,
      default: '',
    },
    showButton: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

#description {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 40px;

  .details {
    flex: 2;

    padding: 0 16px 66px 8px;

    font-size: 20px;
    line-height: 30px;

    > div {
      margin-top: 68px;

      color: $like-gray-4;
    }
  }

  .links {
    flex: 1;

    margin-top: -200px;
    .link {
      display: flex;
      flex: 1;

      padding: 6px 12px;

      transition: opacity .2s ease-in-out;

      font-size: 24px;

      &.what {
        background-image: linear-gradient(63deg, $like-gradient-2 2%, $like-gradient-3 99%);
      }

      &:hover {
        opacity: 0.8;
      }

      > a {
        margin: auto;

        cursor: pointer;
        text-decoration: none;

        color: $like-white;

        line-height: 36px;
      }
    }
  }
}

@media (max-width: 768px) {
  body #description {
    flex-direction: column;

    padding: 0;

    .details {
      flex: 1;

      padding: 0 16px 24px 8px;

      font-size: 18px;
      line-height: 28px;

      > div {
        margin-top: 32px;
      }
    }

    .links {
      margin: 12px 0;
      .link {
        justify-content: center;

        width: 244px;
        height: 44px;
        margin: 12px 0;

        font-size: 22px;
      }
    }
  }
}

@media (max-width: 500px) {
  body #description {
    padding: 0 16px;
  }
}
</style>

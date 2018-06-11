<template>
  <section class="likecoin-amount-section">
    <div id="likecoin-amount">
      <div :class="['title', 'lc-font-size-14', { 'text-opaque': isOpaque }]">
        {{ amountText || $t('Edit.label.likeCoinAmount') }}
      </div>
      <div
        :class="[
          'value',
          'lc-font-weight-300',
          {
            'text-opaque': isOpaque,
          },
        ]">
        {{ value || defaultValue }}
      </div>
    </div>

    <div v-if="linkHref && linkText" class="links">
      <a
        :href="linkHref"
        target="_blank"
        rel="noopener noreferrer">
        <material-button class="link what">
            {{ linkText }}
        </material-button>
      </a>
    </div>

    <div v-else-if="linkText" class="links" @click="onClick">
      <material-button class="link what">
        <span> {{ linkText }} </span>
      </material-button>
    </div>

  </section>
</template>


<script>
import MaterialButton from '~/components/MaterialButton';

export default {
  name: 'like-coin-amount',
  props: ['value', 'isOpaque', 'linkHref', 'linkText', 'amountText'],
  components: {
    MaterialButton,
  },
  data() {
    return {
      defaultValue: '0.0000',
    };
  },
  methods: {
    onClick() {
      this.$emit('onTextClick');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

#likecoin-amount {
  display: flex;
  align-items: center;
  flex-direction: row;

  padding: 24px 48px;

  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  @media (max-width: 768px) {
    z-index: 1;

    align-items: center;
    flex-direction: column;

    padding: 24px 8px 48px;

    text-align: center;
  }

  @media (max-width: 600px) {
    border-radius: 0;
  }

  > .title {
    display: flex;

    color: $like-dark-brown-1;

    @media (min-width: 769px) {
      width: 128px;
      min-width: 128px;
      margin-right: 48px;
    }

    @media (max-width: 768px) {
      margin-bottom: 12px;

      text-align: center;
    }
  }

  > .value {
    width: 100%;

    word-wrap: break-word;

    color: $like-gray-5;

    font-size: 56px;
    line-height: 1;

    @media (max-width: 1024px) {
      font-size: 42px;
    }

    @media (max-width: 600px) {
      font-size: 38px;
    }
  }

  .text-opaque {
    opacity: 0.3;
  }
}

.links {
  z-index: 1;

  margin-top: -24px;

  @media (min-width: #{768px + 1px}) {
    align-self: flex-end;

    width: calc(33.33% - 40px);
    margin-right: #{40px + 8px};
  }

  @media (max-width: 768px) {
    align-self: center;

    width: 100%;
    max-width: 320px;
    padding: 0 24px;
  }

  .link {
    display: flex;

    margin: 0;

    transition: opacity .2s ease-in-out;

    &:not(:first-child) {
      margin-top: 8px;
    }

    &.what {
      background-image: linear-gradient(73deg, $like-gradient-2, $like-gradient-3);
    }

    &:hover {
      opacity: 0.8;
    }

    > a, span {
      text-decoration: underline;
    }
  }
}
</style>

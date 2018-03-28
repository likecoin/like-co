<template>
  <div>
    <section id="likecoin-amount">
      <div :class="['title', 'lc-font-size-14', { 'text-opaque': isOpaque }]">
        {{ $t('Edit.label.likeCoinAmount') }}
      </div>
      <a class="mobile-links" @click="onClick">
        {{ linkText }}
      </a>
      <div
        :class="[
          'value',
          'lc-font-weight-300',
          'lc-font-size-56',
          {
            'text-opaque': isOpaque,
          },
        ]">
        {{ value || defaultValue }}
      </div>
    </section>
    <div v-if="linkHref && linkText" class="links">
      <material-button class="link what">
        <a
         :href="linkHref"
         target="_blank"
         rel="noopener noreferrer"
        >
          {{ linkText }}
        </a>
      </material-button>
    </div>
    <div v-else-if="linkText" class="links" @click="onClick">
      <material-button class="link what">
        <span> {{ linkText }} </span>
      </material-button>
    </div>
  </div>
</template>


<script>
import MaterialButton from '~/components/MaterialButton';

export default {
  name: 'like-coin-amount',
  props: ['value', 'isOpaque', 'linkHref', 'linkText'],
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
@import "../assets/index";

#likecoin-amount {
  display: flex;
  align-items: center;
  flex-direction: row;

  padding: 24px 48px;

  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  @media (max-width: 768px) {
    z-index: 1;

    align-items: flex-start;
    flex-direction: column;

    padding: 48px 8px 8px 144px;

    border-radius: 0;
  }

  > .title {
    display: flex;
    align-items: center;

    color: $like-dark-brown-1;

    @media (min-width: 769px) {
      width: 128px;
      min-width: 128px;
      margin-right: 48px;
    }
  }

  > .value {
    color: $like-gray-5;
    word-wrap: break-word;
    line-height: 1;
    width: 100%;

    @media (max-width: 768px) {
      font-size: 38px;
    }
  }

  .text-opaque {
    opacity: 0.3;
  }

  .mobile-links {
    text-decoration: underline;
    @media (min-width: 601px) {
      display: none;
    }
  }

}

.links {
  align-self: flex-end;

  width: calc(33.33% - 40px);
  margin-top: -24px;
  margin-right: 40px;

  z-index: 1;

  @media (max-width: 600px) {
    display: none;
  }

  .link {
    display: flex;

    transition: opacity .2s ease-in-out;

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

@media (max-width: 1024px) {
  .links {
    margin-top: -20px;
  }
}
</style>

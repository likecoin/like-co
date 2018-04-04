<template>
  <nav class="page-header narrow">

    <div>

      <span>
        <nuxt-link :to="{ name: 'in-whitepaper' }">
          {{ $t('TokenSale.button.whitePaper') }}
        </nuxt-link>
      </span>

      <span class="signature-icon">
        <img :src="icon || likeCoinIcon" />
      </span>

      <span>
        <nuxt-link to="/">
          {{ $t('TokenSale.button.aboutLikeCoin') }}
        </nuxt-link>
      </span>

    </div>

  </nav>
</template>


<script>
import likeCoinIcon from '@/assets/like-coin.svg';

export default {
  name: 'narrow-page-header',
  props: ['icon'],
  data() {
    return {
      likeCoinIcon,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$horizontal-interspace: 32px;
$vertical-interspace: 8px;
$signature-icon-size: 144px;
$signature-icon-overlap: 16px;

.page-header.narrow {
  position: relative;

  padding-top: $signature-icon-overlap + $vertical-interspace / 2;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin: -#{$vertical-interspace / 2} -#{$horizontal-interspace / 2};

    @media (max-width: 600px) {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  span {
    flex: 1;

    margin: #{$vertical-interspace / 2} #{$horizontal-interspace / 2};

    @media (min-width: 600px + 1px) {
      &:last-child {
        text-align: right;
      }
    }

    @media (max-width: 600px) {
      text-align: center;
    }

    &.signature-icon {
      z-index: 1;

      display: block;

      margin-top: $signature-icon-overlap;
      margin-bottom: -#{$signature-icon-overlap};

      @media (min-width: 768px + 1px) {
        margin-top: -#{$signature-icon-overlap};
      }
      @media (max-width: 600px) {
        flex: auto;
        order: 999;

        width: 100%;
      }

      > img {
        display: block;

        width: $signature-icon-size;
        min-width: $signature-icon-size;
        height: $signature-icon-size;
        margin: auto;

        border-radius: $signature-icon-size / 2;
      }
    }

    a {
      text-decoration: underline;

      color: $like-green;
    }
  }
}
</style>

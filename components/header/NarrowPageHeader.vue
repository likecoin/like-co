<template>
  <nav class="page-header narrow">

    <div>

      <span />

      <span class="signature-icon">
        <lc-avatar
          :src="icon"
          :halo="avatarHalo"
          size="144"
        />
      </span>

      <span>
        <nuxt-link
          v-if="!isHiddenLink"
          to="/"
        >
          {{ $t('TokenSale.button.aboutLikeCoin') }}
        </nuxt-link>
      </span>

    </div>

  </nav>
</template>


<script>
import likeCoinIcon from '@/assets/logo/icon.svg';

export default {
  name: 'narrow-page-header',
  props: {
    icon: {
      type: String,
      default: likeCoinIcon,
    },
    avatarHalo: {
      type: String,
      default: undefined,
    },
    isHiddenLink: {
      type: [Boolean, String],
      default: false,
    },
  },
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
$signature-icon-overlap: 24px;

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

      margin-right: -#{$horizontal-interspace / 4};
      margin-left: -#{$horizontal-interspace / 4};
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
      margin-right: #{$horizontal-interspace / 4};
      margin-left: #{$horizontal-interspace / 4};

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

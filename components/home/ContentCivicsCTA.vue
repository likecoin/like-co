<template>
  <div class="content-civics-cta">
    <template v-if="isShowContent">
      <h3>{{ $t('Home.ContentCivicsCTA.title') }}</h3>

      <div class="content-civics-cta__content-wrapper">
        <p>{{ $t('Home.ContentCivicsCTA.content') }}</p>
      </div>
    </template>

    <div class="lc-text-align-center">
      <md-button
        class="md-likecoin lc-gradient-2 shadow"
        @click="$emit('click')"
      >{{ $t('Home.ContentCivicsCTA.button.support') }}</md-button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'home-banner',
  props: {
    isShowContent: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.content-civics-cta {
  h3 {
    font-size: 20px;

    @media (min-width: 600px + 1px) {
      text-align: center;
    }
  }

  &__content-wrapper {
    display: flex;
    justify-content: center;

    margin-top: 8px;
  }

  p {
    @media (min-width: 600px + 1px) {
      max-width: 408px;
    }
  }

  .md-button {
    min-width: 272px;
    margin: 24px 0 0;

    border-radius: 0;

    font-size: 20px;
    font-weight: 600;

    :global(.md-ripple) {
      min-height: 48px;
    }
  }
}
</style>

<template>
  <div class="likecoin-embed">

    <div class="likecoin-embed__badge">
      <div class="likecoin-embed__badge__content">

        <embed-user-info
          :avatar="avatar"
          :display-name="displayName"
          :link="getUserPath"
        />

        <div class="text-content">
          <div class="text-content__subtitle">
            {{ $t('Embed.label.subtitle') }}
          </div>
          <div class="text-content__title">
            <span class="title-message">
              {{ $t('Embed.label.title') }}
            </span>
          </div>
        </div>

        <div class="embed-superlike-button-wrapper">
          <md-button
            id="embed-superlike-button"
            :href="getUserPath"
            class="md-likecoin"
            target="_blank"
          >
            {{ $t('Embed.button.sendLike') }}
          </md-button>
        </div>
      </div>
    </div>

    <social-media-connect
      :username="id"
      :platforms="platforms"
      :limit="5"
      class="social-media-connect"
    />

    <embed-create-widget-button :link="getReferralLink" />

  </div>
</template>

<script>
import mixin from '~/components/embed/mixin';

export default {
  name: 'embed-id',
  layout: 'embed',
  mixins: [mixin],
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

.text-content {
  position: relative;

  letter-spacing: 0;

  &__subtitle {
    color: $like-gray-5;

    font-size: normalized(16);
    font-weight: 500;
    line-height: normalized(16.5);
  }

  &__title {
    margin-top: normalized(2);

    color: black;

    font-size: normalized(18);
    font-weight: 600;
    line-height: normalized(18.5);
  }
}
</style>

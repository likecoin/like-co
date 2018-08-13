<template>
  <div class="likecoin-embed">

    <div class="likecoin-embed__badge">
      <div class="likecoin-embed__badge__content">

        <embed-user-info
          :avatar="avatar"
          :link="getUserPath"
        />

        <div class="text-content">
          <div class="text-content__title text-content__title--display-name">
            <a
              :href="getUserPath"
              target="_blank"
              rel="noopener"
            >{{ displayName }}</a>
          </div>
          <div class="text-content__title">
            {{ $t('Embed.label.followMeOn') }}
          </div>
        </div>

      </div>
    </div>

    <footer>
      <social-media-connect
        :username="id"
        :platforms="platforms"
        :limit="6"
        colorful
      />

      <embed-create-widget-button :link="getReferralLink" />
    </footer>

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

.likecoin-embed {
  .text-content {
    &__title {
      color: $like-gray-5;

      font-size: normalized(26);
      font-weight: 600;
      line-height: normalized(32);

      &--display-name {
        color: $like-green;

        font-size: normalized(22);
      }
    }
  }
}
</style>

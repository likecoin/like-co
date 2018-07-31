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
            {{ $t('Embed.label.title') }}
          </div>
        </div>

        <div class="embed-superlike-button-wrapper">
          <a
            id="embed-superlike-button"
            :href="getUserPath"
            target="_blank"
          >
            <div class="button-content-wrapper">
              <div class="button-content">
                {{ $t('Embed.button.sendLike') }}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <footer>
      <social-media-connect
        :username="id"
        :platforms="platforms"
        :limit="5"
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
  &__badge,
  & footer {
    margin-right: normalized($button-width / 2 + $button-shadow-width);
  }

  &__badge {
    &__content {
      padding-right: normalized($button-width / 2 + $button-shadow-width);
    }
  }
}
</style>

<template>
  <div :class="rootClass">
    <div class="embed-user-info__avatar">
      <lc-avatar
        :src="avatar"
        :halo="avatarHalo"
        is-full-width
      />
    </div>

    <div
      v-if="displayName"
      class="embed-user-info__display-name"
    >
      <div>
        <nuxt-link
          :to="link"
          target="_blank"
        >
          {{ displayName }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'embed-user-info',
  props: {
    avatar: {
      type: String,
      default: null,
    },
    avatarHalo: {
      type: String,
      default: 'none',
    },
    displayName: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: null,
    },
  },
  computed: {
    rootClass() {
      return [
        'embed-user-info',
        {
          'embed-user-info--with-halo': this.avatarHalo !== 'none',
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

$normal-x-margin: 8;

.embed-user-info {
  position: relative;

  flex-shrink: 0;

  width: normalized($avatar-size);
  height: normalized($avatar-size);
  margin: normalized(-$avatar-vertical-offset) normalized($normal-x-margin);

  &--with-halo {
    margin-right: normalized($normal-x-margin + 10);
    margin-left: normalized($normal-x-margin + 6);
  }

  &__avatar {
    position: relative;

    width: normalized($avatar-size);
    height: normalized($avatar-size);

    :global(.lc-avatar__content__halo) {
      position: absolute;

      font-size: 0;
    }
  }

  &__display-name {
    position: absolute;
    top: 100%;

    display: flex;
    justify-content: center;

    min-width: 100%;
    margin-top: normalized(4);

    letter-spacing: 0;

    font-size: normalized(18);
    font-weight: 600;
    line-height: normalized(18.5);

    a {
      display: inline-block;

      white-space: nowrap;

      color: $like-green;

      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
  }
}
</style>

<template>
  <div class="embed-user-info">
    <div class="embed-user-info__avatar">
      <div>
        <img :src="avatar">
      </div>
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
    displayName: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

.embed-user-info {
  position: relative;

  flex-shrink: 0;

  width: normalized($avatar-size);
  height: normalized($avatar-size);
  margin: normalized(-$avatar-vertical-offset) normalized(8);

  &__avatar {
    position: relative;

    width: normalized($avatar-size);
    height: normalized($avatar-size);

    border-radius: 50%;
    background: linear-gradient(70deg, $like-light-blue, $like-gradient-1);

    > div {
      position: absolute;
      top: normalized($avatar-border-width);
      right: normalized($avatar-border-width);
      bottom: normalized($avatar-border-width);
      left: normalized($avatar-border-width);

      overflow: hidden;

      border-radius: inherit;
      background-color: white;
    }

    img {
      display: block;

      width: 100%;
      height: 100%;
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

<template>
  <div class="user-avatar">
    <transition
      name="lc-transition-default"
      mode="out-in"
    >
      <img
        v-if="user.avatar"
        :src="user.avatar"
      >
      <div
        v-else
        class="user-avatar__placeholder--image"
      />
    </transition>

    <transition
      name="lc-transition-default"
      mode="out-in"
    >
      <a
        v-if="user.displayName"
        :href="`https://${EXTERNAL_HOSTNAME}/${user.id}`"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{{ user.displayName }}</span>
      </a>
      <div
        v-else
        :style="style.displayNamePlaceholder"
        class="user-avatar__placeholder--name"
      />
    </transition>
  </div>
</template>


<script>
import { EXTERNAL_HOSTNAME } from '@/constant';

export default {
  name: 'user-avatar',
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      EXTERNAL_HOSTNAME,
      style: {
        displayNamePlaceholder: {
          width: `${50 + Math.floor(Math.random() * 35)}%`,
        },
      },
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

$user-avatar-image-size: 48px;
$placeholder-gradient: linear-gradient(to right, #eee 8%, #ddd 24%, #eee 32%);

.user-avatar {
  display: flex;
  align-items: center;
  flex-direction: row;

  img,
  &__placeholder--image {
    width: $user-avatar-image-size;
    height: $user-avatar-image-size;

    border-radius: 50%;
  }

  img {
    background-color: $like-white;
  }

  &__placeholder {
    &--image,
    &--name {
      @include background-image-sliding-animation-x($placeholder-gradient);
    }

    &--name {
      height: 24px;
      margin-left: 12px;
    }
  }

  a {
    max-width: calc(100% - #{$user-avatar-image-size});
  }

  span {
    display: block;

    margin-left: 12px;

    word-wrap: break-word;

    color: $like-green;

    font-size: 18px;
    font-weight: 600;
  }
}
</style>

<template>
  <div
    :class="['lc-creator-button', 'cta', className]">
    <nuxt-link
      :to="{ name: 'id', params: { id } }">
      <div class="creator-info">
        <div class="icon">
          <img v-lazy="src" />
        </div>
        <div class="details">
          <div class="name">{{ id }}</div>
          <div class="title">{{ title }}</div>
        </div>
      </div>
      <span class="call-to-action">
        {{ $t('Home.Creator.button.likeCoinForAppreciate') }}
      </span>
    </nuxt-link>
  </div>
</template>

<script>
import likeCoinIcon from '@/assets/logo/icon.svg';

export default {
  name: 'creator-button',
  props: {
    className: {
      default: undefined,
    },
    src: {
      default: likeCoinIcon,
    },
    id: {
      default: '',
    },
    title: {
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$border-radius-size: 6px;

.lc-creator-button {

  display: flex;
  flex-direction: column;
  width: 240px;

  cursor: pointer;

  transition: transform .2s ease-in-out;
  border-radius: $border-radius-size;

  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

  &:hover {
    transform: translateY(-8px);
  }

  > a {
    text-decoration: none;

    color: initial;
  }

  .creator-info {
    display: flex;
    flex-direction: row;

    height: 56px;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 90px;
      height: 100%;

      border-radius: $border-radius-size 0 0 $border-radius-size;
      background-color: #d7ecec;

      img {

        z-index: 1;

        width: 72px;
        height: 72px;

        border: 1px solid $like-gray-3;

        border-radius: 50%;
        object-fit: cover;
      }
    }

    .details {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      width: 150px;
      height: 100%;

      color: $like-dark-brown-2;
      border-radius: 0 $border-radius-size $border-radius-size 0;
      background-color: $like-white;

      .name {
        font-size: 20px;
        line-height: 24px;
      }
      .title {
        font-size: 10px;
        line-height: 16px;
      }
    }
  }

  &.cta {
    .icon {
      border-bottom-left-radius: 0;
    }
    .details {
      border-bottom-right-radius: 0;
    }
  }

  .call-to-action {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 24px;

    color: $like-white;
    border-bottom-right-radius: $border-radius-size;

    border-bottom-left-radius: $border-radius-size;

    background-image: linear-gradient(81deg, #812d4c, #f75353);

    font-size: 12px;

  }

}
</style>

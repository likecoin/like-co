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
  width: 240px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border-radius: $border-radius-size;

  display: flex;
  flex-direction: column;

  transition: transform .2s ease-in-out;

  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
  }

  > a {
    color: initial;
    text-decoration: none;
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
      background-color: #d7ecec;
      border-radius: $border-radius-size 0 0 $border-radius-size;

      img {
        width: 72px;
        height: 72px;

        border-radius: 50%;
        border: 1px solid $like-gray-3;

        z-index: 1;
        object-fit: cover;
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      width: 150px;
      height: 100%;
      background-color: $like-white;
      border-radius: 0 $border-radius-size $border-radius-size 0;
      color: $like-dark-brown-2;

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

    color: $like-white;

    width: 100%;
    height: 24px;

    font-size: 12px;

    background-image: linear-gradient(81deg, #812d4c, #f75353);

    border-bottom-left-radius: $border-radius-size;
    border-bottom-right-radius: $border-radius-size;

  }

}
</style>

<template>
  <div class="play-video-button">
    <div @click="$emit('click')">
      <span>{{ label }}</span>
      <img :src="PlayButton" />
    </div>
  </div>
</template>


<script>
import PlayButton from '@/assets/img/play-button.png';

export default {
  name: 'play-video-button',
  props: {
    label: {
      type: String,
    },
  },
  data() {
    return {
      PlayButton,
    };
  },
};
</script>


<style lang="scss" scoped>
.play-video-button {
  position: relative;

  margin: 4px 0;
  padding: 4px 0;

  cursor: pointer;

  > div {
    display: flex;
    align-items: center;

    transition: transform .25s ease-out;

    &:hover {
      transform: translateY(3px);
    }
    &:active {
      transform: translateY(5px);
    }

    span {
      user-select: none;

      color: white;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);

      font-size: 22px;
      font-weight: 600;
      line-height: 22px;

      @media (max-width: 600px) {
        font-size: 18px;
      }
    }

    img {
      display: block;

      width: 28px;
      height: 28px;
      margin-top: 6px;
      margin-left: 4px;
    }
  }
}
</style>

<template>
  <div
    :class="[
      'social-media-icon',
      {
        'social-media-icon--on': isPublic !== isHovered,
        'social-media-icon--hover': isHovered,
      }
    ]"
    @mouseover="onHover(true)"
    @mouseleave="onHover(false)"
    @click="onClick"
  >
    <simple-svg
      :filepath="iconPath"
      class="social-media-icon__icon"
      height="28"
      width="28"
      fill="white"
    />
    <simple-svg
      :filepath="publicIconPath"
      class="social-media-icon__visibility"
      height="28"
      width="28"
      fill="white"
    />
  </div>
</template>

<script>
const iconFolder = require.context('../../assets/icons/social-media/');

export default {
  name: 'social-media-icon',
  props: {
    id: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    iconPath() {
      return iconFolder(`./${this.id}.svg`);
    },
    publicIconPath() {
      return iconFolder(`./switch-${this.isPublic ? 'off' : 'on'}.svg`);
    },
  },
  methods: {
    onHover(isHovered) {
      this.isHovered = isHovered;
    },
    onClick() {
      this.$emit('change', {
        id: this.id,
        value: !this.isPublic,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.social-media-icon {
  position: relative;

  display: inline-block;

  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  opacity: 0.2;
  border-radius: 50%;
  background-color: $like-gray-5;

  &--on {
    opacity: 1;
  }

  &--hover {
    .social-media-icon__icon {
      opacity: 0;
    }

    .social-media-icon__visibility {
      opacity: 1;
    }
  }

  &__visibility {
    position: absolute;
    top: 0;
    left: 0;

    opacity: 0;
  }
}
</style>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 192 394"
  >
    <defs>
      <clipPath id="a">
        <rect
          x="8"
          y="6"
          width="176"
          height="382"
          rx="16"
          style="fill: none"
        />
      </clipPath>
    </defs>
    <!-- eslint-disable max-len -->
    <path
      d="M2,22A22,22,0,0,1,24,0H168a22,22,0,0,1,22,22V99a2,2,0,0,1,2,2v42a2,2,0,0,1-2,2V372a22,22,0,0,1-22,22H24A22,22,0,0,1,2,372V155a2,2,0,0,1-2-2V129a2,2,0,0,1,2-2v-9a2,2,0,0,1-2-2V92a2,2,0,0,1,2-2V75a2,2,0,0,1-2-2V63a2,2,0,0,1,2-2Z"
      style="fill-rule: evenodd"
    />
    <!-- eslint-enable max-len -->
    <g style="clip-path: url(#a)">
      <Transition name="lc-transition-default">
        <image
          :key="activeScreenshot"
          width="640"
          height="1388"
          transform="translate(8 6) scale(0.275 0.275)"
          :xlink:href="activeScreenshot"
        />
      </transition>
    </g>
  </svg>
</template>

<script>
const screenshots = require.context('~/assets/app/screenshots');

export default {
  name: 'app-screenshot-preview',
  data() {
    return {
      activeScreenshotIndex: 0,
    };
  },
  computed: {
    activeScreenshot() {
      return this.getScreenshot(this.activeScreenshotIndex);
    },
  },
  mounted() {
    this.slideshowInterval = setInterval(this.nextScreenshot, 3000);
  },
  beforeDestroy() {
    clearInterval(this.slideshowInterval);
  },
  methods: {
    getScreenshot(index) {
      return screenshots(`./${index + 1}.png`);
    },
    nextScreenshot() {
      this.activeScreenshotIndex = (this.activeScreenshotIndex + 1) % 3;
    },
  },
};
</script>

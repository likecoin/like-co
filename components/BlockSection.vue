<template>
  <div :class="['block-section', className]">
    <div class="lc-container-3">
      <div class="lc-container-4">
        <div class="section-title">
          {{ title }}
        </div>
      </div>
      <div class="section-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'block-section',
  props: ['className', 'title'],
};
</script>

<style lang="scss" scoped>
@import "../assets/index";

.block-section {
  margin-top: 24px;

  color: $like-gray-4;
  background-color: $like-gray-1;

  font-size: 20px;
  line-height: 1.5;

  .section-title {
    position: absolute;
    top: -24px;

    display: flex;
    align-items: center;
    justify-content: center;

  	width: 66.66%;
  	height: 48px;

  	color: #462405;
  	background-color: #d2f0f0;

  	font-size: 32px;
  	font-weight: 300;
  }

  .section-content {
    padding-top: 48px;
    padding-bottom: 32px;
  }
}

@media (max-width: 600px) {
  body .block-section {
    font-size: 18px;

    .section-title {
      left: -32px;
      width: calc(100% + 48px);
    }
  }
}
</style>

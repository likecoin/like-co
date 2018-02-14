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

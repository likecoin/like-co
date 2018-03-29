<template>
  <a :href="href" class="custom-link">
    {{ title }}
  </a>
</template>

<script>
export default {
  name: 'custom-link',
  props: ['title', 'href'],
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.custom-link {
  color: $like-green !important;
  text-decoration: underline;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    opacity: 0.7;
  }
}
</style>

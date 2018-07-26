<template>
  <div class="embed-create-widget-button">
    <a
      :href="link"
      target="_blank"
      rel="noopener"
    >
      {{ $t('Embed.label.createMyWidget') }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'embed-create-widget-button',
  props: {
    link: {
      type: String,
      default: 'https://like.co',
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/embed";

.embed-create-widget-button {
  margin-top: normalized(8);

  text-align: right;

  color: $gray-9b;

  font-size: normalized(10);
  line-height: normalized(10.5);

  @media screen and (max-width: 414px) {
    font-size: normalized(12);
    line-height: normalized(13);
  }

  a {
    display: inline-block;

    text-decoration: underline;

    color: inherit;

    font-size: inherit;
    line-height: inherit;
  }
}
</style>

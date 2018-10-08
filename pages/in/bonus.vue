<template>
  <div class="bonus-page">

    <nuxt-child />

  </div>
</template>


<script>
export default {
  name: 'bonus-page',
  layout: 'in',
  head() {
    return {
      title: this.$t('BonusPage.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('BonusPage.label.description'),
        },
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('BonusPage.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('BonusPage.label.description'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
    };
  },
};
</script>

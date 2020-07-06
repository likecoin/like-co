<template>
  <div class="webflow">
    <nuxt />
  </div>
</template>

<script>
export default {
  head() {
    return {
      link: [
        { rel: 'preload', href: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js', as: 'script' },
        { rel: 'preload', href: '/vendor/webflow/js/main.js', as: 'script' },
      ],
    };
  },
  beforeMount() {
    this.loadJquery();
  },
  methods: {
    loadJquery() {
      const script = document.createElement('script');
      script.hid = 'jquery';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js';
      script.type = 'text/javascript';
      script.onload = () => this.loadWebflowScript();
      document.head.appendChild(script);
    },
    loadWebflowScript() {
      const script = document.createElement('script');
      script.src = '/vendor/webflow/js/main.js';
      script.type = 'text/javascript';
      document.head.appendChild(script);
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/webflow/css/normalize.css";
@import "~/assets/webflow/css/webflow.css";
@import "~/assets/webflow/css/main.scss";

.webflow {
  @include webflow;
}
</style>

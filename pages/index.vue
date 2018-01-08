<template>
  <section class="container">
    <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      Likestore (WIP)
    </h1>
    <nuxt-link :to="{ name: 'id', params: { id: 'ckxpress' } }">
      <md-button>Pay ckxpress</md-button>
    </nuxt-link>
    <nuxt-link :to="{ name: 'id', params: { id: 'williamchong007' } }">
      <md-button>Pay williamchong007</md-button>
    </nuxt-link>
    <nuxt-link :to="{ name: 'register' }">
      <md-button>Make new account</md-button>
    </nuxt-link>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: 'Landing - In progress',
    };
  },
};
</script>

<style scoped>
.title
{
  margin: 30px 0;
}
.users
{
  list-style: none;
  margin: 0;
  padding: 0;
}
.user
{
  margin: 10px 0;
}
</style>

<template>
  <span v-if="errorMsg">Error: {{ errorMsg }}, returning to 
    <nuxt-link :to="{ name: 'index' }">index</nuxt-link>...</span>
  <span v-else-if="isVerified">Success!, returning to 
    <nuxt-link :to="{ name: 'edit' }">account page</nuxt-link>...</span>
  <span v-else>Verifyinging</span>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'VerifyEmail',
  layout: 'base',
  data() {
    return {
      errorMsg: '',
      isVerified: false,
    };
  },
  computed: {
    uuid() {
      return this.$route.params.uuid;
    },
  },
  methods: {
    ...mapActions([
      'verifyEmailByUUID',
    ]),
    async verifyEmail() {
      this.isVerified = false;
      try {
        await this.verifyEmailByUUID(this.uuid);
        this.isVerified = true;
        setTimeout(() => this.$router.push({ name: 'edit' }), 3000);
      } catch (err) {
        this.errorMsg = err.message || err;
        setTimeout(() => this.$router.push({ name: 'index' }), 3000);
      }
    },
  },
  mounted() {
    this.verifyEmail();
  },
};
</script>

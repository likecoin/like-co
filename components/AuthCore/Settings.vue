<template>
  <div id="authcore-settings-container" />
</template>

<script>
import { AuthCoreWidgets } from 'authcore-js';
import config from './config';
import { AUTHCORE_API_HOST } from '@/constant';

export default {
  name: 'auth-core-settings',
  data() {
    return {
      widgetInstance: null,
    };
  },
  props: {
    isProfile: {
      type: Boolean,
      default: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    SettingsWidget() {
      return this.isProfile ? AuthCoreWidgets.Profile : AuthCoreWidgets.Settings;
    },
  },
  async mounted() {
    this.initWidget();
  },
  methods: {
    initWidget() {
      this.widgetInstance = new this.SettingsWidget({
        ...config,
        container: 'authcore-settings-container',
        accessToken: this.accessToken,
        root: `${AUTHCORE_API_HOST}/widgets`,
        onSuccess: (data) => {
          console.log(data);
        },
        onLoaded: () => {
          this.$emit('loaded');
        },
        unauthenticated: (err) => {
          console.log(err);
          this.$emit('unauthenticated', err);
        },
        ...this.options,
      });
    },
  },
  watch: {
    isProfile() {
      this.widgetInstance.destroy();
      this.initWidget();
    },
  },
};
</script>

<template>
  <base-dialog
    ref="dialog"
    class="input-dialog"
  >

    <div class="lc-dialog-container-1">
      <h1
        v-if="title"
        class="lc-margin-bottom-16
          lc-font-size-32
          lc-font-weight-400
          lc-color-like-dark-brown-1
          lc-mobile"
      >
        {{ title }}
      </h1>

      <p
        v-if="content"
        class="lc-margin-bottom-16 lc-font-size-14 lc-font-weight-400 lc-color-like-green"
        v-html="content"
      />

      <single-input-form
        ref="form"
        :type="type"
        :text="text"
        :label="label"
        :errorText="getInfoIsError ? getInfoMsg : ''"
        @cancel="onCancel"
        @submit="onSubmit"
      />
    </div>

  </base-dialog>
</template>


<script>
import { mapGetters } from 'vuex';

import BaseDialog from '~/components/dialogs/BaseDialog';
import SingleInputForm from '@/components/forms/SingleInputForm';

export default {
  name: 'input-dialog',
  components: {
    BaseDialog,
    SingleInputForm,
  },
  props: {
    text: {
      default: '',
    },
    type: {
      default: '',
    },
    title: {
      default: 'Please enter your text',
    },
    content: {
      default: 'Input your text',
    },
    label: {
      default: '',
    },
  },
  computed: {
    ...mapGetters([
      'getInfoIsError',
      'getInfoMsg',
    ]),
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onCancel() {
      this.hide();
    },
    onSubmit(value) {
      this.$refs.dialog.hide();
      this.$emit('submit', value);
    },
  },
};
</script>

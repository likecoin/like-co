<template>
  <md-field class="md-likecoin copy-text-field">
    <label>{{ label }}</label>
    <md-input
      ref="inputText"
      :value="text"
      readonly
      @click.native="onClickInput"
    />
    <md-button
      v-clipboard:copy="text"
      v-clipboard:success="onCopy"
    >
      {{ $t(`General.button.${hasCopiedURL ? 'copied' : 'copy'}`) }}
    </md-button>
  </md-field>
</template>


<script>
export default {
  name: 'copy-text-field',
  props: {
    label: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasCopiedURL: false,
    };
  },
  methods: {
    onCopy() {
      this.hasCopiedURL = true;
      this.$emit('copy');
    },
    onClickInput() {
      this.$refs.inputText.$el.select();
    },
  },
};
</script>


<style lang="scss">
@import "~assets/variables";

.copy-text-field.md-field.md-has-value {
  label {
    color: $like-brown;
  }

  input {
    text-overflow: ellipsis;

    color: $like-green;

    font-size: 18px;
    font-weight: 600;

    -webkit-text-fill-color: $like-green;
  }

  .md-button {
    width: auto;
    min-width: auto;
    height: 24px;
    margin: 0 0 0 4px;

    color: $like-green;

    font-size: 12px;
    line-height: 24px;
  }
}
</style>

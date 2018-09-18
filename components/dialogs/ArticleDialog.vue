<template>
  <base-dialog
    :is-show.sync="isShowDialog"
    :md-props="{
      mdClickOutsideToClose: true,
      mdCloseOnEsc: false,
      mdFullscreen: true,
    }"
    :class="[
      'article-dialog',
      { 'article-dialog--center': isCenter }
    ]"
  >
    <div
      slot="header-left"
    >
      <div class="article-dialog__title">{{ title }}</div>
    </div>
    <div
      slot="header-right"
      class="article-dialog__close-btn"
      @click="closeDialog"
    >
      <span>close</span>
      <simple-svg
        :filepath="CrossIcon"
        width="32px"
        height="32px"
        fill="#28646E"
        stroke="transparent"
      />
    </div>

    <slot />

  </base-dialog>
</template>


<script>
import BaseDialog from '~/components/dialogs/BaseDialog';

import CrossIcon from '~/assets/icons/cross.svg';

export default {
  name: 'article-dialog',
  components: {
    BaseDialog,
  },
  props: {
    isShow: {
      type: Boolean,
      default: true,
    },
    isCenter: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      CrossIcon,
      isShowDialog: false,
    };
  },
  watch: {
    isShow(v) {
      this.isShowDialog = v;

      // prevent background from scrolling when dialog is opened
      const body = document.querySelector('body');
      if (v) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = 'auto';
        this.$emit('update:isShow', v);
      }
    },
    isShowDialog(isShowDialog) {
      this.$emit('update:isShow', isShowDialog);
    },
  },
  beforeDestroy() {
    const body = document.querySelector('body');
    body.style.overflow = 'auto';
  },
  methods: {
    closeDialog() {
      this.$emit('update:isShow', false);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

$dialog-top-margin: 40px;

.article-dialog {
  width: 816px;

  &:not(.article-dialog--center) {
    @media (min-width: 600px + 1px) {
      max-height: calc(100% - #{$dialog-top-margin});
      margin-top: $dialog-top-margin;
    }
  }

  :global(.lc-section-header) {
    border-bottom: 2px solid $gray-e6;

    @media (min-width: 600px + 1px) {
      min-height: 78px;
      padding: 32px 48px 20px;
    }

    @media (max-width: 600px) {
      padding: 24px 8px 16px;
    }
  }

  :global(.lc-section-header:before) {
    content: none;
  }

  :global(.left) {
    max-width: 70%;

    font-size: 18px;
  }

  &__title { overflow: hidden;

    white-space: nowrap;
    text-overflow: ellipsis;
    }

  &__close-btn {
    display: flex;
    align-items: center;

    cursor: pointer;

    color: $like-green;

    font-size: 18px;

    span {
      margin-top: -2px;
      padding: 8px;
    }
  }
}
</style>

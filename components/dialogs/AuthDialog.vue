<template>
  <base-dialog
    :is-show="true"
    :md-props="{
      mdClickOutsideToClose: true,
      mdCloseOnEsc: true,
      mdFullscreen: false,
      mdClosed: onClosed,
      mdClickOutside: onClosed,
    }"
    class="auth-dialog"
    @update:isShow="onUpdateIsShow"
  >

    <md-button @click="prevTab">Prev</md-button>
    <md-button @click="nextTab">Next</md-button>

    <div
      :style="contentStyle"
      class="auth-dialog__content"
    >
      <div
        ref="tabContainer"
        :style="tabContainerStyle"
        class="auth-dialog__tab-container"
      >

        <div class="auth-dialog__tab">
          <div class="lc-dialog-container-1">
            <sign-in-form />
          </div>
        </div>

        <div class="auth-dialog__tab">
          <register-form />
        </div>

      </div>
    </div>

  </base-dialog>
</template>


<script>
import BaseDialog from '~/components/dialogs/BaseDialog';
import SignInForm from './AuthDialogContent/SignIn';
import RegisterForm from './AuthDialogContent/Register';

export default {
  name: 'auth-dialog',
  components: {
    BaseDialog,
    SignInForm,
    RegisterForm,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    header: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowDialog: this.isShow,

      currentTabIndex: 0,
      contentStyle: {},
    };
  },
  computed: {
    tabContainerStyle() {
      const translateXPercent = Math.max(this.currentTabIndex, 0) * -100;
      return {
        transform: `translateX(${translateXPercent}%)`,
      };
    },
  },
  watch: {
    isShow(isShow) {
      this.isShowDialog = isShow;
    },
    isShowDialog(isShowDialog) {
      this.$emit('update:isShow', isShowDialog);
    },
    currentTabIndex(index) {
      this.setContentStyle(index);
    },
  },
  mounted() {
    // Hack to recompute contentStyle
    this.setContentStyle(this.currentTabIndex);
  },
  methods: {
    setContentStyle(index) {
      const style = {};

      if (this.$refs.tabContainer) {
        // Explicitly set height for height transition
        const childNode = this.$refs.tabContainer.childNodes[index];
        style.height = `${childNode.offsetHeight}px`;
      }

      this.contentStyle = style;
    },
    nextTab() {
      const max = this.$refs.tabContainer.childNodes.length - 1;
      this.currentTabIndex = Math.min(this.currentTabIndex + 1, max);
    },
    prevTab() {
      this.currentTabIndex = Math.max(this.currentTabIndex - 1, 0);
    },
    onConfirm() {
      this.isShowDialog = false;
      this.$emit('confirm');
      this.onClosed();
    },
    onCancel() {
      this.isShowDialog = false;
      this.$emit('cancel');
      this.onClosed();
    },
    onClosed() {
      this.$emit('closed');
    },
    onUpdateIsShow(isShow) {
      this.isShowDialog = isShow;
    },
  },
};
</script>


<style lang="scss" scoped>
@import '~assets/variables';

.lc-dialog {
  :global(.lc-dialog-header::before) {
    background: linear-gradient(252deg, #d2f0f0, #f0e6b4);
  }
}

.auth-dialog {
  &__content {
    overflow: hidden;

    transition: height 0.25s ease;
    will-change: height;
  }

  &__tab-container {
    position: relative;

    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;

    transition: transform 0.25s ease;
    will-change: transform;
  }

  &__tab {
    flex: 1 0 100%;

    width: 100%;
  }
}
</style>

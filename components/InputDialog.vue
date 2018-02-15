<template>
  <md-dialog
    :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title v-if="title">{{ title }}</md-dialog-title>
      <md-dialog-content v-if="content">
        <span class="span-dialog-content" v-html="content" />
      </md-dialog-content>
      <form id="dialogForm" @keydown.esc="onCancel" @submit.prevent="onConfirm">
        <md-dialog-content>
          <md-field>
            <label>
              {{ label }}
            </label>
            <md-input
              :type="type"
              v-model="inputText" />
          </md-field>
        </md-dialog-content>
        <section>
          <md-button id="btn-confirm" class="md-primary" type="submit" form="dialogForm">
            {{ $t('General.button.confirm') }}
          </md-button>
          <md-button id="btn-cancel" class="md-primary" @click="onCancel" form="dialogForm">
            {{ $t('General.button.cancel') }}
          </md-button>
        </section>
      </form>
    </div>
  </md-dialog>
</template>

<script>
export default {
  name: 'input-dialog',
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
  data() {
    return {
      showDialog: false,
      inputText: '',
    };
  },
  methods: {
    onCancel() {
      this.showDialog = false;
    },
    onConfirm() {
      this.$emit('confirm', this.inputText);
      this.showDialog = false;
    },
    onInputText() {
      this.showDialog = true;
      this.inputText = this.text;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/dialog";

.md-dialog-container {
  .title-bar {
    background-image: linear-gradient(252deg, #d2f0f0, #f0e6b4);
  }

  .span-dialog-content {
    color: #28646e;
  }

  .dialog-content {
    > form {
      > section {
        display: flex;
        flex-direction: column;

        #btn-cancel {
          background-color: $like-gradient-3;
          color: $like-white;
        }

        #btn-confirm {
          background-color: $like-green;
          color: $like-white;
        }
      }
    }
  }
}
</style>

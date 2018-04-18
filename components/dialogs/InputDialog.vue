<template>
  <md-dialog
    class="input-dialog"
    :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title v-if="title">
        {{ title }}
      </md-dialog-title>

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
              v-model="inputText"
              required />
          </md-field>

          <span class="span-md-field-hint" v-if="getInfoIsError && getInfoMsg">
            <md-icon>error</md-icon>
            Error: {{ getInfoMsg }}
          </span>
        </md-dialog-content>

        <section>
          <material-button id="btn-confirm" type="submit" form="dialogForm">
            {{ $t('General.button.confirm') }}
          </material-button>
          <material-button id="btn-cancel" @click="onCancel" form="dialogForm">
            {{ $t('General.button.cancel') }}
          </material-button>
        </section>
      </form>
    </div>

  </md-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

import MaterialButton from '@/components/MaterialButton';

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
  components: {
    MaterialButton,
  },
  data() {
    return {
      showDialog: false,
      inputText: '',
    };
  },
  computed: {
    ...mapGetters([
      'getInfoIsError',
      'getInfoMsg',
    ]),
  },
  methods: {
    onCancel() {
      this.showDialog = false;
    },
    onConfirm() {
      this.$emit('confirm', this.inputText);
    },
    onInputText() {
      this.showDialog = true;
      this.inputText = this.text;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/dialog";

.input-dialog {
  .title-bar {
    background-image: linear-gradient(252deg, $like-light-blue, $like-gradient-1);
  }

  .span-dialog-content {
    color: $like-green;
  }

  .span-md-field-hint {
    font-size: 10px;
    color: $like-red;
  }

  #dialogForm {
    > section {
      display: flex;
      flex-direction: column;

      #btn-cancel {
        background-color: $like-gradient-3;
      }
    }
  }
}
</style>

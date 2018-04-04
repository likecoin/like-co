<template>
  <input-dialog
    ref="inputDialog"
    :text="email"
    type="email"
    :title="$t('Dialog.emailInput.title')"
    :content="$t('Dialog.emailInput.content')"
    :label="$t('Dialog.emailInput.label')"
    @confirm="onInputDialogConfirm" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { logTrackerEvent } from '@/util/EventLogger';
import InputDialog from '~/components/dialogs/InputDialog';
import User from '@/util/User';

export default {
  name: 'email-dialog',
  props: {
    emailRef: {
      default: '',
    },
  },
  components: {
    InputDialog,
  },
  data() {
    return {
      email: '',
    };
  },
  computed: {
    ...mapGetters([
      'getInfoIsError',
      'getInfoMsg',
      'getUserInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'newUser',
      'sendVerifyEmail',
    ]),
    onCancel() {
      this.$refs.inputDialog.showDialog = false;
    },
    show(email) {
      if (email) this.email = email;
      this.$nextTick(() => this.$refs.inputDialog.onInputText());
    },
    async onInputDialogConfirm(inputText) {
      if (this.email !== inputText) {
        this.email = inputText;
        await this.updateEmail();
      }
      await this.sendVerifyEmail({ id: this.getUserInfo.user, ref: this.emailRef || '' });
      logTrackerEvent(this, 'RegFlow', 'StartEmailVerify', 'click confirm after enter email and the email is valid', 1);
      this.$emit('submit', this.inputText);
      this.$refs.inputDialog.showDialog = false;
    },
    async updateEmail() {
      const userInfo = {
        user: this.getUserInfo.user,
        displayName: this.getUserInfo.displayName,
        wallet: this.getUserInfo.wallet,
        email: this.email,
      };
      const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.signKYC'));
      return this.newUser(data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/dialog";

.md-dialog-container {
  .title-bar {
    background-image: linear-gradient(252deg, #d2f0f0, #f0e6b4);
  }

  .span-dialog-content {
    color: #28646e;
  }

  .span-md-field-hint {
    font-size: 10px;
    color: #ff0000;
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

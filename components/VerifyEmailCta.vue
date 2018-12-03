<template>
  <div
    v-bind="$testID('VerifyEmailCTA')"
    class="lc-flex verify-email-cta"
  >
    <div class="verify-email-cta__image">
      <simple-svg
        :filepath="EmailIcon"
        class="verify-email-cta__image-icon"
        fill="28646e"
      />
    </div>
    <div class="lc-bg-gray-1 verify-email-cta__text">
      <div class="lc-font-size-32 lc-font-weight-300 verify-email-cta__title">
        {{ $t('In.verifyEmailCta.title') }}
      </div>
      <i18n
        tag="div"
        class="lc-font-size-16 lc-font-weight-normal verify-email-cta__label"
        path="In.verifyEmailCta.description"
      >
        <span
          class="verify-email-cta__email"
          place="email"
        >{{ getUserInfo.email }}</span>
      </i18n>
      <div
        class="lc-font-size-8 lc-font-weight-normal lc-text-align-right verify-email-cta__cta"
        @click="onClickCTA"
      >
        {{ $t('In.verifyEmailCta.descriptionCTA') }}
      </div>
    </div>
    <verify-email-dialog
      ref="emailDialog"
      :email="getUserInfo.email"
      :email-ref="emailRef"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import VerifyEmailDialog from '~/components/dialogs/VerifyEmailDialog';

import EmailIcon from '@/assets/icons/fillable/email.svg';

export default {
  name: 'verify-email-cta',
  components: {
    VerifyEmailDialog,
  },
  props: {
    emailRef: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      EmailIcon,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
    ]),
  },
  methods: {
    onClickCTA() {
      this.$refs.emailDialog.show();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.verify-email-cta {
  display: flex;

  height: 240px;

  &__image {
    flex: 1;

    background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);
  }

  &__image-icon {
    width: 33.3%;
    height: 100%;
    margin: auto;
  }

  &__text {
    position: relative;

    flex: 2;
  }

  &__title {
    padding-top: 32px;
    padding-left: 32px;

    color: $like-dark-brown-2;
  }

  &__label {
    padding-top: 8px;
    padding-left: 32px;

    color: $like-gray-4;
  }

  &__email {
    color: $like-green;
  }

  &__cta {
    position: absolute;
    right: 48px;
    bottom: 24px;

    cursor: pointer;
    text-decoration: underline;

    color: $like-green;
  }
}

</style>

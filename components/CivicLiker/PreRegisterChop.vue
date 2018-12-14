<template>
  <div class="pre-register-chop">
    <div>
      <div class="pre-register-chop__trial">
        <lc-chop-trial
          :date="civicLikerUnlockDate"
          :size="164"
          :is-trialling="isRegistered"
          rotate-z="13"
        />
      </div>
      <div class="pre-register-chop__civic-liker">
        <lc-chop-civic-liker
          :size="110"
          rotate-z="-16"
          is-trial
        />
      </div>
      <div
        v-if="isShowCountdown"
        class="pre-register-chop__countdown"
      >
        <lc-chop-countdown
          :date="civicLikerUnlockDate"
          rotate-z="-12"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { CIVIC_LIKER_START_DATE } from '~/constant';

export default {
  name: 'pre-register-chop',
  props: {
    isRegistered: {
      type: [Boolean, String],
      default: false,
    },
    isShowCountdown: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    civicLikerUnlockDate() {
      return new Date(CIVIC_LIKER_START_DATE);
    },
  },
};
</script>

<style lang="scss" scoped>
.pre-register-chop {
  display: inline-block;

  > div {
    display: flex;

    > * {
      flex-shrink: 0;
    }
  }

  &__trial {
    padding: 16px 0 0;
  }

  &__civic-liker {
    margin-left: -70px;
    padding: 64px 0 0;
  }

  &__countdown {
    margin-left: -52px;
  }
}
</style>

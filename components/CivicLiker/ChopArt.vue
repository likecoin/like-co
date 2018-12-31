<template>
  <div :class="rootClass">
    <div>
      <div class="chop-art__civic-liker">
        <lc-chop-civic-liker
          :size="110"
          :is-beta="isStarted"
          rotate-z="-16"
          is-trial
        />
      </div>
      <div class="chop-art__trial">
        <lc-chop-civic-liker-rect
          :date="civicLikerUnlockDate"
          :size="164"
          :is-trialling="isRegistered"
          :is-beta="isStarted"
          is-trial
          rotate-z="13"
        />
      </div>
      <div
        v-if="!isStarted && isShowCountdown"
        class="chop-art__countdown"
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
  name: 'chop-art',
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
  data() {
    return {
      isStarted: Date.now() >= CIVIC_LIKER_START_DATE,
      civicLikerUnlockDate: new Date(CIVIC_LIKER_START_DATE),
    };
  },
  computed: {
    rootClass() {
      return [
        'chop-art',
        {
          'chop-art--pre-register': !this.isStarted,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.chop-art {
  display: inline-block;

  > div {
    display: flex;

    > * {
      flex-shrink: 0;
    }
  }

  &__trial {
    margin-left: -40px;
    padding: 16px 0 0;

    .chop-art--pre-register & {
      order: 1;
    }
  }

  &__civic-liker {
    padding: 64px 0 0;

    .chop-art--pre-register & {
      order: 2;

      margin-left: -70px;
    }
  }

  &__countdown {
    order: 3;

    margin-left: -52px;
  }
}
</style>

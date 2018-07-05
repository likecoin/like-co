<template>
  <div class="referral-stats md-layout">

    <div class="md-layout-item referral-stat-box">
      <span class="referral-stat-value">
        {{ pending }}
      </span>
      <hr>
      <span class="referral-stat-label">
        {{ $t('Edit.referral.pending') }}
      </span>
    </div>

    <div class="md-layout-item referral-stat-box">
      <span class="referral-stat-value verified">
        {{ verified }}
      </span>
      <hr>
      <span class="referral-stat-label verified">
        <img :src="TickIcon">
        {{ $t('Edit.referral.verified') }}
      </span>
    </div>

  </div>
</template>

<script>
import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'referral-stats',
  props: {
    pending: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      TickIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.referral-stat-box {
  display: flex;
  flex-direction: column;
  justify-content: center;

  text-align: center;

  @media (min-width: 768px + 1px) {
    margin-left: 24px;
  }

  hr {
    height: 1px;
    margin: 12px;

    border: 0;
    background-color: $like-gray-3;
  }

  .verified {
    color: $like-green-2;
  }
}

.referral-stat-value {
  font-size: 56px;
  font-weight: 300;
  line-height: 1;
}

.referral-stat-label {
  min-height: 40px;

  font-size: 14px;
}
</style>

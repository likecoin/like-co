<template>
  <div class="chop-art">
    <div>
      <div class="chop-art__civic-liker">
        <lc-chop-civic-liker
          :size="110"
          rotate-z="-16"
          is-beta
          is-trial
        />
      </div>
      <div class="chop-art__trial">
        <lc-chop-civic-liker-rect
          :size="164"
          :is-trialling="isRegistered"
          is-beta
          is-trial
          rotate-z="13"
        />
      </div>
    </div>
  </div>
</template>

<script>
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
  }

  &__civic-liker {
    padding: 64px 0 0;
  }
}
</style>

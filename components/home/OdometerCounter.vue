<template>
  <div class="odometer-counter">
    <template v-if="numStr !== '0' && !!numStr">
      <div
        v-for="i in numDigits"
        :key="`digit-${i}`"
        :style="{ height: `${digitHeight}px` }"
        class="odometer-counter__digit-container"
      >
        <div
          :style="{
            transform: `translateY(-${getValueDigit(i - 1) * digitHeight}px)`,
            fontSize: `${fontSize}px`
          }"
        >
          <!-- digit from 0 to 9 for digits -->
          <template
            v-if="isDigit(i - 1)"
          >
            <span
              v-for="j in 10"
              :key="`value-${j}`"
              :style="{
                lineHeight,
                height: `${digitHeight}px`
              }"
            >{{ j - 1 }}</span>
          </template>

          <!-- display non-digit directly -->
          <span
            v-else
            :style="{
              lineHeight,
              fontSize: `${fontSize}px`,
              height: `${digitHeight}px`
            }"
          >{{ getValueDigit(i - 1) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>


export default {
  props: {
    numStr: {
      type: String,
      default: '0',
    },
    fontSize: {
      type: Number,
      default: 38,
    },
    lineHeight: {
      type: Number,
      default: 1.15,
    },
  },
  computed: {
    numDigits() {
      return this.numStr.length;
    },
    digitHeight() {
      return this.fontSize * this.lineHeight;
    },
  },
  methods: {
    getValueDigit(index) {
      return this.numStr.charAt(index);
    },
    isDigit(index) {
      return !Number.isNaN(parseInt(this.getValueDigit(index), 10));
    },
  },
};
</script>

<style lang="scss" scoped>
.odometer-counter {
  display: flex;

  &__digit-container {
    overflow: hidden;

    width: auto;

    font-variant-numeric: oldstyle-nums;

    &:not(:first-child) {
      margin-left: -2px;
    }

    > div {
      display: flex;
      flex-direction: column;

      transition: width, transform 2s ease-in;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

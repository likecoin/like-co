<template>
  <div class="v2-stepper">
    <div
      v-for="i in total"
      :key="i"
      :class="[
        'v2-stepper__dot',
        {
          'v2-stepper__dot--completed': step > i,
          'v2-stepper__dot--active': step === i,
        }
      ]"
    />
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 3,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style>
.v2-stepper {
  display: grid;
  column-gap: 16px;
  grid-auto-flow: column;
}

.v2-stepper__dot {
  width: 8px;
  height: 8px;

  border-radius: 9999px;
  background-color: #EBEBEB;
}

.v2-stepper__dot.v2-stepper__dot--active {
  background-color: #50E3C2;
}

.v2-stepper__dot.v2-stepper__dot--completed {
  background-color: #9B9B9B;
}
</style>

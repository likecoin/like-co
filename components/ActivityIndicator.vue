<template>
  <svg
    class="activity-indicator"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="32"
  >
    <g
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="2"
    >
      <!-- eslint-disable vue/max-attributes-per-line -->
      <line x1="19.5" y1="9.94" x2="23.5" y2="3.01" />
      <line x1="22.06" y1="12.5" x2="28.99" y2="8.5" />
      <line x1="23" y1="16" x2="31" y2="16" />
      <line x1="22.06" y1="19.5" x2="28.99" y2="23.5" />
      <line x1="19.5" y1="22.06" x2="23.5" y2="28.99" />
      <line x1="16" y1="23" x2="16" y2="31" />
      <line x1="8.5" y1="28.99" x2="12.5" y2="22.06" />
      <line x1="3.01" y1="23.5" x2="9.94" y2="19.5" />
      <line x1="1" y1="16" x2="9" y2="16" />
      <line x1="3.01" y1="8.5" x2="9.94" y2="12.5" />
      <line x1="8.5" y1="3.01" x2="12.5" y2="9.94" />
      <line x1="16" y1="1" x2="16" y2="9" />
      <!-- eslint-enable vue/max-attributes-per-line -->
    </g>
  </svg>
</template>

<style lang="scss" scoped>
$duration: 3;
$count: 12;

@keyframes fade {
  0% {
    opacity: 1;
  }
  15% {
    opacity: 0;
  }
  70% {
    opacity: 1;
  }
}

.activity-indicator line {
  animation-name: fade;
  animation-duration: #{$duration}s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;

  @for $i from 1 through $count {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * $duration / $count}s;
    }
  }
}
</style>

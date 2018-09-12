/**
* A modified version of https://github.com/vuetifyjs/vuetify/blob/dev/src/components/Vuetify/mixins/breakpoint.ts
* usage ref: https://vuetifyjs.com/en/layout/breakpoints
*/

function getClientWidth() {
  if (typeof document === 'undefined') return 0;
  return Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0,
  );
}

function getClientHeight() {
  if (typeof document === 'undefined') return 0;
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0,
  );
}

export default {
  data: () => ({
    clientHeight: getClientHeight(),
    clientWidth: getClientWidth(),
    resizeTimeout: undefined,
  }),

  computed: {
    breakpoint() {
      if (!this.clientWidth) return { name: 'xl' };
      const xs = this.clientWidth < 600;
      const sm = this.clientWidth < 960 && !xs;
      const md = this.clientWidth < (1280 - 16) && !(sm || xs);
      const lg = this.clientWidth < (1920 - 16) && !(md || sm || xs);
      const xl = this.clientWidth >= (1920 - 16);

      const xsOnly = xs;
      const smOnly = sm;
      const smAndDown = (xs || sm) && !(md || lg || xl);
      const smAndUp = !xs && (sm || md || lg || xl);
      const mdOnly = md;
      const mdAndDown = (xs || sm || md) && !(lg || xl);
      const mdAndUp = !(xs || sm) && (md || lg || xl);
      const lgOnly = lg;
      const lgAndDown = (xs || sm || md || lg) && !xl;
      const lgAndUp = !(xs || sm || md) && (lg || xl);
      const xlOnly = xl;

      let name;
      switch (true) {
        case (xs):
          name = 'xs';
          break;
        case (sm):
          name = 'sm';
          break;
        case (md):
          name = 'md';
          break;
        case (lg):
          name = 'lg';
          break;
        default:
          name = 'xl';
          break;
      }

      return {
        // Definite breakpoint.
        xs,
        sm,
        md,
        lg,
        xl,

        // Useful e.g. to construct CSS class names dynamically.
        name,

        // Breakpoint ranges.
        xsOnly,
        smOnly,
        smAndDown,
        smAndUp,
        mdOnly,
        mdAndDown,
        mdAndUp,
        lgOnly,
        lgAndDown,
        lgAndUp,
        xlOnly,

        // For custom breakpoint logic.
        width: this.clientWidth,
        height: this.clientHeight,
      };
    },
  },
  created() {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', this.onResize, { passive: true });
  },

  beforeDestroy() {
    if (typeof window === 'undefined') return;

    window.removeEventListener('resize', this.onResize);
  },

  methods: {
    onResize() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = window.setTimeout(this.setDimensions, 200);
    },
    setDimensions() {
      this.clientHeight = getClientHeight();
      this.clientWidth = getClientWidth();
    },
  },
};

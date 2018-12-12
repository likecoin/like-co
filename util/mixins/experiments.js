export default function experimentsMixin(
  propName,
  expName,
  varName,
  isEligible = () => true,
) {
  return {
    computed: {
      [propName]() {
        if (!this.$exp || !isEligible(this)) return false;
        const { name, $activeVariants } = this.$exp;
        return name === expName
          && !!$activeVariants.find(variant => variant.name === varName);
      },
    },
  };
}

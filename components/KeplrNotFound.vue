<template>
  <div class="error-message">
    <div class="diver" />
    <i18n
      path="ISCNARWidget.error.keplrNotFound"
      tag="div"
    >
      <a
        v-t="$t('ISCNARWidget.error.extensionName')"
        place="keplr"
        class="error-message__link"
        :href="$t('ISCNARWidget.error.extensionLink')"
        target="_blank"
      />
    </i18n>
  </div>
</template>


<script>
export default {
  name: 'keplr-not-found',
};
</script>
<style lang="scss">
@import "~assets/variables";

.error-message {
  width: 100%;
  padding: 12px 32px;
  background-color: $like-gray-2;
  justify-content: flex-start;
  color: $like-red;
  font-size: 12px;

  &__link {
    text-decoration: underline;
  }
}
</style>

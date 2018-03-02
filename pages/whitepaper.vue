<template>
  <div>
    <popup-dialog
      :allowClose="true"
      :header="$t('WhitePaper.label.whitePaper')"
      :message="$t('WhitePaper.label.comingSoon')"
      :confirmText="$t('Verify.label.toIndex')"
      @onConfirm="goToMain"
    />
  </div>
</template>

<script>
import PopupDialog from '~/components/dialogs/PopupDialog';

export default {
  name: 'WhitePaper',
  layout: 'base',
  components: {
    PopupDialog,
  },
  methods: {
    goToMain() {
      this.$router.push({ name: 'index' });
    },
  },
};
</script>

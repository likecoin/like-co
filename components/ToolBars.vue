<template>
  <div class="toolbars">
    <popup-dialog :allowClose="false" header="Error" :message="getPopupError"/>
    <popup-dialog :allowClose="true" header="Info" :message="getPopupInfo"/>
    <loading-toolbar :isLoading="getIsLoading" :isInTransaction="getIsInTransaction"/>
    <error-toolbar :message="getErrorMsg" :icon="getErrorIcon"/>
  </div>
</template>
<script>
import ErrorToolbar from '~/components/ErrorToolbar';
import LoadingToolbar from '~/components/LoadingToolbar';
import PopupDialog from '~/components/PopupDialog';
import { mapGetters } from 'vuex';

export default {
  name: 'ToolBars',
  components: {
    LoadingToolbar,
    ErrorToolbar,
    PopupDialog,
  },
  computed: {
    ...mapGetters([
      'getErrorIcon',
      'getErrorMsg',
      'getPopupError',
      'getPopupInfo',
      'getIsLoading',
      'getIsInTransaction',
    ]),
  },
};
</script>
<style>
.toolbars {
  top: 0px;
  width: 100%;
  position: fixed;
  z-index: 999;
}
</style>
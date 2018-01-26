<template>
  <div class="toolbars">
    <popup-dialog v-if="!disableError" :allowClose="false" header="Error" :message="getPopupError"/>
    <popup-dialog :allowClose="true" header="Info" :message="getPopupInfo"/>
    <no-ssr><blocker-dialog :show="getIsPopupBlocking"/></no-ssr>
    <loading-toolbar :isLoading="getIsLoading" :isInTransaction="getIsInTransaction"/>
    <error-toolbar :message="getErrorMsg" :icon="getErrorIcon"/>
  </div>
</template>
<script>
import ErrorToolbar from '~/components/ErrorToolbar';
import LoadingToolbar from '~/components/LoadingToolbar';
import PopupDialog from '~/components/PopupDialog';
import BlockerDialog from '~/components/BlockerDialog';
import { mapGetters } from 'vuex';

export default {
  name: 'ToolBars',
  props: ['disableError'],
  components: {
    LoadingToolbar,
    ErrorToolbar,
    PopupDialog,
    BlockerDialog,
  },
  computed: {
    ...mapGetters([
      'getErrorIcon',
      'getErrorMsg',
      'getPopupError',
      'getPopupInfo',
      'getIsLoading',
      'getIsInTransaction',
      'getIsPopupBlocking',
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
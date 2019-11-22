<template>
  <div>
    <h1>{{ $t('GetApp.title') }}</h1>
    <div>
      <a
        :href="getLikerLandAppURL"
        @click="onClickDownloadApp"
      >
        {{ $t('GetApp.button.downloadNow') }}
      </a>
    </div>
    <div>
      <a
        :href="getLikerLandURL"
        @click="onClickContinue"
      >
        {{ $t('GetApp.button.continueToWeb') }}
      </a>
    </div>
    <div>
      insert image here
    </div>
  </div>
</template>


<script>
import { getLikerLandAppURL, getLikerLandURL } from '@/util/api/api';
import { checkIsMobileClient } from '~/util/client';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'home',
  computed: {
    getLikerLandAppURL,
    getLikerLandURL,
  },
  mounted() {
    if (!checkIsMobileClient()) {
      this.$router.push({ name: 'index' });
    }
  },
  methods: {
    onClickDownloadApp() {
      logTrackerEvent(this, 'GetApp', 'ClickDownloadApp', 'ClickDownloadApp', 1);
    },
    onClickContinue() {
      logTrackerEvent(this, 'GetApp', 'ClickContinueToWeb', 'ClickContinueToWeb', 1);
    },
  },
};
</script>

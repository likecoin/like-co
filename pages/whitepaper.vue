<template>
  <div class="lc-container-1 lk-whitepaper-page">
    <div class="lc-container-2">
      <div class="lc-container-3">

        <ul class="document-list">
          <li>
            <md-button class="onepager-btn" @click="openOnepager()">
              {{ $t('Whitepaper.Button.onepager') }}
            </md-button>
          </li>
          <li>
            <md-button class="whitepaper-btn" @click="openWhitepaper()">
              {{ $t('Whitepaper.Button.whitepaper') }}
            </md-button>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'WhitePaper',
  layout: 'defaultWithHeader',
  methods: {
    openWhitepaper() {
      window.location.href = '/likecoin-whitepaper-en.pdf';
    },
    openOnepager() {
      window.location.href = '/likecoin-onepager-en.pdf';
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/index";
@import "~assets/default";

.document-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  margin: 48px 0 0;
  padding: 0;

  list-style: none;

  > * {
    padding: 10px;
  }

  .md-button {
    min-width: 240px;

    color: $like-white;
    background-color: $like-green;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }
}
</style>

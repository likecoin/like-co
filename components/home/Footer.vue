<template>
  <footer>
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3">
          <a>{{ $t('Home.Footer.button.about') }}</a>
          <a>{{ $t('Home.Footer.button.support') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'home-footer',
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

footer {
  .lc-container-3 {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    a {
      padding: 0 8px;
      color: #6b6b6b;
    	font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>

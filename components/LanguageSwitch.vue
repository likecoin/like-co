<template>
  <md-menu
    :class="['language-switch', className]"
    md-size="small"
    md-align-trigger>
    <md-button md-menu-trigger>en</md-button>

    <md-menu-content>
      <md-button>ch</md-button>
      <md-button>ja</md-button>
    </md-menu-content>
  </md-menu>
</template>

<script>
export default {
  name: 'language-switch',
  props: ['className'],
};
</script>


<style lang="scss" scoped>
@import "../assets/index";

.language-switch {
  margin: 0 6px;

  cursor: pointer;

  > .md-button {
    min-width: 32px;
    height: 32px;
    width: 32px;

    color: $like-green;

    overflow: hidden;
    border-radius: 50%;
  }
}

.md-menu-content {
  :global(.md-list) {
    padding: 0;
  }
  :global(.md-button) {
    margin: 0;
  }
}

@media (max-width: 600px) {
  .language-switch {
    > .md-button {
      font-size: 20px;
    }
  }
}
</style>

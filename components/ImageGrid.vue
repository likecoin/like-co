<template>
  <div class="lc-image-grid">
    <div>

      <ul>
        <li v-for="item in items">

          <a
            :href="item.link || item.src"
            :data-lightbox="lightboxId"
            :data-title="item.title"
            target="_blank">
            <img :src="item.src" />
          </a>

        </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: 'image-grid',
  props: [
    'items',
    'lightboxId',
  ],
};
</script>


<style lang="scss" scoped>
@import "~assets/index";

.lc-image-grid {
  * + & {
    margin-top: 20px;
  }

  ul {
    list-style: none;
    margin: 0 8px;
    padding: 16px;
    background-color: white;
    border-radius: 6px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex-shrink: 0;
      height: 150px;
      margin: 16px;

      a, img {
        display: block;
        height: 100%;
      }
      a {
        transition: transform .2s ease-out;

        &:hover {
          transform: scale(1.02);
        }
      }
    }
  }
}
</style>

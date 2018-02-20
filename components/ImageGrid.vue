<template>
  <div class="lc-image-grid">
    <div>

      <ul>
        <li v-for="item in items">

          <a
            :href="item.link || item.src"
            :data-lightbox="item.isLightBox ? lightboxId : null"
            :data-title="item.title"
            target="_blank"
            rel="noopener">
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

  > div {
    margin: 0 auto;
  }

  ul {
    list-style: none;
    margin: 0 8px;
    padding: 16px;
    background-color: white;
    border-radius: 6px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    li {
      flex-shrink: 0;
      padding: 16px;
      width: calc(100% * 1/4);

      @media (max-width: 1244px) {
        width: calc(100% * 1/3);
      }
      @media (max-width: 768px) {
        width: calc(100% * 1/2);
      }
      @media (max-width: 540px) {
        width: 100%;
      }

      a, img {
        display: block;
        margin: 0 auto;
        max-width: 180px;
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

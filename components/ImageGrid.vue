<template>
  <div class="lc-image-grid">
    <div>

      <ul>
        <li v-for="(item, index) in items">

          <a
            :href="!item.isLightBox && item.link"
            @click="item.isLightBox && openLightBox(index)"
            target="_blank"
            rel="noopener">
            <img :src="item.src" />
          </a>

        </li>
      </ul>

      <no-ssr>
        <lightbox
          class="lc-image-grid_lightbox"
          ref="lightbox"
          :images="images"
          :showLightBox="false"
          :showThumbs="false"
        ></lightbox>
      </no-ssr>

    </div>
  </div>
</template>


<script>
import Lightbox from '@likecoin/vue-image-lightbox';

export default {
  name: 'image-grid',
  components: {
    Lightbox,
  },
  props: [
    'items',
    'lightboxId',
  ],
  data() {
    const images = [];
    const imagesMap = {};

    this.items.forEach((item, index) => {
      if (item.isLightBox) {
        imagesMap[index] = images.length;
        images.push({
          src: item.link,
          caption: item.title,
        });
      }
    });

    return {
      images,
      imagesMap,
    };
  },
  methods: {
    openLightBox(index) {
      this.$refs.lightbox.showImage(this.imagesMap[index]);
    },
  },
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

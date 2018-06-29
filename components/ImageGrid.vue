<template>
  <div class="lc-image-grid">
    <div>

      <ul>
        <li
          v-for="item in items"
          :key="item.id"
        >

          <a
            :href="!item.isLightBox && item.link"
            target="_blank"
            rel="noopener"
            @click="item.isLightBox && openLightBox(item.id)"
          >
            <img v-lazy="item.src">
          </a>

        </li>
      </ul>

      <no-ssr>
        <portal to="light-box">
          <lightbox
            ref="lightbox"
            :images="images"
            :showLightBox="false"
            :showThumbs="false"
            class="lc-image-grid_lightbox"
          />
        </portal>
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

    this.items.forEach((item) => {
      if (item.isLightBox) {
        imagesMap[item.id] = images.length;
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
    openLightBox(id) {
      const index = this.imagesMap[id];
      if (index !== undefined && this.$refs.lightbox) {
        this.$refs.lightbox.showImage(index);
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

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
    padding: 0;
    background-color: white;
    border-radius: 6px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    li {
      position: relative;

      flex-shrink: 0;

      padding: 16px 8px;
      width: calc(100% * 1/4);

      @media (max-width: 1244px) {
        width: calc(100% * 1/3);
      }
      @media (max-width: 768px) {
        width: calc(100% * 1/2);
      }
      @media (max-width: 480px) {
        width: 100%;
      }

      a {
        display: block;
        position: relative;

        margin: 0 auto;
        padding-top: #{118px / 256px * 100%};
        width: 100%;
        max-width: 256px;
        max-height: 118px;
        box-sizing: border-box;

        cursor: pointer;
      }

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        object-fit: contain;
        object-position: center;

        transition: transform .2s ease-out;

        &:hover {
          transform: translateY(-2%);
        }
      }
    }
  }
}
</style>

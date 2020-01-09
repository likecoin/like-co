<template>
  <div
    :class="{
      'lc-image-grid': true,
      'lc-image-grid--narrow': isNarrow,
    }"
  >
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
            <img
              v-lazy="item.src"
              :class="{ 'no-border': !!item.isHideBorder }"
            >
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
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    isNarrow: {
      type: Boolean,
      default: false,
    },
  },
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

    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    margin: 0 8px;
    padding: 0;

    list-style: none;

    li {
      position: relative;

      flex-shrink: 0;

      width: calc(100% * 1 / 4);

      padding: 16px 8px;

      @media (max-width: 1244px) {
        width: calc(100% * 1 / 3);
      }
      @media (max-width: 768px) {
        width: calc(100% * 1 / 2);
      }
      @media (max-width: 480px) {
        width: 100%;
      }

      a {
        position: relative;

        display: block;

        box-sizing: border-box;
        width: 100%;

        margin: 0 auto;
        padding-top: #{90px / 190px * 100%};

        cursor: pointer;
      }

      img {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        transition: transform .2s ease-out;

        object-fit: cover;
        object-position: center;

        border-radius: 16px;

        &:not(.no-border) {
          border: 2px solid $gray-e6;
        }

        &:hover {
          transform: translateY(-2%);
        }
      }
    }
  }

  &.lc-image-grid--narrow {
    ul > li {
      width: calc(100% * 1 / 3);

      > a {
        padding-top: #{90px / 256px * 100%};
      }
    }
  }
}
</style>

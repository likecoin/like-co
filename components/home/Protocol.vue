<template>
  <section class="lc-container-1 lc-protocol">
    <div class="lc-container-2">
      <block-section
        title="LikeCoin Protocol">
        <div class="details">
          <div class="description">
            We enable attribution and cross-application collaboration on creative contents. With our unique footprint technology and LikeRank algorithm, we trace derivative work and reward creators by proof of creativity.
          </div>
          <div class="image md-xsmall-hide">
            <!-- <img src="http://www.pngmart.com/files/3/Sun-Transparent-Background.png" /> -->
          </div>
        </div>
        <div class="layers">
          <div
            :class="`layer layer-${i + 1}`"
            v-for="(layer, i) in layers"
            key="i">
            <div
              class="title"
              :style="`z-index: ${4 - i}`">
              <img :src="imgUrl(`layer-${i + 1}.svg`)" />
              <span>{{ $t(`Home.Protocol.layer.${layer.key}.title`)}}</span>
            </div>
            <div class="examples-container">
              <div class="examples">
                <div
                  v-for="(example, j) in layer.examples"
                  key="j">
                  {{ $t(`Home.Protocol.layer.${layer.key}.example.${example}`) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </block-section/>
    </div>
  </section>
</template>

<script>
import BlockSection from '~/components/BlockSection';

const images = require.context('../../assets/home');
const imgUrl = path => images(`./${path}`);

const layers = [
  {
    key: 'provider',
    examples: ['oice', 'ccImages', 'media'],
  },
  {
    key: 'service',
    examples: ['button', 'store', 'token'],
  },
  {
    key: 'eth',
    examples: ['contract', 'fingerprint', 'metadata'],
  },
  {
    key: 'ipfs',
    examples: ['oice', 'cc', 'stock'],
  },
];


export default {
  name: 'protocol',
  components: {
    BlockSection,
  },
  data() {
    return {
      layers,
    };
  },
  methods: {
    imgUrl,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.lc-protocol {
  margin-top: 84px;

  .block-section :global(.section-content) {
    padding-bottom: 0;
  }

  .details {
    display: flex;
    flex-direction: row;

    .description {
      flex: 2;
    }

    .image {
      flex: 1;
      img {
        width: 190px;
        height: 190px;
      }
    }
  }

  .layers {
    margin-top: 40px;

    .layer {
      position: relative;

      display: flex;
      flex-direction: row;

      min-height: 80px;

      &:not(:first-child) {
        .examples-container {
          border-top: 1px solid #e6e6e6;
        }
      }

      &.layer-2 {
        .title span {
          font-weight: bold;
          color: $like-dark-brown-2;
        }

        .examples-container {
          font-weight: bold;
          background-image: linear-gradient(88deg, rgba(210, 240, 240, .4), rgba(210, 240, 240, .4) 27%, rgba(240, 230, 180, .4) 81%, rgba(240, 230, 180, .4), rgba(247, 247, 247, .4));
        }
      }

      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        
        flex-shrink: 0;
        width: 300px;

        span {
          position: absolute;

          margin-top: -4px;
          margin-left: -6px;

          color: $like-white;

          font-size: 18px;
          font-weight: 600;
        }
        img {
          position: absolute;
        }
      }

      .examples-container {
        display: flex;
        align-items: center;
        flex: 1;
        flex-direction: column;

        margin-left: -144px;
        padding-left: 144px;

        color: $like-gray-5;

        font-size: 14px;

        .examples {
          display: flex;
          align-items: center;
          flex-direction: row;

          width: 100%;
          height: 100%;
          margin-top: -6px;

          > div {
            flex: 1;

            padding: 6px;
          }
        }

      }
    }
  }
}
</style>

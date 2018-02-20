<template>
  <section class="lc-container-1 lc-protocol">
    <div class="lc-container-2">

      <div class="block-section road-map-container">

        <!-- Section title -->
        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-title">
              {{ $t('Home.Protocol.title') }}
            </div>
          </div>
        </div>

        <div class="lc-container-3">
          <div class="lc-container-4">
            <div class="section-content">
              <div class="protocol-container">

                <!-- <div class="details">
                  <div class="description">
                    {{ $t('Home.Protocol.content') }}
                  </div>
                  <div class="image md-xsmall-hide">
                    <img :src="likeCoinIcon" />
                  </div>
                </div> -->

                <div class="layers md-xsmall-hide">
                  <div
                    :class="`layer layer-${i + 1}`"
                    v-for="(layer, i) in layers"
                    :key="i">

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
                          :key="j">
                          {{ $t(`Home.Protocol.layer.${layer.key}.example.${example}`) }}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-3 layers-mobile-container">
          <div class="layers-section">
            <div class="layers-mobile">
              <div
                :class="`layer layer-${i + 1}`"
                v-for="(layer, i) in layers"
                :key="i">
                <div class="title">
                  <span>{{ $t(`Home.Protocol.layer.${layer.key}.title`)}}</span>
                </div>
                <div
                  class="examples-container"
                  :style="`z-index: ${4 - i}`">
                  <div class="examples">
                    <img :src="imgUrl(`layer-${i + 1}.svg`)" />
                    <ul>
                      <li
                        v-for="(example, j) in layer.examples"
                        :key="j">
                        {{ $t(`Home.Protocol.layer.${layer.key}.example.${example}`) }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div/>
    </div>
  </section>
</template>

<script>
import BlockSection from '~/components/BlockSection';

import likeCoinIcon from '~/assets/home/protocol-likecoin.svg';


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
      likeCoinIcon,
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
        width: 100%;
        padding: 0 40px;
        margin-top: -88px;
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

          > div {
            flex: 1;

            padding: 6px;
          }
        }

      }
    }
  }
}

@media (min-width: 601px) {
  .layers-mobile {
    display: none;

    .layer {
      display: flex;
    }
  }
}

@media (max-width: 600px) {
  body {
    .lc-protocol {
      margin-top: 48px;
    }

    .protocol-container {
      .details .description {
        padding-bottom: 24px;
      }
    }
  }
}


body .layers-mobile-container {
  padding: 0;
  background-color: $like-white;
  .section-content {
    padding-top: 0;
  }
}
.layers-mobile {
  margin-top: -10px;
  padding-bottom: 50px;
  background-color: white;

  .layer {
    position: relative;

    .title {
      position: absolute;
      font-size: 14px;
      font-weight: 600;
      color: $like-dark-brown-2;
      width: 30%;
      flex-shrink: 0;

      padding: 8px 0 0 24px;
    }

    .examples-container {
      $layer-best-width: 400px;

      position: relative;
      display: flex;
      align-items: center;

      max-width: $layer-best-width;
      height: 100px;
      margin-left: 17%;

      > * {
        width: 100%;
      }

      .examples {
        z-index: 5;
        padding-bottom: 10px;
        padding-right: 25px;

        color: $like-white;

        font-size: 12px;

        @media (min-width: 376px) {
          text-align: center;
          min-width: $layer-best-width;
        }
        @media (max-width: 375px) {
          padding-left: 40%;
        }

        img {
          display: block;

          position: absolute;
          top: -20px;
          left: 0;
          right: 0;

          height: 180px;

          object-fit: cover;
          object-position: left top;
        }

        ul {
          position: relative;
          list-style: none;
          padding: 0;
          margin: 0;
          margin-top: 50px;
          line-height: 1.2;

          li + li {
            margin-top: 4px;
          }
        }
      }
    }

    &.layer-2 {
      .examples ul {
        font-weight: 600;
        color: $like-dark-brown-2;
      }

      background-image: linear-gradient(257deg, rgba(210, 240, 240, .4), rgba(240, 230, 180, .4));
    }
  }
}
</style>

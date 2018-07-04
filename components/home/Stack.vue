<template>
  <section class="lc-container-0 lc-likecoin-stack" id="tech">
    <div class="lc-container-1">

      <div class="lc-container-header">
        <div class="lc-container-2 lc-container-header-overlay">
          <div class="lc-container-3 lc-bg-gray-1 lc-mobile-hide" />
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-container-header-title">
                <h1 class="lc-font-size-32 lc-mobile">
                  {{ $t('Home.Stack.title') }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lc-container-2">

        <div class="lc-container-3 lc-bg-gray-1 lc-padding-vertical-32 lc-mobile-hide">
          <div class="lc-container-4">
            <div class="likecoin-stack-container">

              <!-- <div class="content">
                <div class="description">
                  {{ $t('Home.Stack.content') }}
                </div>
                <div class="image md-xsmall-hide">
                  <img :src="likeCoinIcon" />
                </div>
              </div> -->

              <div class="likecoin-stack">
                <div
                  :class="`layer layer-${i + 1}`"
                  v-for="(layer, i) in layers"
                  :key="i">

                  <div
                    class="title"
                    :style="`z-index: ${4 - i}`">
                    <img :src="imgUrl(`layer-${i + 1}.png`)" />
                    <span>{{ $t(`Home.Stack.layer.${layer.key}.title`)}}</span>
                  </div>

                  <div class="examples-container">
                    <div class="examples">
                      <div
                        v-for="(example, j) in layer.examples"
                        :key="j">
                        {{ $t(`Home.Stack.layer.${layer.key}.example.${example}`) }}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="likecoin-stack-mobile-container lc-padding-vertical-16 lc-mobile-show">

          <div class="likecoin-stack-mobile">
            <div
              :class="`layer layer-${i + 1}`"
              v-for="(layer, i) in layers"
              :key="i">

              <div class="title">
                <span>{{ $t(`Home.Stack.layer.${layer.key}.title`)}}</span>
              </div>

              <div
                class="examples-container"
                :style="`z-index: ${4 - i}`">
                <div class="examples">

                  <img :src="imgUrl(`layer-${i + 1}.png`)" />

                  <ul>
                    <li
                      v-for="(example, j) in layer.examples"
                      :key="j">
                      {{ $t(`Home.Stack.layer.${layer.key}.example.${example}`) }}
                    </li>
                  </ul>

                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>


<script>
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
  name: 'likecoin-stack',
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
@import "~assets/variables";

$layer-best-width: 400px;

.lc-likecoin-stack {
  .content {
    display: flex;
    flex-direction: row;

    .description {
      flex: 2;
    }

    .image {
      flex: 1;

      img {
        width: 100%;
        margin-top: -88px;
        padding: 0 40px;
      }
    }
  }
}

.likecoin-stack {
  padding-top: 14px;
  padding-bottom: 12px;

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

    &.layer-1 {
      .title span {
        font-weight: bold;
      }

      .examples-container {
        font-weight: bold;
      }
    }

    &.layer-2 {
      .title span {
        color: $like-dark-brown-2;

        font-weight: bold;
      }

      .examples-container {
        background-image: linear-gradient(
          88deg,
          rgba(210, 240, 240, .4),
          rgba(210, 240, 240, .4) 27%,
          rgba(240, 230, 180, .4) 81%,
          rgba(240, 230, 180, .4),
          rgba(247, 247, 247, .4)
        );

        font-weight: bold;
      }
    }

    .title {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      justify-content: center;

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

        max-width: 288px;
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

.likecoin-stack-mobile {
  overflow: hidden;

  padding-top: 6px;
  padding-bottom: 44px;

  .layer {
    position: relative;

    .title {
      position: absolute;

      flex-shrink: 0;

      width: 30%;
      padding: 8px 0 0 24px;

      color: $like-dark-brown-2;

      font-size: 14px;
      font-weight: 600;
    }

    .examples-container {
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

        padding-right: 25px;
        padding-bottom: 10px;

        color: $like-white;

        font-size: 12px;

        @media (min-width: 376px) {
          min-width: $layer-best-width;

          text-align: center;
        }
        @media (max-width: 375px) {
          padding-left: 40%;
        }

        img {
          position: absolute;
          top: -20px;
          right: 0;
          left: 0;

          display: block;

          height: 180px;

          object-fit: cover;
          object-position: left top;
        }

        ul {
          position: relative;

          margin: 0;
          margin-top: 50px;
          padding: 0;

          list-style: none;

          line-height: 1.2;

          li + li {
            margin-top: 4px;
          }
        }
      }
    }

    &.layer-2 {
      background-image: linear-gradient(257deg, rgba(210, 240, 240, .4), rgba(240, 230, 180, .4));

      .examples ul {
        color: $like-dark-brown-2;

        font-weight: 600;
      }
    }
  }
}
</style>

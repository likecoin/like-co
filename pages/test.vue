<template>
  <div class="lc-container-1 likee-list-page">
    <div class="lc-container-2">
      <like-form>
        <template slot="header-right">
          <a
            class="lc-underline"
            href="https://like.co/"
            rel="noopener noreferrer"
            target="_blank"
          >
            About LikeCoin
          </a>
        </template>

        <span class="lc-color-like-dark-brown-2 lc-font-size-20">
          {{ numOfLikes }} Like from {{ likees.length }} people for "LikeCoin June 2018 Highlights"
        </span>

        <div
          :class="['likee-list', 'lc-margin-top-8', { expand: isShowAll }]"
          :style="{ maxHeight: `${Math.ceil(likees.length / 2) * 74}px` }"
        >

          <div
            v-for="(likee, index) in likees"
            :key="index"
            class="user-avatar"
          >
            <img :src="likee.avatar">
            <span>{{ likee.displayName }}</span>
          </div>

          <transition name="lc-transition-default">
            <div
              v-if="!isShowAll"
              class="overflow-overlay"
            />
          </transition>
        </div>

        <div
          class="lc-margin-top-12 lc-text-align-center"
        >
          <md-button
            v-if="!isShowAll"
            class="lc-color-like-green"
            @click="isShowAll = true"
          >
            show more
          </md-button>
        </div>
      </like-form>
    </div>
  </div>
</template>


<script>
import LikeForm from '~/components/LikeForm';

export default {
  name: 'white-paper',
  layout: 'narrowWithHeader',
  components: {
    LikeForm,
  },
  asyncData() {
    const likees = [
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
      {
        avatar: 'https://storage.googleapis.com/likecoin-foundation.appspot.com/likecoin_store_user_mileswong_main?GoogleAccessId=firebase-adminsdk-eyzut@likecoin-foundation.iam.gserviceaccount.com&Expires=2430432000&Signature=v1Yc0vrIpSep%2Fc80erfTkuhOUIVPaQ%2Bq%2BufXtO1cE7%2FN6NoYGBh%2FXs6OYlFwFLF8VGpkxXB51sH5AyEn4vfeYJBD2zKWeHfJZsIn3whhRb1PEzgaPUMgKtliWM96z5tBKTm5N2D%2BYj9VJHpvbDc9iHW7Zky3TWfljdgg8SONRP816NyNT33DubvX0X2yLYLeg%2FHydXi%2Fz7xQH%2F17IWFm5n7n0vQ%2Be%2B350jnJu2kM0TCsY5%2BWBsXO2RvsFdEBwuv%2FMpC87pBKDs8%2FLQ2RI8YMr1jvvsL1lRDIrLY04yrHPBLZ1NpiaygPlmOnCtZVXfUcXSBowcY4CqVWt%2FhWXjJDpQ%3D%3D',
        displayName: 'Miles Wong',
      },
    ];
    return {
      isShowAll: likees.length <= 8,
      numOfLikes: 177,
      likees,
    };
  },
  data() {
    return {
      isShowAll: false,
    };
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.user-avatar {
  padding-top: 16px;
  padding-bottom: 8px;

  border-bottom: 1px solid #e6e6e6;

  img {
    width: 48px;
    height: 48px;

    border-radius: 50%;
    background-color: $like-white;
  }

  span {
    margin-left: 12px;

    color: $like-green;

    font-size: 18px;
    font-weight: 600;
  }
}

.likee-list-page {
  .md-button {
    text-decoration: underline;
  }
}

.likee-list {
  position: relative;

  display: flex;
  overflow: hidden;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  transition: max-height 0.25s ease-out;

  &:not(.expand) {
    max-height: 272px !important;
  }

  > * {
    width: calc(50% - 16px);
  }

  .overflow-overlay {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 48px;

    background-image: linear-gradient(to bottom, rgba(247, 247, 247, 0), $like-gray-1);
  }
}
</style>

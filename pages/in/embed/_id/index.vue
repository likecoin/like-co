<template>
  <div>
    <img :src="avatar" />
    <span>{{ displayName }}</span>
    <img :src="LIKE_BTN_IMG_URL"
         alt="like-button"
         width="200"
         height="100">
  </div>
</template>

<script>
import { LIKE_BTN_IMG_URL } from '~/constant/';
import { apiGetUserMinById } from '@/util/api/api';

export default {
  name: 'embed',
  layout: 'embed',
  data() {
    return {
      LIKE_BTN_IMG_URL,
      id: '',
      displayName: '',
      avatar: '',
    };
  },
  asyncData({ params }) {
    return apiGetUserMinById(params.id)
      .then((res) => {
        const {
          displayName,
          avatar,
        } = res.data;
        return {
          id: params.id,
          displayName,
          avatar,
        };
      })
      .catch(err => ({ id: err }));
  },
};
</script>

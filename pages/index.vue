<script>
import { getLikeCoAboutURL } from '@/util/api/api';

export default {
  fetch({ redirect }) {
    redirect(302, getLikeCoAboutURL());
  },
};
</script>

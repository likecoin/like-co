<script>
import { getLikeCoAboutURL } from '@/util/api/api';

export default {
  fetch({ redirect }) {
    redirect(301, getLikeCoAboutURL());
  },
};
</script>

<script>
import { getLikerLandCreatorsURL } from '@/util/api/api';

export default {
  fetch({ redirect }) {
    redirect(301, getLikerLandCreatorsURL());
  },
};
</script>

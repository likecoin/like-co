<script>
export default {
  asyncData({ params, redirect }) {
    redirect({ path: '/in/bonus#earn', query: { selectedMission: params.id } });
    return {};
  },
};
</script>

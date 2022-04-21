<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in-settings', params, query });
  },
};
</script>

<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in-tx-id', params, query });
  },
};
</script>

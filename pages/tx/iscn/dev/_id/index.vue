<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in-tx-iscn-dev-id', params, query });
  },
};
</script>

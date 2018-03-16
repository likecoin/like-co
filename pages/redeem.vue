<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in-redeem', params, query });
  },
};
</script>

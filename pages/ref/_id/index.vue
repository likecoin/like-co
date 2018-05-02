<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'in-tokensale', params, query: { ...query, from: params.id } });
  },
};
</script>

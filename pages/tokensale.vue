<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in-tokensale', params, query });
  },
};
</script>

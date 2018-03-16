<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in-whitepaper', params, query });
  },
};
</script>

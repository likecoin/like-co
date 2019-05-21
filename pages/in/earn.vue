<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in-creator', params, query });
  },
};
</script>

<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(301, { name: 'in', params, query });
  },
};
</script>

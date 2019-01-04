<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'in-civic', params, query });
  },
};
</script>

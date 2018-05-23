<script>
export default {
  fetch({
    redirect,
    params,
    query,
  }) {
    redirect(302, {
      name: 'in-register',
      params,
      query: { ...query, from: params.id },
    });
  },
};
</script>

<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'in-in-widget-iscn', params, query });
  },
};
</script>

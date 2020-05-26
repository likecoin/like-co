<script>
export default {
  fetch({ redirect, query }) {
    redirect(302, { name: 'in-getapp', query: { utm_source: 'matters', ...query } });
  },
};
</script>

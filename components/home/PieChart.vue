<script>
/* eslint-disable */

import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  name: 'pie-chart',
  props: ['data', 'options'],
  mounted() {
    this.renderChart(this.data, this.options);
  },
  watch: {
    data(data) {
      this.$data._chart.destroy();
      this.renderChart(this.data, this.options);
    },
  },
};
</script>

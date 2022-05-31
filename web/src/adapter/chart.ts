import * as echarts from 'echarts';
import { ECharts, EChartsCoreOption } from 'echarts';

export default class Chart {
    chart: ECharts;
    constructor(ref: HTMLElement, options: EChartsCoreOption) {
        this.chart = echarts.init(ref);
        this.chart.setOption(options);
    }

    refresh(options: EChartsCoreOption) {
        this.chart.setOption(options);
    }
}

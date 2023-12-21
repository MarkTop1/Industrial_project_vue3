<!-- 雷达图 -->
<template>
  <el-card>
    <template #header> 服务器效能图 </template>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";

const props = defineProps({
  id: {
    type: String,
    default: "radarChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});

const options = {
  grid: {
    left: "2%",
    right: "2%",
    bottom: "10%",
    containLabel: true,
  },
  legend: {
    x: "center",
    y: "bottom",
    data: ["服务器001", "服务器002", "服务器003"],
    textStyle: {
      color: "#999",
    },
  },
  radar: {
    // shape: 'circle',
    radius: "60%",
    indicator: [
      { name: "温度" },
      { name: "流量" },
      { name: "液位" },
      { name: "状态比" },
      { name: "氧含量" },
      { name: "资源比" },
    ],
  },
  series: [
    {
      name: "Budget vs spending",
      type: "radar",
      itemStyle: {
        borderRadius: 6,
        color: function (params: any) {
          //自定义颜色
          const colorList = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C"];
          return colorList[params.dataIndex];
        },
      },
      data: [
        {
          value: [400, 345, 123, 234, 400, 144],
          name: "预定数量",
        },
        {
          value: [300, 133, 300, 342, 300, 152],
          name: "下单数量",
        },
        {
          value: [132, 321, 132, 412, 123, 421],
          name: "发货数量",
        },
      ],
    },
  ],
};

onMounted(() => {
  const chart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  chart.setOption(options);

  window.addEventListener("resize", () => {
    chart.resize();
  });
});
</script>

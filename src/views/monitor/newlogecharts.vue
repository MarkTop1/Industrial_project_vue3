<template>
  <el-card>
    <template #header> 实时监测图 </template>
    <div
        id="my-echart"
        class="my-echart"
        style="width: 1000px; height: 500px"
    ></div>
  </el-card>

</template>

<script>
import * as echarts from "echarts";
import mqtt from 'mqtt/dist/mqtt';

export default {
  data() {
    return {
      jsonData: {
        time: "2023-12-15 11:32:44",
        Data: [
          { name: "Stand-alone/Online button", value: "0" },
          { name: "MD456", value: "1.6" },
          { name: "MD456", value: "1.667200" },
          { name: "MQTT", value: "1" },
          { name: "E_Start", value: "0" },
          { name: "E_Stop", value: "0" },
          { name: "E_Reset", value: "0" },
          { name: "E_Machine_EMG", value: "1" },
          { name: "A_LED_Start", value: "0" },
          { name: "A_LED_Stop", value: "0" },
          { name: "MD50", value: "0.000000" },
          { name: "MD54", value: "0.000000" },
          { name: "MW62", value: "0" },
          { name: "MW64", value: "0" },
          { name: "MD256", value: "21.908001" },
          { name: "MD260", value: "0.000000" },
          { name: "MD356", value: "2.600000" },
          { name: "MD360", value: "0.000000" },
          { name: "MD460", value: "0.000000" },
          { name: "MD156", value: "0.000000" },
          { name: "MD160", value: "0.000000" },
          { name: "M80.2", value: "0" },
          { name: "M0.0", value: "0" },
          { name: "M0.1", value: "0" },
          { name: "M0.2", value: "0" }
        ]
      }
    };
  },

  mounted() {
    this.initChart();  // 初始化图表
    this.initMqtt();   // 初始化 MQTT 客户端
  },
  beforeDestroy() {
    this.client.end();  // 断开 MQTT 连接
    this.client = null;
    console.log('已经与mqtt客户端断开连接');
  },
  methods: {
    updatejsonData(data) {
      this.jsonData = data;  // 更新所有数据
      this.chart.setOption({
        series: [
          {
            name: '温度',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MD256') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)  // 将字符串转换为浮点数并保留两位小数
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          },
          {
            name: '压力',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MD456') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          },
          {
            name: '液位',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MQTT') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          },
          {
            name: '流量',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MD356') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          },
          {
            name: '实际温度',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MD260') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          },
          {
            name: '实际压力',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MD360') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          },
          {
            name: '实际液位',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MD460') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          },
          {
            name: '实际流量',
            type: 'line',
            stack: 'Total',
            data: this.jsonData.Data.map(item => {
              if (item.name === 'MD156') {
                return {
                  name: item.name,
                  value: parseFloat(item.value).toFixed(2)
                };
              } else {
                return null;  // 其他数据项暂时不展示
              }
            }),
            smooth: true
          }
        ]
      });
    },

    // MQTT Client
    initMqtt() {
      // 连接配置选项
      let options = {
        connectTimeout: 4000, // 超时时间
        // 认证信息
        clientId: 'EMQX-FROM-VUE', //不填默认随机生成一个ID
        username: 'admin', //用户名
        password: '123456' //密码
      }

      //调用连接的api
      // this.client = mqtt.connect('ws://192.168.192.142:8083/mqtt', options)
      this.client = mqtt.connect('ws://10.54.28.21:8083/mqtt', options)
      let topic = 'Topic/flexem/fbox/354221030004/system/MonitorData'

      this.client.subscribe(topic, {qos: 0}, (err) => {
            if (!err) {
              console.log(`主题为：“${topic}” 的消息订阅成功`)
            } else {
              console.log('消息订阅失败')
            }
          }
      )
      //连接成功
      this.client.on('connect', (e) => {
        console.log('连接成功', e)
      })
      //重连提醒
      this.client.on('reconnect', (error) => {
        console.log('正在重连', error)
      })
      //连接失败提醒
      this.client.on('error', (error) => {
        console.log('连接失败', error)
      })

      //消息抵达
      this.client.on('message', (topic, message) => {
        console.log(`收到来自：${topic}`);
        const data = JSON.parse(`${message}`);//接受到控制信号的数据
        console.log(data)
        this.updatejsonData(data);  // 调用 updateChartData 方法更新图表数据
      });
    },

    // 初始化图表格
    initChart() {
      this.chart = echarts.init(document.getElementById("my-echart"),);
      this.chart.setOption(
          {
            title: {
              text: '实时设备数据'
            },
            tooltip: {
              show: false,
              trigger: 'axis'
            },
            legend: {
              data: ['温度', '压力', '液位', '流量', '实际温度', '实际压力', '实际液位', '实际流量']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              // show: false,
              feature: {
                saveAsImage: {},
                restore: {},
                dataView:{}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '温度',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MD256') {
                    return {
                      name: item.name,
                      value: Math.round(parseFloat(item.value))
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              },
              {
                name: '压力',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MD456') {
                    return {
                      name: item.name,
                      value: parseFloat(item.value).toFixed(2)
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              },
              {
                name: '液位',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MQTT') {
                    return {
                      name: item.name,
                      value: parseFloat(item.value).toFixed(2)
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              },
              {
                name: '流量',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MD356') {
                    return {
                      name: item.name,
                      value: parseFloat(item.value).toFixed(2)
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              },
              {
                name: '实际温度',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MD260') {
                    return {
                      name: item.name,
                      value: parseFloat(item.value).toFixed(2)
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              },
              {
                name: '实际压力',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MD360') {
                    return {
                      name: item.name,
                      value: parseFloat(item.value).toFixed(2)
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              },
              {
                name: '实际液位',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MD460') {
                    return {
                      name: item.name,
                      value: parseFloat(item.value).toFixed(2)
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              },
              {
                name: '实际流量',
                type: 'line',
                stack: 'Total',
                data: this.jsonData.Data.map(item => {
                  if (item.name === 'MD156') {
                    return {
                      name: item.name,
                      value: parseFloat(item.value).toFixed(2)
                    };
                  } else {
                    return null;  // 其他数据项暂时不展示
                  }
                }),
                smooth: true
              }

            ]
          }

      );
    },
  },
};
</script>

<style scoped></style>

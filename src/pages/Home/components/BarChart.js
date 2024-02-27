import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const BarChart=(props)=>{
      // 1.确保有可用的dom元素
  const chartRef = useRef(null)
  useEffect(() => {
    // 2. 图表初始化生成图标实例对象
    const myChart = echarts.init(chartRef.current)
    // 3. 准备图表参数
    const option = {
      title:{text:props.title},
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    }
    // 3. 渲染参数
    myChart.setOption(option)
  })

  return (
    // 一定要设置容器的长和宽，否则不会渲染出来 
    <div ref={chartRef} style={{ width: '400px', height: '300px' }} />
  )
}

export default BarChart
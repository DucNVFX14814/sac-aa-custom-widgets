let getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function() {
    const template = document.createElement('template')
    template.innerHTML = `
        <style>
        #root {
          background-color: pink;
        }
        #placeholder {
          padding-top: 1em;
          text-align: center;
          font-size: 1.5em;
          color: white;
        }
        </style>
        <div id="root" style="width: 100%; height: 100%;">
          <div id="placeholder">Hello World</div>
        </div>
      `
    class SampleLifeExpectancy2 extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(template.content.cloneNode(true))

            this._root = this._shadowRoot.getElementById('root')
            this.addEventListener("click", () => {
                this.dispatchEvent(new Event("onClick"));
            });

            this._props = {}

            this.render()
        }

        onCustomWidgetResize(width, height) {
                this.render()
            }
            // ------------------
            // Scripting methods
            // ------------------
        async render() {
            await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

            const resultSet = this.myDataBinding
            console.log(resultSet)
            const datas = resultSet.data
            console.log(datas)
            const dataBinding = this.dataBindings.getDataBinding('myDataBinding')
            console.log(dataBinding)
            const dimentions = []
            const measures = []
            const myData = []
            for (let data of datas) {
                // dimentions.push(data.dimensions_0.id)
                // measures.push(data.measures_0.raw)
                myData.push({ value: data.measures_0.raw, name: data.dimensions_0.id })
            }
            console.log(dimentions)
            console.log(measures)
            const myChart = echarts.init(this._root)

            const option = {
                title: {
                    text: 'Demo Custom Widget',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    top: '7%',
                    left: 'center'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [{
                        name: 'Radius Mode',
                        type: 'pie',
                        radius: [20, 140],
                        center: ['25%', '50%'],
                        roseType: 'radius',
                        itemStyle: {
                            borderRadius: 5
                        },
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        },
                        data: myData
                    },
                    {
                        name: 'Area Mode',
                        type: 'pie',
                        radius: [20, 140],
                        center: ['75%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 5
                        },
                        data: myData
                    },
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: myData
                    }
                ]
            };

            myChart.setOption(option)
        }
    }

    customElements.define('com-sap-sac-sample-demo_data_binding_custom_widget', SampleLifeExpectancy2)
})()
let getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
        <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `;

  class BarRaceChart extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");
      this.addEventListener("click", () => {
        this.dispatchEvent(new Event("onClick"));
      });

      this._props = {version: "public.Actual", endYear: parseInt(new Date().getFullYear())};

      // this.render(this._prop);
    }

    onCustomWidgetResize() {
      this.render(this._props);
    }
    // ------------------
    // Scripting methods
    // ------------------
    async render(props) {
      this._root.innerHTML = ""

      console.log("Start Render");
      await getScriptPromisify("https://cdn.amcharts.com/lib/5/index.js");
      await getScriptPromisify("https://cdn.amcharts.com/lib/5/xy.js");
      await getScriptPromisify("https://cdn.amcharts.com/lib/5/themes/Animated.js");
      await getScriptPromisify("https://cdn.amcharts.com/lib/5/plugins/exporting.js");

      /**
       * ---------------------------------------
       * This demo was created using amCharts 5.
       *
       * For more information visit:
       * https://www.amcharts.com/
       *
       * Documentation is available at:
       * https://www.amcharts.com/docs/v5/
       * ---------------------------------------
       */

      // update props from parameter
      if (props.version) {
        this._props.version = props.version
      }
      if (props.endYear) {
        this._props.endYear = parseInt(props.endYear)
      }
      if (props.topRank) {
        this._props.topRank = parseInt(props.topRank)
      }
      console.log(this._props)
      // set stepDuration
      const stepDuration = 2000;
      // Data
      const allData = {}
      const dataBinding = this.dataBindings.getDataBinding('myDataBinding')
      console.log(dataBinding)
      const myDataBinding = this.myDataBinding
      console.log(myDataBinding)
      const data = myDataBinding.data
      console.log(data)
      const metadata = myDataBinding.metadata
      console.log(metadata)
      const measures = metadata.feeds.measures.values

      const dateFull = []
      const date = []
      const dimensions = []
      for (let dataRow of data) {
        if (dataRow.dimensions_2.id == this._props.version) {
          const dateId = dataRow.dimensions_0.id.slice(-7, -1)
          if (date.indexOf(dateId) == -1 && parseInt(dateId.slice(0, 4)) <= this._props.endYear) {
            date.push(dateId)
          }
          const dim = dataRow.dimensions_1.label
          if (dimensions.indexOf(dim) == -1) {
            dimensions.push(dim)
          }
        }
      }
      date.sort()
      dimensions.sort()
      
      const startDate = date[0], endDate = date[date.length - 1]

      for (const dateId of date) {
        allData[dateId] = {}

        const year = dateId.slice(0, 4)
        const month = parseInt(dateId.slice(4))
        dateFull.push({date: dateId, year : year, month: month, label: "T" + month + " " + year})
      }
      
      console.log(dateFull)
      for (let dataRow of data) {
        const dateId = dataRow.dimensions_0.id.slice(-7, -1)
        if (dataRow.dimensions_2.id == this._props.version && parseInt(dateId.slice(0, 4)) <= parseInt(this._props.endYear)) {
          
          const dim = dataRow.dimensions_1.label
          let totalValue = 0
          for (const measure of measures) {
            if (dataRow[measure].raw) {
              totalValue += dataRow[measure].raw
            } 
          }
          allData[dateId][dim] = totalValue
        }
      }
      /*
      allData = {
        2002: {
          Friendster: 0,
          Facebook: 0,
          Flickr: 0,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 0,
          Instagram: 0,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 0,
        },
        2003: {
          Friendster: 4470000,
          Facebook: 0,
          Flickr: 0,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 0,
          Instagram: 0,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 0,
        },
        2004: {
          Friendster: 5970054,
          Facebook: 0,
          Flickr: 3675135,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 0,
          Instagram: 0,
          MySpace: 980036,
          Orkut: 4900180,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 0,
        },
        2005: {
          Friendster: 7459742,
          Facebook: 0,
          Flickr: 7399354,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 9731610,
          Instagram: 0,
          MySpace: 19490059,
          Orkut: 9865805,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 1946322,
        },
        2006: {
          Friendster: 8989854,
          Facebook: 0,
          Flickr: 14949270,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 19932360,
          Instagram: 0,
          MySpace: 54763260,
          Orkut: 14966180,
          Pinterest: 0,
          Reddit: 248309,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 19878248,
        },
        2007: {
          Friendster: 24253200,
          Facebook: 0,
          Flickr: 29299875,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 29533250,
          Instagram: 0,
          MySpace: 69299875,
          Orkut: 26916562,
          Pinterest: 0,
          Reddit: 488331,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 143932250,
        },
        2008: {
          Friendster: 51008911,
          Facebook: 100000000,
          Flickr: 30000000,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 55045618,
          Instagram: 0,
          MySpace: 72408233,
          Orkut: 44357628,
          Pinterest: 0,
          Reddit: 1944940,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 294493950,
        },
        2009: {
          Friendster: 28804331,
          Facebook: 276000000,
          Flickr: 41834525,
          "Google Buzz": 0,
          "Google+": 0,
          Hi5: 57893524,
          Instagram: 0,
          MySpace: 70133095,
          Orkut: 47366905,
          Pinterest: 0,
          Reddit: 3893524,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 0,
          WeChat: 0,
          Weibo: 0,
          Whatsapp: 0,
          YouTube: 413611440,
        },
        2010: {
          Friendster: 0,
          Facebook: 517750000,
          Flickr: 54708063,
          "Google Buzz": 166029650,
          "Google+": 0,
          Hi5: 59953290,
          Instagram: 0,
          MySpace: 68046710,
          Orkut: 49941613,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 43250000,
          WeChat: 0,
          Weibo: 19532900,
          Whatsapp: 0,
          YouTube: 480551990,
        },
        2011: {
          Friendster: 0,
          Facebook: 766000000,
          Flickr: 66954600,
          "Google Buzz": 170000000,
          "Google+": 0,
          Hi5: 46610848,
          Instagram: 0,
          MySpace: 46003536,
          Orkut: 47609080,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 0,
          Twitter: 92750000,
          WeChat: 47818400,
          Weibo: 48691040,
          Whatsapp: 0,
          YouTube: 642669824,
        },
        2012: {
          Friendster: 0,
          Facebook: 979750000,
          Flickr: 79664888,
          "Google Buzz": 170000000,
          "Google+": 107319100,
          Hi5: 0,
          Instagram: 0,
          MySpace: 0,
          Orkut: 45067022,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 146890156,
          Twitter: 160250000,
          WeChat: 118123370,
          Weibo: 79195730,
          Whatsapp: 0,
          YouTube: 844638200,
        },
        2013: {
          Friendster: 0,
          Facebook: 1170500000,
          Flickr: 80000000,
          "Google Buzz": 170000000,
          "Google+": 205654700,
          Hi5: 0,
          Instagram: 117500000,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 0,
          Reddit: 0,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 293482050,
          Twitter: 223675000,
          WeChat: 196523760,
          Weibo: 118261880,
          Whatsapp: 300000000,
          YouTube: 1065223075,
        },
        2014: {
          Friendster: 0,
          Facebook: 1334000000,
          Flickr: 0,
          "Google Buzz": 170000000,
          "Google+": 254859015,
          Hi5: 0,
          Instagram: 250000000,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 0,
          Reddit: 135786956,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 388721163,
          Twitter: 223675000,
          WeChat: 444232415,
          Weibo: 154890345,
          Whatsapp: 498750000,
          YouTube: 1249451725,
        },
        2015: {
          Friendster: 0,
          Facebook: 1516750000,
          Flickr: 0,
          "Google Buzz": 170000000,
          "Google+": 298950015,
          Hi5: 0,
          Instagram: 400000000,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 0,
          Reddit: 163346676,
          Snapchat: 0,
          TikTok: 0,
          Tumblr: 475923363,
          Twitter: 304500000,
          WeChat: 660843407,
          Weibo: 208716685,
          Whatsapp: 800000000,
          YouTube: 1328133360,
        },
        2016: {
          Friendster: 0,
          Facebook: 1753500000,
          Flickr: 0,
          "Google Buzz": 0,
          "Google+": 398648000,
          Hi5: 0,
          Instagram: 550000000,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 143250000,
          Reddit: 238972480,
          Snapchat: 238648000,
          TikTok: 0,
          Tumblr: 565796720,
          Twitter: 314500000,
          WeChat: 847512320,
          Weibo: 281026560,
          Whatsapp: 1000000000,
          YouTube: 1399053600,
        },
        2017: {
          Friendster: 0,
          Facebook: 2035750000,
          Flickr: 0,
          "Google Buzz": 0,
          "Google+": 495657000,
          Hi5: 0,
          Instagram: 750000000,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 195000000,
          Reddit: 297394200,
          Snapchat: 0,
          TikTok: 239142500,
          Tumblr: 593783960,
          Twitter: 328250000,
          WeChat: 921742750,
          Weibo: 357569030,
          Whatsapp: 1333333333,
          YouTube: 1495657000,
        },
        2018: {
          Friendster: 0,
          Facebook: 2255250000,
          Flickr: 0,
          "Google Buzz": 0,
          "Google+": 430000000,
          Hi5: 0,
          Instagram: 1000000000,
          MySpace: 0,
          Orkut: 0,
          Pinterest: 246500000,
          Reddit: 355000000,
          Snapchat: 0,
          TikTok: 500000000,
          Tumblr: 624000000,
          Twitter: 329500000,
          WeChat: 1000000000,
          Weibo: 431000000,
          Whatsapp: 1433333333,
          YouTube: 1900000000,
        },
      };
      */
    //  console.log(date)
    //  console.log(dateFull)
      // console.log(allData)

      // Sum
      for (let date = startDate; date <= endDate;) {
        let previous = date - 1 
        if (date > 99999 && date % 100 == 1) {
          previous = date - 89
        }

        for (const dim of dimensions) {
          let previousValue
          if (allData[previous] && allData[previous][dim]) {
            previousValue = allData[previous][dim]
          } else {
            previousValue = 0
          }
          let dateValue = allData[date][dim]
          if (!dateValue) {
            dateValue = 0
          }

          allData[date][dim] = dateValue + previousValue
        } 

        if (date > 99999 && date % 100 == 12) {
          date += 89
        } else {
          date++   
        } 
      }

      console.log(allData)

      const dataExport = []

      for (const d in allData) {
        dataExport.push({Date: d, ...allData[d]})
      }

      console.log(dataExport)

      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      var root = am5.Root.new(this._root);

      // set exporting
      const exporting = am5plugins_exporting.Exporting.new(root, {
        menu: am5plugins_exporting.ExportingMenu.new(root, {}),
        filePrefix: "myChart",
        dataSource: dataExport,
        // numericFields: ["value", "value2"],
        // numberFormat: "#,###.00",
        // dateFields: ["date"],
        // dateFormat: "yyyy-MM-dd",
        // dataFields: {
        //   value: "Value (USD)",
        //   value2: "Value (EUR)",
        //   date: "Date"
        // },
        // dataFieldsOrder: ["value", "value", "date"],
        pngOptions: { 
          quality: 1.0,
          maintainPixelRatio: true
        },
        jpgOptions: {
          quality: 1.0,
          maintainPixelRatio: true
        }

      });

      exporting.get("menu").set("items", [{
        type: "format",
        format: "png",
        label: "Export Image"
      }, {
        type: "format",
        format: "xlsx",
        label: "Export Excel"
      }, {
        type: "separator"
      }, {
        type: "format",
        format: "print",
        label: "Print"
      }]);

      // set FPS
      root.fps = 60

      // remove logo
      root._logo.dispose();

      root.numberFormatter.setAll({
        numberFormat: "#a",

        // Group only into M (millions), and B (billions)
        bigNumberPrefixes: [
          { number: 1e3, suffix: "K" },
          { number: 1e6, suffix: "M" },
          { number: 1e9, suffix: "B" }
        ],

        // Do not use small number prefixes at all
        smallNumberPrefixes: [],
      });

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "none",
          wheelY: "none",
        })
      );

      // We don't want zoom-out button to appear while animating, so we hide it at all
      chart.zoomOutButton.set("forceHidden", true);

      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var yRenderer = am5xy.AxisRendererY.new(root, {
        minGridDistance: 20,
        inversed: true,
      });
      // hide grid
      yRenderer.grid.template.set("visible", false);

      var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0,
          categoryField: "network",
          renderer: yRenderer,
        })
      );

      var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 0,
          strictMinMax: true,
          extraMax: 0.1,
          renderer: am5xy.AxisRendererX.new(root, {}),
        })
      );

      xAxis.set("interpolationDuration", stepDuration / 12);
      xAxis.set("interpolationEasing", am5.ease.linear);

      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: "value",
          categoryYField: "network",
        })
      );

      // Rounded corners for columns
      series.columns.template.setAll({ cornerRadiusBR: 5, cornerRadiusTR: 5 });

      // Make each column to be of a different color
      series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      // Add label bullet
      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationX: 1,
          sprite: am5.Label.new(root, {
            text: "{valueXWorking.formatNumber('#.# a')}",
            fill: root.interfaceColors.get("alternativeText"),
            centerX: am5.p100,
            centerY: am5.p50,
            populateText: true,
          }),
        });
      });

      var label = chart.plotContainer.children.push(
        am5.Label.new(root, {
          text: startDate.toString,
          fontSize: "6em",
          opacity: 0.25,
          x: am5.p100,
          y: am5.p100,
          centerY: am5.p100,
          centerX: am5.p100,
        })
      );

      // Get series item by category
      function getSeriesItem(category) {
        for (var i = 0; i < series.dataItems.length; i++) {
          var dataItem = series.dataItems[i];
          if (dataItem.get("categoryY") == category) {
            return dataItem;
          }
        }
      }

      // Axis sorting
      function sortCategoryAxis() {
        // sort by value
        series.dataItems.sort(function (x, y) {
          return y.get("valueX") - x.get("valueX"); // descending
          //return x.get("valueX") - y.get("valueX"); // ascending
        });

        // go through each axis item
        am5.array.each(yAxis.dataItems, function (dataItem) {
          // get corresponding series item
          var seriesDataItem = getSeriesItem(dataItem.get("category"));

          if (seriesDataItem) {
            // get index of series data item
            var index = series.dataItems.indexOf(seriesDataItem);
            // calculate delta position
            var deltaPosition =
              (index - dataItem.get("index", 0)) / series.dataItems.length;
            // set index to be the same as series data item index
            if (dataItem.get("index") != index) {
              dataItem.set("index", index);
              // set deltaPosition instanlty
              dataItem.set("deltaPosition", -deltaPosition);
              // animate delta position to 0
              dataItem.animate({
                key: "deltaPosition",
                to: 0,
                duration: stepDuration / 2,
                easing: am5.ease.out(am5.ease.cubic),
              });
            }
          }
        });
        // sort axis items by index.
        // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
        yAxis.dataItems.sort(function (x, y) {
          return x.get("index") - y.get("index");
        });
      }

      var time = startDate;

      // update data with values each 1.5 sec
      var interval = setInterval(function () {
        if (time > 99999 && time % 100 == 12) {
          time += 89
        } else {
          time++   
        }

        if (time > endDate) {
          clearInterval(interval);
          clearInterval(sortInterval);
          // console.log(allData)
        }

        updateData();
      }, stepDuration);

      var sortInterval = setInterval(function () {
        sortCategoryAxis();
      }, 100);

      function setInitialData() {
        var d = allData[time];

        for (var n in d) {
          series.data.push({ network: n, value: d[n] });
          yAxis.data.push({ network: n });
        }
      }

      function updateData() {
        var itemsWithNonZero = 0;

        if (allData[time]) {
          for (const date of dateFull) {
            if (date.date == time) {
              label.set("text", date.label)
              break
            }
          }
        
          am5.array.each(series.dataItems, function (dataItem) {
            var category = dataItem.get("categoryY");
            var value = allData[time][category];
  
            if (value > 0) {
              itemsWithNonZero++;
            }

            dataItem.animate({
              key: "valueX",
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear,
            });
            dataItem.animate({
              key: "valueXWorking",
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear,
            });
          });
          
          let topRank = itemsWithNonZero
          if (props.topRank) {
            topRank = parseInt(props.topRank)
          }

          yAxis.zoom(0, topRank / yAxis.dataItems.length);
        }
      }

      setInitialData();
      setTimeout(function () {
        time++;
        updateData();
      }, 50);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);
      console.log("End Render")
    }
  }
  customElements.define("com-sap-sample-bar-race-chart", BarRaceChart);
})();
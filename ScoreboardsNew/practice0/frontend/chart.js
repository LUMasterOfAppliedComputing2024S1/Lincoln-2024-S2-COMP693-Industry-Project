// Total Sales
function initializeTotalSalesChart() {
  const xValues = ["Sales", "Unsold"];
  const yValues = [77, 23];
  const barColors = [
    "rgb(8, 176, 8)",
    "rgb(180, 180, 180)"
  ];

      const customPlugin = {
          id: 'centerText',
          beforeDraw: function(chart) {
            if (chart.config.type === 'doughnut') {
              var ctx = chart.ctx;
              var width = chart.width;
              var height = chart.height;
              var text1 = chart.config.options.plugins.centerText.text1;
              var text2 = chart.config.options.plugins.centerText.text2;
        
              // Set font size for both lines
              var fontSize1 = (height / 13).toFixed(2) + "px";
              var fontSize2 = (height / 7).toFixed(2) + "px";
        
              ctx.textBaseline = "middle";
              ctx.textAlign = "center";
        
              // First line ("Total Sales")
              ctx.font = fontSize1+ " Arial";
              var textX = Math.round(width / 2);
              var textY = Math.round(height / 2.4);
              ctx.fillText(text1, textX, textY);
        
              // Second line ("$2,595k")
              ctx.font = "bold " + fontSize2+ " Arial";
              textY = Math.round(height / 1.8);
              ctx.fillText(text2, textX, textY);
              }
          }
        };
    
        Chart.register(customPlugin);
    
        // Initialize the doughnut chart
        new Chart("totalSalesChart", {
          type: "doughnut",
          data: {
            datasets: [{
              backgroundColor: barColors,
              data: yValues
            }]
          },
          options: {
              cutout: '75%',
              responsive: true,               
              maintainAspectRatio: false,
              plugins: {
                  centerText: {
                    display: true,
                    text1: "Total Sales",
                    text2: "$2,595k"
                  }
                }
              }
        });
  }

    initializeTotalSalesChart()

// Total Stock
function initializeTotalStockChart() {
  const xStock = ["Other Stock","Dead Stock"];
  const yStock = [64,36];
  const stockColors = [
    "#08B008",
    "rgb(255, 0, 0)"
  ];

      const stockPlugin = {
          id: 'centerText', // Plugin ID
          beforeDraw: function(chart) {
            if (chart.config.type === 'doughnut') {
              var ctx = chart.ctx;
              var width = chart.width;
              var height = chart.height;
              var text1 = chart.config.options.plugins.centerText.text1;
              var text2 = chart.config.options.plugins.centerText.text2;
        
              // Set font size for both lines
              var fontSize1 = (height / 13).toFixed(2) + "px";
              var fontSize2 = (height / 7).toFixed(2) + "px";
        
              ctx.textBaseline = "middle";
              ctx.textAlign = "center";
        
              // First line ("Total Sales")
              ctx.font = fontSize1+ " Arial";
              var textX = Math.round(width / 2);
              var textY = Math.round(height / 2.4);
              ctx.fillText(text1, textX, textY);
        
              // Second line ("$2,595k")
              ctx.font = "bold " + fontSize2+ " Arial";
              textY = Math.round(height / 1.7);
              ctx.fillText(text2, textX, textY);
              }
          }
        };
    
        Chart.register(stockPlugin);
    
        // Initialize the doughnut chart
        new Chart("totalStockChart", {
          type: "doughnut",
          data: {
            datasets: [{
              backgroundColor: stockColors,
              data: yStock
            }]
          },
          options: {
              cutout: '75%',
              responsive: true,               
              maintainAspectRatio: false,
              plugins: {
                  centerText: {
                    display: true,
                    text1: "Total Stock",
                    text2: "$5,867k"
                  }
                }
              }
        });
}

initializeTotalStockChart()

//Graph
function openChartPopup() {
    var popup = window.open("", "ChartPopup", "width=1200,height=600");

    popup.document.write(`
        <html>
        <head>
            <title>Chart</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
            <h1>My Chart</h1>
            <canvas id="popupChart" style="width:100%;max-width:1200px;height:70%;max-height:800px;"></canvas>
            <script>
                // Define the chart data and render the chart
                const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
                new Chart("popupChart", {
                    type: "line",
                    data: {
                        labels: xValues,
                        datasets: [{
                            data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
                            borderColor: "grey",
                            fill: false
                        }, {
                            data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
                            borderColor: "green",
                            fill: false
                        }]
                    },
                    options: {
                        legend: { display: false }
                    }
                });
            </script>
        </body>
        </html>
    `);

    popup.document.close();
}
$(document).ready(function() {
    var newLineChart = {};
    var newPieChart = {};
    var newBarChart = {};

    dashboard();

    $("#insert-sale").click(function() {
        var salesMan = $("#vendor-select option:selected").val();
        var amount = parseInt($("#quantity").val());
        var date = moment($("#day-of-sale").val(), "YYYY-MM-DD").format("DD/MM/YYYY");
        if ((salesMan != "") && (amount != "") && (date != "Invalid date")) {
            sellPost(salesMan, amount, date);
        } else {
            alert("error");
        }
    });

    // *** FUNCTIONS ***
    function dashboard() {
        var apiSettings = {
            "url": "http://157.230.17.132:4030/sales",
            "method": "GET"
        };

        $.ajax(apiSettings).done(function(response) {
            var dataFromApi = response;

            var objLineChart = {};
            var objPieChart = {};
            var objBarChart = {};
            var arrayMonths = moment.months();
            for (var i = 0; i < dataFromApi.length; i++) {
                var singleObj = dataFromApi[i];
                var date = singleObj.date;
                var month = moment(date, "DD/MM/YYYY").get("M");
                var quarter = moment(date, "DD/MM/YYYY").quarter();

                if (objLineChart[month] === undefined) { // in case the key doesn't exist
                    objLineChart[month] = 0; //  then we create it and assign it the value 0
                }
                objLineChart[month] += parseInt(singleObj.amount); // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling

                var salesMan = singleObj.salesman;
                if (objPieChart[salesMan] === undefined) { // in case the key doesn't exist
                    objPieChart[salesMan] = 0; //  then we create it and assign it the value 0
                }
                objPieChart[salesMan] += parseInt(singleObj.amount); // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling

                if (objBarChart[quarter] === undefined) { // in case the key doesn't exist
                    objBarChart[quarter] = 0; //  then we create it and assign it the value 0
                }
                objBarChart[quarter] += parseInt(singleObj.amount); // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling
            }

            var labelsMonths = [];
            var dateAmount = [];
            for (var key in objLineChart) { // cycle in the Intermediate object to take the keys and transform them into 'labels' and the values (of that key) to transform them into 'data'
                labelsMonths.push(key);
                dateAmount.push(objLineChart[key]);
            }

            var labelsSalesMan = [];
            var salesManAmount = [];
            for (var key in objPieChart) { // cycle in the Intermediate object to take the keys and transform them into 'labels' and the values (of that key) to transform them into 'data'
                labelsSalesMan.push(key);
                salesManAmount.push((objPieChart[key]));
            }

            var salesTotal = arraySum(salesManAmount);

            for (var i = 0; i < salesManAmount.length; i++) {
                salesManAmount[i] = ((salesManAmount[i] / salesTotal) * 100).toFixed(2);
            }

            var labelsQuarters = [];
            var quarterAmount = [];
            for (var key in objBarChart) { // cycle in the Intermediate object to take the keys and transform them into 'labels' and the values (of that key) to transform them into 'data'
                labelsQuarters.push(key);
                quarterAmount.push(objBarChart[key]);
            }

            lineChart($('#sales-line-chart'), arrayMonths, 'Fatturato mensile (€)', '#007ED6', '0', dateAmount);
            pieChart($('#sales-pie-chart'), salesManAmount, ["#52D726", "#007ED6", "#FF7300", "#FF0000"], labelsSalesMan);
            barChart($('#sales-bar-chart'), ["Q1", "Q2", "Q3", "Q4"], 'Fatturato per Quarter (€)', '#007ED6', '#007ED6', quarterAmount);

            $.each(labelsSalesMan, function(index, value) {
                $('#vendor-select')
                    .append($("<option></option>")
                        .attr("value", value)
                        .text(value));
            });
        });
    };

    function arraySum(array) {
        return array.reduce(function(a, b) {
            return a + b
        }, 0);
    };

    function sellPost(salesMan, amount, date) {
        var settings = {
            "url": "http://157.230.17.132:4030/sales/",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                salesman: salesMan,
                amount: amount,
                date: date
            }),
        };
        $.ajax(settings).done(function(response) {
            dashboard();
        });
    };

    function lineChart(canvas, labels, label, borderColor, lineTension, data) {
        if ($.isEmptyObject(newLineChart)) {
            newLineChart = new Chart($(canvas), {
                type: 'line', // The type of chart we want to create
                data: { // The data for our dataset
                    labels: labels,
                    datasets: [{
                        label: label,
                        borderColor: borderColor,
                        lineTension: lineTension,
                        data: data
                    }]
                },
                options: { // Configuration options go here

                }
            });
        } else {
            newLineChart.data.labels = labels;
            newLineChart.data.datasets[0].data = data;
            newLineChart.update();
        }

    };

    function pieChart(canvas, data, backgroundColor, labels) {
        if ($.isEmptyObject(newPieChart)) {
            newPieChart = new Chart(canvas, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColor
                    }],

                    labels: labels
                }
            });
        } else {
            newPieChart.data.labels = labels;
            newPieChart.data.datasets[0].data = data;
            newPieChart.update();
        }
    };

    function barChart(canvas, labels, label, backgroundColor, borderColor, data) {
        if ($.isEmptyObject(newBarChart)) {
            newBarChart = new Chart(canvas, {
                type: 'bar', // The type of chart we want to create
                data: { // The data for our dataset
                    labels: labels,
                    datasets: [{
                        label: label,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        data: data
                    }]
                },
                options: {

                } // Configuration options go here
            });
        } else {
            newBarChart.data.labels = labels;
            newBarChart.data.datasets[0].data = data;
            newBarChart.update();
        }
    };

});

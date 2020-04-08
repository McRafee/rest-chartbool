$(document).ready(function() {
    dashboard();

$("#insert-sale").click(function(){

    var salesman = $("#vendor-select option:selected").text();
    var amount = $("#quantity").val();
    var date = $("#day-of-sale").val();
    alert(salesman + amount + date);
});
    // *** FUNCTIONS ***


    function dashboard() {
        var apiSettings = {
            "url": "http://157.230.17.132:4030/sales",
            "method": "GET"
        };

        $.ajax(apiSettings).done(function(response) {
            var dataFromApi = response;
            // console.log(dataFromApi); // debug

            var objLineChart = {};
            var objPieChart = {};
            var objBarChart = {};
            var arrayMonths = moment.months();
            for (var i = 0; i < dataFromApi.length; i++) {
                var singleObj = dataFromApi[i];
                var date = singleObj.date;
                var month = moment(date, "DD/MM/YYYY").get("M");
                var quarter = moment(date, "DD/MM/YYYY").quarter();
                 // console.log(quarter); //debug
                if (objLineChart[month] === undefined) { // in case the key doesn't exist
                    objLineChart[month] = 0; //  then we create it and assign it the value 0
                }
                // console.log(objLineChart); //debug
                objLineChart[month] += singleObj.amount; // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling

                var salesMan = singleObj.salesman;
                if (objPieChart[salesMan] === undefined) { // in case the key doesn't exist
                    objPieChart[salesMan] = 0; //  then we create it and assign it the value 0
                }
                objPieChart[salesMan] += singleObj.amount; // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling

                if (objBarChart[quarter] === undefined) { // in case the key doesn't exist
                    objBarChart[quarter] = 0; //  then we create it and assign it the value 0
                }

                objBarChart[quarter] += singleObj.amount; // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling


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
                // salesManAmount[i] = Math.round(((salesManAmount[i]/salesTotal)*100), -1);
                salesManAmount[i] = ((salesManAmount[i]/salesTotal)*100).toFixed(2);
            }

            var labelsQuarters = [];
            var quarterAmount = [];
            for (var key in objBarChart) { // cycle in the Intermediate object to take the keys and transform them into 'labels' and the values (of that key) to transform them into 'data'
                labelsQuarters.push(key);
                quarterAmount.push(objBarChart[key]);
            }

            var ctx = $('#sales-line-chart');
            var chart = new Chart(ctx, {
                type: 'line', // The type of chart we want to create
                data: { // The data for our dataset
                    labels: arrayMonths,
                    datasets: [{
                        label: 'Fatturato mensile (€)',
                        borderColor: '#007ED6',
                        lineTension: '0',
                        data: dateAmount
                    }]
                },
                options: {

                } // Configuration options go here
            });

            $.each(labelsSalesMan, function(index, value) {
                $('#vendor-select')
                .append($("<option></option>")
                    .attr("value",value)
                    .text(value));
                });

            var ctx2 = $('#sales-pie-chart');
            var chart2 = new Chart(ctx2, {
            type: 'pie',
            data: {
                datasets: [{
                    data: salesManAmount,
                    backgroundColor: ["#52D726", "#007ED6", "#FF7300", "#FF0000"]
                }],

                labels: labelsSalesMan
            }
            });

            var ctx3 = $('#sales-bar-chart');
            var chart3 = new Chart(ctx3, {
                type: 'bar', // The type of chart we want to create
                data: { // The data for our dataset
                    labels: ["Q1","Q2","Q3","Q4"],
                    datasets: [{
                        label: 'Fatturato per Quarter (€)',
                        backgroundColor: '#007ED6',
                        borderColor: '#007ED6',
                        data: quarterAmount
                    }]
                },
                options: {

                } // Configuration options go here
            });
        });

    }

    function arraySum(array){
        return array.reduce(function(a,b){
            return a + b
        }, 0);
    };
});

$(document).ready(function() {

    var apiSettings = {
        "url": "http://157.230.17.132:4030/sales",
        "method": "GET"
    };

    var dataFromApi;
    $.ajax(apiSettings).done(function(response) {
        dataFromApi = response;
        // console.log(dataFromApi); // debug

        var objLineChart = {};
        var objPieChart = {};
        var arrayMonths = moment.months();
        for (var i = 0; i < dataFromApi.length; i++) {
            var singleObj = dataFromApi[i];
            var date = singleObj.date;
            var month = moment(date, "DD/MM/YYYY").get("M");
            // console.log(month); //debug
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

        var ctx = $('#sales-line-chart');
        var chart = new Chart(ctx, {
            type: 'line', // The type of chart we want to create
            data: { // The data for our dataset
                labels: arrayMonths,
                datasets: [{
                    label: 'Fatturato mensile',
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                    borderColor: 'rgb(0, 68, 131)',
                    pointRadius: "0",
                    lineTension: '0',
                    data: dateAmount
                }]
            },
            options: {

            } // Configuration options go here
        });

        var ctx2 = $('#sales-pie-chart');
        var chart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            datasets: [{
                data: salesManAmount,
                backgroundColor: ["rgb(231, 150, 55)", "rgb(77, 227, 25)", "rgb(238, 236, 33)", "rgb(0, 68, 131)"]
            }],

            labels: labelsSalesMan
        }
        });

    });

    // *** FUNCTIONS ***
    function arraySum(array){
        return array.reduce(function(a,b){
            return a + b
        }, 0);
    };
});

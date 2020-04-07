$(document).ready(function() {

    var apiSettings = {
        "url": "http://157.230.17.132:4030/sales",
        "method": "GET"
    };

    var dataFromApi;
    $.ajax(apiSettings).done(function(response) {
        dataFromApi = response;
        console.log(dataFromApi); // debug

        var objToFill = {};
        var objToFill2 = {};
        var arrayMonths = moment.months();
        for (var i = 0; i < dataFromApi.length; i++) {
            var singleObj = dataFromApi[i];
            var date = singleObj.date;
            var month = moment(date, "DD/MM/YYYY").get("M");
            // console.log(month); //debug
            if (objToFill[month] === undefined) { // in case the key doesn't exist
                objToFill[month] = 0; //  then we create it and assign it the value 0
            }
            // console.log(objToFill); //debug
            objToFill[month] += singleObj.amount; // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling

            var salesMan = singleObj.salesman;
            if (objToFill2[salesMan] === undefined) { // in case the key doesn't exist
                objToFill2[salesMan] = 0; //  then we create it and assign it the value 0
            }
            objToFill2[salesMan] += singleObj.amount; // (now the key exists) and to its value we add that of the amount of the ith single object that we are cycling

        }
        // console.log(objToFill); //debug

        var labelsMonths = [];
        var dateAmount = [];

        var labelsSalesMan = [];
        var salesManAmount = [];

        for (var key in objToFill) { // cycle in the Intermediate object to take the keys and transform them into 'labels' and the values (of that key) to transform them into 'data'
            // console.log(key);
            labelsMonths.push(key);
            dateAmount.push(objToFill[key]);
        }

        for (var key in objToFill2) { // cycle in the Intermediate object to take the keys and transform them into 'labels' and the values (of that key) to transform them into 'data'
            // console.log(key);
            labelsSalesMan.push(key);
            salesManAmount.push((objToFill2[key]));
        }

        var salesTotal = arraySum(salesManAmount);
        // console.log(salesTotal);

        for (var i = 0; i < salesManAmount.length; i++) {
            salesManAmount[i] = Math.round(((salesManAmount[i]/salesTotal)*100), -1);
            // console.log(salesManAmount[i]);
        }



        console.log(labelsMonths);
        console.log(dateAmount);

        console.log(labelsSalesMan);
        console.log(salesManAmount);

        var ctx = $('#sales-line-chart');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: arrayMonths,
                datasets: [{
                    label: 'Fatturato mensile',
                    backgroundColor: 'rgba(0, 68, 131, 0.5)',
                    borderColor: 'rgb(0, 68, 131)',
                    data: dateAmount
                }]
            },

            // Configuration options go here
            options: {}
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

    function arraySum(array){
        return array.reduce(function(a,b){
            return a + b
        }, 0);
    };
});

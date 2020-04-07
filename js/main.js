$(document).ready(function() {

    var apiSettings = {
        "url": "http://157.230.17.132:4030/sales",
        "method": "GET"
    };

    var dataFromApi;
    $.ajax(apiSettings).done(function(response) {
        dataFromApi = response;
        console.log(dataFromApi); // debug

        var arrayMonths = moment.months();
        var objToFill = {};
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
        }
        // console.log(objToFill); //debug

        var labelsMonths = [];
        var dataAmount = [];

        for (var key in objToFill) { // cycle in the Intermediate object to take the keys and transform them into 'labels' and the values (of that key) to transform them into 'data'
            // console.log(key);
            labelsMonths.push(key);
            dataAmount.push(objToFill[key]);
        }
        // console.log(labelsMonths);
        // console.log(dataAmount);

        var ctx = $('#sales-line-graph');
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
                    data: dataAmount
                }]
            },

            // Configuration options go here
            options: {}
        });


    });



});

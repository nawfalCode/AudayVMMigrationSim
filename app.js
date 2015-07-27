var fs = require('fs');
const STATIC_THR_UNDERLOAD = 40;
const STATIC_THR_OVERLOAD = 80;
var records = JSON.parse(fs.readFileSync('data.js', 'utf8'));
console.log(records.length);

function getUnderLoad(data, noItems, thr) {
    var result = [];
    var donePM = [];
    for (var i = 0; i < noItems; i++) {
        if (donePM.indexOf(data[i].PM) === -1) {
            if (data[i].util <= thr) {
                result.push(data[i]);
                donePM.push(data[i].PM);
            }
        }
    }
    return (result);
}


function getOverLoad(data, noItems, thr) {

    var result = [];
    var donePM = [];
    for (var i = 0; i < noItems; i++) {
        if (donePM.indexOf(data[i].PM) === -1) {
            if (data[i].util >= thr) {
                result.push(data[i]);
                donePM.push(data[i].PM);
            }
        }
    }

    return (result);
}

function getMean(data) {
    var minPM = Math.min.apply(Math, data.map(function (o) {
        return (o.PM)
    }));
    var maxPM = Math.max.apply(Math, data.map(function (o) {
        return (o.PM)
    }));
    var minvalue;
    var sum = 0;
    for (var i = minPM; i < maxPM; i++) {
        minvalue = Number.MAX_VALUE;
        for (var j = 0; j < data.length; j++) {
            if (data[j].PM === i) {
                if (minvalue > data[j].util) {
                    minvalue = data[j].util;
                }
            }
        }
        sum += minvalue;
    }
    return (sum / (maxPM - minPM - 1));

}

function getMedian(data) {
    var minPM = Math.min.apply(Math, data.map(function (o) {
        return (o.PM)
    }));
    var maxPM = Math.max.apply(Math, data.map(function (o) {
        return (o.PM)
    }));
    var array = [];
    for (var i = minPM; i < maxPM; i++) {
        var minValue = Number.MAX_VALUE;
        for (var j = 0; j < data.length; j++) {
            if (data[j].PM === i) {
                if (minValue > data[j].util) {
                    minValue = data[j].util;
                }
            }
        }
        array.push(minValue);
    }
    return (array[Math.floor((maxPM - minPM - 1) / 2)]);
}


function main() {

    var listofresults = [];
    for (var k = 20; k <= 100; k += 20) {
        listofresults.push({
            vms: k,
            UnderStatic: getUnderLoad(records, k, STATIC_THR_UNDERLOAD).length,
            UnderDynamicMean: getUnderLoad(records, k, getMean(records)).length,
            UnderDynamicMedian: getUnderLoad(records, k, getMedian(records)).length,
            OverStatic: getOverLoad(records, k, STATIC_THR_OVERLOAD).length,
            OverDynamicMean: getOverLoad(records, k, getMean(records)).length,
            OverDynamicMedian: getOverLoad(records, k, getMedian(records)).length
        })
    }
    console.log(listofresults);
    listofresults = [];

    for (k = 20; k <= 100; k += 20) {
        //var objects = getUnderLoad(records, k, STATIC_THR_UNDERLOAD);
        var objects = records.slice(0, k);
        var randomIndex = Math.floor((Math.random() * objects.length));
        var indexMTCM = -1;
        var indexMPCM = -1;
        var minValue = Number.MAX_VALUE;
        console.log('the size is:' + objects.length);
        for (var i = 0; i < objects.length; i++) {
            if (minValue > objects[i].TCost) {
                minValue = objects[i].TCost;
                indexMTCM = objects[i].VM;
            }
        }
        minValue = Number.MAX_VALUE;
        for (i = 0; i < objects.length; i++) {
            if (minValue > objects[i].PCost) {
                minValue = objects[i].PCost;
                indexMPCM = objects[i].VM;
            }
        }
        /*
         * Get the RR Field
         * */
        var xsList = [],
            sList = [],
            lList = [],
            xlList = [];

        for (i = 0; i < objects.length; i++) {
            if (objects[i].Type === 'XS') {
                xsList.push(objects[i]);
            } else if (objects[i].Type === 'S') {
                sList.push(objects[i]);
            } else if (objects[i].Type === 'L') {
                lList.push(objects[i]);
            } else {
                xlList.push(objects[i]);
            }
        }
        var xsrand = Math.floor(Math.random() * xsList.length);
        var srand = Math.floor(Math.random() * sList.length);
        var lrand = Math.floor(Math.random() * lList.length);
        var xlrand = Math.floor(Math.random() * xlList.length);
        listofresults.push({
            vms: k,
            RS: randomIndex,
            RR: {XS: xsrand, S: srand, L: lrand, XL: xlrand},
            MTCM: indexMTCM,
            MPCM: indexMPCM
        });


    }
    console.log('*************************************************');
    console.log(listofresults);
}

main();
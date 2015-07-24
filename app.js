var fs = require('fs');
const STATIC_THR_UNDERLOAD = 40;
const STATIC_THR_OVERLOAD = 80;
var records = JSON.parse(fs.readFileSync('data.js', 'utf8'));
console.log(records.length);

function getUnderLoad(data, noItems, thr) {
    var sum = 0;
    var donePM = [];
    for (var i = 0; i < noItems; i++) {
        if (donePM.indexOf(data[i].PM) === -1) {
            if (data[i].util <= thr) {
                sum++;
                donePM.push(data[i].PM);
            }
        }
    };
    return (sum);
}


function getOverLoad(data, noItems, thr) {
    var sum = 0;
    var donePM = [];
    for (var i = 0; i < noItems; i++) {
        if (donePM.indexOf(data[i].PM) === -1) {
            if (data[i].util >= thr) {
                sum++;
                donePM.push(data[i].PM);
            }
        }
    };
    return (sum);
}

function getMean(data) {
    var minPM = Math.min.apply(Math, data.map(function(o) {
        return (o.PM)
    }));
    var maxPM = Math.max.apply(Math, data.map(function(o) {
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
    var minPM = Math.min.apply(Math, data.map(function(o) {
        return (o.PM)
    }));
    var maxPM = Math.max.apply(Math, data.map(function(o) {
        return (o.PM)
    }));
    var array = [];
    for (var i = minPM; i < maxPM; i++) {
        minvalue = Number.MAX_VALUE;
        for (var j = 0; j < data.length; j++) {
            if (data[j].PM === i) {
                if (minvalue > data[j].util) {
                    minvalue = data[j].util;
                }
            }
        }
        array.push(minvalue);
    }
    return (array[Math.floor((maxPM - minPM - 1) / 2)]);
}




function main() {

    var listofresults = [];
    for (var k = 20; k <= 100; k += 20) {
        listofresults.push({
            vms: k,
            UnderStatic: getUnderLoad(records, k, STATIC_THR_UNDERLOAD),
            UnderDynamicMean: getUnderLoad(records, k, getMean(records)),
            UnderDynamicMedian: getUnderLoad(records, k, getMedian(records)),
            OverStatic: getOverLoad(records, k, STATIC_THR_OVERLOAD),
            OverDynamicMean: getOverLoad(records, k, getMean(records)),
            OverDynamicMedian: getOverLoad(records, k, getMedian(records)),
        })
    }
    console.log(listofresults);
}

main();
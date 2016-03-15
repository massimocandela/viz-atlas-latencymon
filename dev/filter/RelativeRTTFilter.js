
define([
    "latencymon.env.utils"
], function(utils) {

    var RelativeRTTFilter = function (env) {

        this.manipulate = function (data) {
            var dataOut, minOfArray, item, n, length, maxItem, maxOfArray;

            dataOut = [];
            minOfArray = Infinity;
            maxOfArray = -Infinity;
            for (n = 0, length = data.length; n < length; n++) {
                item = data[n];
                if (item.min !== null && minOfArray > item.min) {
                    //minOfArray = Math.min(item.min, minOfArray);
                    minOfArray = item.min;
                }

                maxItem = item.max || item.avg || item.min;
                if (maxItem !== null && maxOfArray < maxItem) {
                    maxOfArray = maxItem;
                }
            }

            for (n=0,length=data.length; n<length; n++) {
                item = utils.lightClone(data[n]);

                item.original = {
                    min: item.min,
                    avg: item.avg,
                    max: item.max
                };

                item.min = (item.min !== null) ? ((item.min / minOfArray) * 100) - 100 : null;
                item.avg = (item.avg !== null) ? ((item.avg / minOfArray) * 100) - 100 : null;
                item.max = (item.max !== null) ? ((item.max / minOfArray) * 100) - 100 : null;
                dataOut.push(item);
            }

            return {data: dataOut, min: minOfArray, max: maxOfArray};
        };

        this.manipulate2 = function (data) {
            var dataOut, minOfArray, item, n, length;

            dataOut = [];
            minOfArray = Infinity;

            for (n = 0, length = data.length; n < length; n++) {
                item = data[n];
                if (item.min !== null) {
                    minOfArray = Math.min(item.min, minOfArray);
                }
            }

            for (n=0,length=data.length; n<length; n++) {
                //item = utils.lightClone(data[n]);
                item = data[n];

                item.min = (item.min !== null) ? ((item.min / minOfArray) * 100) - 100 : null;
                item.avg = (item.avg !== null) ? ((item.avg / minOfArray) * 100) - 100 : null;
                item.max = (item.max !== null) ? ((item.max / minOfArray) * 100) - 100 : null;
                dataOut.push(item);
            }

            return dataOut;
        };

    };

    return RelativeRTTFilter;
});
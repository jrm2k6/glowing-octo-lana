var Quicksort = (function() {
    function  setPivot(maxValue) {
        var pivot = Math.floor(Math.random() * maxValue);
        console.log("pivot ::", pivot);
        return pivot;
    }

    function quicksort(list) {

        if (list.length <= 1) {
            return list;
        } else {
            var pivot = setPivot(list.length);

            var valuePivot = list[pivot];

            var lower = [],
                    greater =[];

            list.splice(pivot,1);
            for (var i=0; i<list.length; i++) {
                if (list[i] < valuePivot) {
                    lower.push(list[i]);
                } else {
                    greater.push(list[i]);
                }
            }

            return [].concat(quicksort(lower),valuePivot,quicksort(greater));
        }
    }

    return {
        quicksort:quicksort
    };
})();


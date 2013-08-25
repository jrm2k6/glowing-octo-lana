var Explanation = function(){
    function showExplanationPivot(pivotNumber) {
        return "Pivot is : " + pivotNumber + ".\n";
    }

    function showExplanationsSubListsInf(pivotNumber, subListInf) {
        return "Generation of [" + subListInf.toString() + "] which contains only lower values than " + pivotNumber + ".\n";
    }

    function showExplanationsSubListsSup(pivotNumber, subListSup) {
        return "Generation of [" + subListSup.toString() + "] which contains only bigger values than " + pivotNumber +".\n";
    }

    function showExplanationsMerge() {
        return "Everything is now sorted, we just have to merge back the cell to have the original list sorted by ascending order.\n"
    }

    function showConclusion() {
        return "Voila!";
    }

    return {
        showPivotExplanation: showExplanationPivot,
        showExplanationsSubListsInf: showExplanationsSubListsInf,
        showExplanationsSubListsSup: showExplanationsSubListsSup,
        showExplanationsMerge: showExplanationsMerge,
        showConclusion: showConclusion
    };
}();

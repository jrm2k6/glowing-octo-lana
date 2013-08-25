$(document).ready(function() {
    var functions = [
        function() {Animations.showPivot(Animations.findCellFromIndexAndIteration(3,1));},
        function() {l = Animations.iterate([8,5,1,3], l, 2);},
        function() {l = Animations.iterate([19,44], l, 3);},
        function() {Animations.showPivot(Animations.findCellFromIndexAndIteration(10,2));},
        function() {l = Animations.iterate([1], l, 4);},
        function() {l = Animations.iterate([8,5], l, 5);},
        function() {Animations.showPivot(Animations.findCellFromIndexAndIteration(15,5));},
        function() {l = Animations.iterate([8], l, 6);},
        function() {Animations.showPivot(Animations.findCellFromIndexAndIteration(12,3));},
        function() {l = Animations.iterate([19], l, 7);},
        function() {Animations.moveLeafsNextToPivot();},
        function() {Animations.mergeCells()}
    ]

    var explanations = [
        Explanation.showPivotExplanation(9),
        Explanation.showExplanationsSubListsInf(9, [8,5,1,3]),
        Explanation.showExplanationsSubListsSup(9, [19,44]),
        Explanation.showPivotExplanation(3),
        Explanation.showExplanationsSubListsInf(3, [1]),
        Explanation.showExplanationsSubListsSup(3, [8,5]),
        Explanation.showPivotExplanation(5),
        Explanation.showExplanationsSubListsSup(5, [8]),
        Explanation.showPivotExplanation(44),
        Explanation.showExplanationsSubListsInf(44, [19]),
        Explanation.showExplanationsMerge(),
        Explanation.showConclusion()
    ]

    Animations.initList();
    var nbClicks = 0;
    $("#next").on("click", function(){
        if (nbClicks < functions.length){
            functions[nbClicks]();
            var textArea = $(".explanations");
            var existingText = textArea.val();
            console.log(existingText);
            $(".explanations").val(existingText + explanations[nbClicks]);
        }
        nbClicks++;
        Animations.showProgress(nbClicks);
    });

    $("#reset").on("click", function(){
        nbClicks = 0;
        $(".explanations").val("");
        Animations.reset();
        Animations.initList();
        Animations.showProgress(0);

    });

});

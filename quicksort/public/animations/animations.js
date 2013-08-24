
Animations = function() {
    var cells = [];
    var leafs = [];
    var currentIteration;
    var lastPivot;
    var stackPivot = new StackPivots();
    var SIZE_CELL = 50;
    var SPACING_BETWEEN_CELL = 110;
    var PADDING_LETTER_X = 21;
    var PADDING_LETTER_Y = 25;


    return {
            findCellFromIndexAndIteration : function(index, iteration) {
                for (var i=0; i< cells.length; i++) {
                    if (cells[i].getIndex() === index && cells[i].getIteration() === iteration) {
                        return cells[i];
                    }
                }
                return undefined;
            },

            createCells : function(l, it) {
                currentIteration = it;
                var data = this.generateCoordinates(l, it);

                var svg = d3.select("svg");

                var gs = svg.selectAll("g")
                        .data(data)
                        .enter()
                        .append("g");

                gs.append("rect")
                        .attr("y", function(d){return d.y;})
                        .attr("x", function(d){return d.x;})
                        .attr("width", SIZE_CELL)
                        .attr("height", SIZE_CELL)
                        .style("fill", "white")
                        .style("stroke", "#3c3c3c")
                        .style("stroke-width", "2px")
                        .attr("class", function(d){return "cell_" + d.id + "_" + it;})

                gs.append("text")
                        .text(function(d){return d.text;})
                        .style("alignment-baseline", "central")
                        .attr("y", function(d){return d.y + PADDING_LETTER_Y;})
                        .attr("x", function(d){return d.x + PADDING_LETTER_X;})
                        .attr("class", function(d){return "cell_text_" + d.id + "_" + it;});
            },

            showPivot : function(c) {
                lastPivot = new Pivot(c);
                stackPivot.push(lastPivot);

                var y = c.getY() + SPACING_BETWEEN_CELL;
                lastPivot.updatePosition(c.getX(), y);

                this.animateCell(c, c.getX(), y);

            },

            animateCell : function(c, x, y) {
                var cell = d3.selectAll(".cell_" + c.getIndex() + "_" + c.getText() + "_" + c.getIteration());
                var text =  d3.selectAll(".cell_text_"+ c.getIndex() + "_" + c.getText() + "_" + c.getIteration());

                cell.transition().attr("x", x)
                        .attr("y", y);


                text.transition().attr("x", x + PADDING_LETTER_X)
                        .attr("y", y + PADDING_LETTER_Y);
            },

            generateCoordinates : function(ql, it) {
                var result = [];
                var x = 200;
                var _y;

                for (var i=0; i < ql.length; i++) {
                    if (lastPivot !== undefined) {
                        _y = lastPivot.getY() + SPACING_BETWEEN_CELL;
                    } else {
                        _y = (it+1) * SPACING_BETWEEN_CELL;
                    }

                    var c = new Cell(ql[i], i+"_"+ql[i], x, _y, i, it);

                    cells.push(c);
                    result.push(c);

                    x += (SIZE_CELL-1);
                }

                return result;
            },

            isLowerList : function(elem) {
                return parseInt(elem.getText(), 10) < parseInt(lastPivot.getText(), 10);
            },

            initializeSublistXCoordinate : function (nbElements) {
                var xPivot = lastPivot.getX();
                var t = this.isLowerList(cells[cells.length - nbElements]);

                if (t) {
                    return xPivot - (nbElements * (SIZE_CELL - 1)) - (SIZE_CELL - 1);
                } else {
                    return xPivot + (SIZE_CELL*2) - 2;
                }
            },

            animateSublists : function(elements) {
                var nbElements = elements.length;

                if (nbElements === 1) {
                    leafs.push(cells[cells.length-1]);
                }
                var yPivot = lastPivot.getY();
                var initialX = this.initializeSublistXCoordinate(nbElements);
                var initialY = yPivot + SPACING_BETWEEN_CELL;
                var lower = this.isLowerList(cells[cells.length - nbElements]);

                for (var i = nbElements; i > 0; i--) {
                    var c = cells[cells.length - i];
                    c.updatePosition(initialX, initialY);
                    this.animateCell(c, initialX, initialY);
                    initialX += (SIZE_CELL-1);

                    c.attachCell(lower);
                    c.setPivot(lastPivot);
                    lastPivot.attachNewCell(c);
                }

                this.showSignSubList(nbElements);
                this.showLineSubList(nbElements);
            },

             moveLeafsNextToPivot : function() {
                var ordereredC;
                for (var i=0; i<leafs.length; i++) {
                    ordereredC = leafs[i].getPivot().getOrderedCells();
                    if (leafs[i].lower) {
                        this.animateCell(leafs[i], leafs[i].getPivot().getX() - SIZE_CELL, leafs[i].getPivot().getY());
                        ordereredC.unshift(leafs[i]);
                    } else {
                        this.animateCell(leafs[i], leafs[i].getPivot().getX() + SIZE_CELL, leafs[i].getPivot().getY());
                        ordereredC.push(leafs[i]);
                    }

                    this.removeLinesAndSigns(leafs[i].getPivot().getText());
                    leafs[i].getPivot().orderCells(ordereredC);
                }
            },

            removeLinesAndSigns : function(value) {
                var elements = document.getElementsByClassName("line_"+value);
                var signs = document.getElementsByClassName("sign_"+value)
                while(elements.length > 0) {
                    elements[0].parentNode.removeChild(elements[0]);
                    signs[0].parentNode.removeChild(signs[0]);
                }

            },

            mergeCells : function() {
                var pivots = stackPivot.getStack();

                for (var i=pivots.length-1; i >=0; i--){
                    var cell = pivots[i].getCell();
                    if (cell.getPivot() !== undefined) {
                        this.animateMergeCells(pivots[i]);
                        this.removeLinesAndSigns(pivots[i].getCell().getText());
                        this.removeTemporaryCells(pivots[i]);
                    } else {
                        this.cleanFirstPivot(pivots[i]);
                    }
                }
            },

            cleanFirstPivot : function(firstPivot) {
                this.removeLinesAndSigns(firstPivot.getCell().getText());
                this.removeTemporaryCells(firstPivot);
            },

            removeTemporaryCells : function(pivot) {
                var temporaryCells = pivot.getTemporaryCells();
                for (var i=0; i<temporaryCells.length; i++) {
                    var cell = temporaryCells[i];
                    var suffix = cell.getClassSuffix();
                    this.removeCell(suffix);
                }
            },

            removeCell : function(suffix) {
                var c = document.getElementsByClassName("cell_"+suffix);
                var t = document.getElementsByClassName("cell_text_"+suffix);

                c[0].parentNode.removeChild(c[0]);
                t[0].parentNode.removeChild(t[0]);
            },

            prependCellOrderedToPivot : function(pivotCellsOrdered, currentPivotCellsOrdered) {
                var temp;
                if (currentPivotCellsOrdered instanceof Array){
                    temp = currentPivotCellsOrdered.concat(pivotCellsOrdered);
                } else {
                    temp = pivotCellsOrdered.unshift(currentPivotCellsOrdered)
                }
                return temp;
            },

            animateMergeCells : function(pivotToMove) {
                var pivot = pivotToMove.getCell().getPivot();
                var orderedC = pivot.getOrderedCells();
                var cellsOrdered = pivotToMove.getOrderedCells();
                var nbElements = cellsOrdered.length;
                var positionX;
                var positionY = pivot.getY();

                if (pivotToMove.getCell().lower) {
                    positionX = pivotToMove.getCell().getPivot().getX() - (nbElements * SIZE_CELL);
                    orderedC = this.prependCellOrderedToPivot(orderedC, cellsOrdered);
                } else {
                    positionX = pivotToMove.getCell().getPivot().getX() + SIZE_CELL;
                    orderedC = orderedC.concat(cellsOrdered)
                }

                for (var i=0; i<nbElements; i++) {
                    this.animateCell(cellsOrdered[i], positionX, positionY);
                    cellsOrdered[i].updatePosition(positionX, positionY);
                    positionX+=SIZE_CELL;
                }

                pivot.orderCells(orderedC);
            },

            showSignSubList : function(nbElements) {
                var isLower = this.isLowerList(cells[cells.length - nbElements]);
                var signPositionX;
                var sign;

                if (isLower) {
                    sign = "<";
                    signPositionX = lastPivot.getX() - SIZE_CELL;
                } else {
                    sign = ">";
                    signPositionX = lastPivot.getX() + ((nbElements/2) * SIZE_CELL + SIZE_CELL);
                }

                var signPositionY = lastPivot.getY() + (SPACING_BETWEEN_CELL/2);


                var svg = d3.select("svg");

                var gs = svg.selectAll("g");

                gs.append("text")
                        .text(sign)
                        .style("alignment-baseline", "central")
                        .attr("y", signPositionY)
                        .attr("x", signPositionX)
                        .attr("class", "sign_"+lastPivot.getText());
            },

            findMiddleSubList : function(nbElements) {
                var firstCell = cells[cells.length - nbElements];
                var lastCell = cells[cells.length - 1];

                return lastCell.getX() - (lastCell.getX() - firstCell.getX()) / 2 + 14;
            },


            showLineSubList : function(nbElements) {
                var linePositionEndX = this.findMiddleSubList(nbElements);

                var linePositionEndY = cells[cells.length - nbElements].getY();

                var svg = d3.select("svg");

                var gs = svg.selectAll("g");

                gs.append("line")
                        .attr("x1", lastPivot.getX() + SIZE_CELL/2)
                        .attr("y1", lastPivot.getY() + SIZE_CELL + 1)
                        .attr("x2", linePositionEndX)
                        .attr("y2", linePositionEndY)
                        .attr("stroke-width", 1)
                        .attr("stroke", "black")
                        .attr("class", "line_"+lastPivot.getCell().getText());
            },

            showProgress : function(nbClicks) {
                $(".bar").css("width", (8.4 * nbClicks)+ "%");
            },

            reset : function() {
                leafs = [];
                cells = [];
                stackPivot = new StackPivots();
                currentIteration = 0;
                lastPivot = undefined;
                $("#svg").empty();
            },

            initList : function() {
                l = [8, 19, 5, 9, 1, 3, 44];
                this.createCells(l, 1);
            },

            iterate : function(sublist, l, it) {
                l = l.concat(sublist);
                this.createCells(l, it);
                this.animateSublists(sublist);
                return l;
            }
    };
}();




$(document).ready(function() {
    var functions = [
        function() {Animations.showPivot(Animations.findCellFromIndexAndIteration(3,1));},
        function() {l = Animations.iterate([8,5,1,3], l, 2);},
        function() {l = Animations.iterate([19, 44], l, 3);},
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

    Animations.initList();
    var nbClicks = 0;
    $("#next").on("click", function(){
        if (nbClicks < functions.length){
            functions[nbClicks]();
        }
        nbClicks++;
        Animations.showProgress(nbClicks);
    });

    $("#reset").on("click", function(){
        nbClicks = 0;
        Animations.reset();
        Animations.initList();
        Animations.showProgress(0);

    });

});




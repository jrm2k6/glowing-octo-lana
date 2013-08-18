var cells = [];
var leafs = [];
var currentIteration;
var lastPivot;
var SIZE_CELL = 50;
var SPACING_BETWEEN_CELL = 110;
var PADDING_LETTER_X = 21;
var PADDING_LETTER_Y = 25;
var stackPivot = new StackPivots();


var findCellFromIndexAndIteration = function(index, iteration) {
    for (var i=0; i< cells.length; i++) {
        if (cells[i].getIndex() === index && cells[i].getIteration() === iteration) {
            return cells[i];
        }
    }
    return undefined;
}

var createCells = function(l, it) {
    currentIteration = it;
    var data = generateCoordinates(l, it);

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
};

var showPivot = function(c) {
    lastPivot = new Pivot(c);
    stackPivot.push(lastPivot);

    var y = c.getY() + SPACING_BETWEEN_CELL;
    lastPivot.updatePosition(c.getX(), y);

    animateCell(c, c.getX(), y);

}

var animateCell = function(c, x, y) {
    var cell = d3.selectAll(".cell_" + c.getIndex() + "_" + c.getText() + "_" + c.getIteration());
    var text =  d3.selectAll(".cell_text_"+ c.getIndex() + "_" + c.getText() + "_" + c.getIteration());

    cell.transition().attr("x", x)
            .attr("y", y);


    text.transition().attr("x", x + PADDING_LETTER_X)
            .attr("y", y + PADDING_LETTER_Y);
}

var generateCoordinates = function(ql, it) {
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
}

var isLowerList = function(elem) {
    return parseInt(elem.getText(), 10) < parseInt(lastPivot.getText(), 10);
}

var initializeSublistXCoordinate = function (nbElements) {
    var xPivot = lastPivot.getX();
    var t = isLowerList(cells[cells.length - nbElements]);

    if (t) {
        return xPivot - (nbElements * (SIZE_CELL - 1)) - (SIZE_CELL - 1);
    } else {
        return xPivot + (SIZE_CELL*2) - 2;
    }
};

var animateSublists = function(elements) {
    var nbElements = elements.length;

    if (nbElements === 1) {
        leafs.push(cells[cells.length-1]);
    }
    var yPivot = lastPivot.getY();
    var initialX = this.initializeSublistXCoordinate(nbElements);
    var initialY = yPivot + SPACING_BETWEEN_CELL;
    var lower = isLowerList(cells[cells.length - nbElements]);

    for (var i = nbElements; i > 0; i--) {
        var c = cells[cells.length - i];
        c.updatePosition(initialX, initialY);
        this.animateCell(c, initialX, initialY);
        initialX += (SIZE_CELL-1);

        c.attachCell(lower);
        c.setPivot(lastPivot);
        lastPivot.attachNewCell(c);
    }

    showSignSubList(nbElements);
    showLineSubList(nbElements);
}

var moveLeafsNextToPivot = function() {
    var ordereredC;
    for (var i=0; i<leafs.length; i++) {
        ordereredC = leafs[i].getPivot().getOrderedCells();
        if (leafs[i].lower) {
            animateCell(leafs[i], leafs[i].getPivot().getX() - SIZE_CELL, leafs[i].getPivot().getY());
            ordereredC.unshift(leafs[i]);
        } else {
            animateCell(leafs[i], leafs[i].getPivot().getX() + SIZE_CELL, leafs[i].getPivot().getY());
            ordereredC.push(leafs[i]);
        }

        removeLinesAndSigns(leafs[i].getPivot().getText());
        leafs[i].getPivot().orderCells(ordereredC);
    }
}

var removeLinesAndSigns = function(value) {
    elements = document.getElementsByClassName("line_"+value);
    signs = document.getElementsByClassName("sign_"+value)
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
        signs[0].parentNode.removeChild(signs[0]);
    }

}

var mergeCells = function() {
    pivots = stackPivot.getStack();

    for (var i=pivots.length-1; i >=0; i--){
        var cell = pivots[i].getCell();
        if (cell.getPivot() !== undefined) {
            animateMergeCells(pivots[i]);
            removeLinesAndSigns(pivots[i].getCell().getText());
            removeTemporaryCells(pivots[i]);
        } else {
            cleanFirstPivot(pivots[i]);
        }
    }
}

var cleanFirstPivot = function(firstPivot) {
    removeLinesAndSigns(firstPivot.getCell().getText());
    removeTemporaryCells(firstPivot);
}

var removeTemporaryCells = function(pivot) {
    var temporaryCells = pivot.getTemporaryCells();
    for (var i=0; i<temporaryCells.length; i++) {
        var cell = temporaryCells[i];
        var suffix = cell.getClassSuffix();
        removeCell(suffix);
    }
}

var removeCell = function(suffix) {
    var c = document.getElementsByClassName("cell_"+suffix);
    var t = document.getElementsByClassName("cell_text_"+suffix);

    c[0].parentNode.removeChild(c[0]);
    t[0].parentNode.removeChild(t[0]);
}

var prependCellOrderedToPivot = function(pivotCellsOrdered, currentPivotCellsOrdered) {
    var temp;
    if (currentPivotCellsOrdered instanceof Array){
        temp = currentPivotCellsOrdered.concat(pivotCellsOrdered);
    } else {
        temp = pivotCellsOrdered.unshift(currentPivotCellsOrdered)
    }
    return temp;
}

var animateMergeCells = function(pivotToMove) {
    var pivot = pivotToMove.getCell().getPivot();
    var orderedC = pivot.getOrderedCells();
    var cellsOrdered = pivotToMove.getOrderedCells();
    var nbElements = cellsOrdered.length;
    var positionX;
    var positionY = pivot.getY();

    if (pivotToMove.getCell().lower) {
        positionX = pivotToMove.getCell().getPivot().getX() - (nbElements * SIZE_CELL);
        orderedC = prependCellOrderedToPivot(orderedC, cellsOrdered);
    } else {
        positionX = pivotToMove.getCell().getPivot().getX() + SIZE_CELL;
        orderedC = orderedC.concat(cellsOrdered)
    }

    for (var i=0; i<nbElements; i++) {
        animateCell(cellsOrdered[i], positionX, positionY);
        cellsOrdered[i].updatePosition(positionX, positionY);
        positionX+=SIZE_CELL;
    }

    pivot.orderCells(orderedC);
}

var showSignSubList = function(nbElements) {
    var isLower = isLowerList(cells[cells.length - nbElements]);
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
}

var findMiddleSubList = function(nbElements) {
    var firstCell = cells[cells.length - nbElements];
    var lastCell = cells[cells.length - 1];

    return lastCell.getX() - (lastCell.getX() - firstCell.getX()) / 2 + 14;
}


var showLineSubList = function(nbElements) {
    var linePositionEndX = findMiddleSubList(nbElements);

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
}

$(document).ready(function() {
//    var l = [1,3,7,5,6];
//    var subList;
//
//    createCells(l, 1);
//    showPivot(findCellFromIndexAndIteration(1, 1));
//
//    subList = [1];
//    l = l.concat(subList);
//    createCells(l, 2);
//    animateSublists(subList);
//    subList = [7, 5, 6];
//    l = l.concat(subList);
//    createCells(l, 3);
//    animateSublists(subList);
//
//    showPivot(findCellFromIndexAndIteration(7, 3));
//    subList = [7, 6];
//    l = l.concat([7,6]);
//    createCells(l, 4);
//    animateSublists(subList);
//
//    showPivot(findCellFromIndexAndIteration(10, 4));
//    subList = [7];
//    l = l.concat([7]);
//    createCells(l, 5);
//    animateSublists(subList);


    var l = [8, 19, 5, 9, 1, 3, 44];
    var subList;

    createCells(l, 1);
    showPivot(findCellFromIndexAndIteration(3,1));
    subList = [8,5,1,3];
    l = l.concat(subList);
    createCells(l, 2);
    animateSublists(subList);
    subList = [19, 44];
    l = l.concat(subList);
    createCells(l, 3);
    animateSublists(subList);

    showPivot(findCellFromIndexAndIteration(10,2));
    subList = [1];
    l = l.concat(subList);
    createCells(l, 4);
    animateSublists(subList);
    subList = [8,5];
    l = l.concat(subList);
    createCells(l, 5);
    animateSublists(subList);

    showPivot(findCellFromIndexAndIteration(15,5));
    subList = [8];
    l = l.concat(subList);
    createCells(l, 7);
    animateSublists(subList);

    showPivot(findCellFromIndexAndIteration(12,3));
    subList = [19];
    l = l.concat(subList);
    createCells(l, 6);
    animateSublists(subList);


});

function Pivot(cell) {
    this.cell = cell;
    this.attachedCells = [];
    this.orderedCells = [cell];
}

Pivot.prototype.attachNewCell = function(cell) {
    this.attachedCells.push(cell);
}

Pivot.prototype.orderCells = function(_cells) {
    // ordered cells contains cells attached + the pivot cell itself - needed to get the good number of cells to move,
   // and append/prepend new cells
    this.orderedCells = _cells;
}

Pivot.prototype.getOrderedCells = function() {
    return this.orderedCells;
}

Pivot.prototype.getIndex = function() {
    return this.cell.getIndex();
}

Pivot.prototype.getText = function() {
    return this.cell.getText();
}

Pivot.prototype.getCell= function() {
    return this.cell;
}

Pivot.prototype.getX = function() {
    return this.cell.getX();
}

Pivot.prototype.getY = function() {
    return this.cell.getY();
}

Pivot.prototype.getIteration = function() {
    return this.cell.getIteration();
}

Pivot.prototype.updatePosition = function(x, y) {
    this.cell.updatePosition(x, y);
}

Pivot.prototype.getTemporaryCells = function() {
    var result = [];
    for (var i=0; i<this.attachedCells.length; i++) {
        if (this.isPresentIn(this.attachedCells[i], this.orderedCells) === -1){
               result.push(this.attachedCells[i]);
        }
    }

    return result;
}

Pivot.prototype.isPresentIn = function(c, l) {
    for (var i=0; i< l.length; i++) {
        if (l[i].getText() == c.getText() && l[i].getIndex() == c.getIndex()
                && l[i].getX() === c.getX() && l[i].getY() === c.getY()) {
            return i;
        }
    }
    return -1;
}

function Cell(text, id, x, y, index, iteration) {
    this.text = text;
    this.id = id;
    this.x = x;
    this.y = y;
    this.index = index;
    this.iteration = iteration;
    this.lower = false;
    this.pivot = undefined;
}

Cell.prototype.getIndex = function() {
    return this.index;
}

Cell.prototype.setPivot = function(pivot) {
    this.pivot = pivot;
}

Cell.prototype.getPivot = function() {
    return this.pivot;
}

Cell.prototype.getText = function() {
    return this.text;
}

Cell.prototype.getX = function() {
    return this.x;
}

Cell.prototype.getY = function() {
    return this.y;
}

Cell.prototype.getIteration = function() {
    return this.iteration;
}

Cell.prototype.updatePosition = function(x, y) {
    if (x !== undefined) this.x = x;

    if (y !== undefined) this. y = y;
}

Cell.prototype.attachCell = function(lower) {
    this.lower = lower;
}

Cell.prototype.getClassSuffix = function() {
    return this.getIndex()+"_"+this.getText()+"_"+this.getIteration();
}

function StackPivots()
{
    this.elements = [];
    this.elementsCell = [];
}

StackPivots.prototype.push = function(elem) {
    this.elements.push(elem);
    this.elementsCell.push(elem.getCell());
}

StackPivots.prototype.pop = function() {
    poppedElement = this.elements[this.elements.length - 1];
    this.elements = this.elements.slice(0, this.elements.length-1);
    this.elementsCell = this.elementsCell.slice(0, this.elementsCell-1);
    return poppedElement;
}

StackPivots.prototype.head = function() {
    return this.elements[this.elements.length-1];
}

StackPivots.prototype.isEmpty = function() {
    return this.elements.length === 0;
}

StackPivots.prototype.searchCell = function(c) {
    var index = this.elementsCell.indexOf(c);
    return this.elementsCell[index];
}

StackPivots.prototype.getStack = function() {
    return this.elements;
}
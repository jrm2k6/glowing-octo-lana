var cells = [];
var mergedCells = [];
var mergedPivot;
var leafs = [];
var currentIteration;
var lastPivot;
var lastPivotMerged;
var SIZE_CELL = 30;
var SPACING_BETWEEN_CELL = 90;
var stackPivot = new StackPivots();


var findCellFromIndexAndIteration = function(index, iteration) {
    for (var i=0; i< cells.length; i++) {
        if (cells[i].getIndex() === index && cells[i].getIteration() === iteration) {
            return cells[i];
        }
    }
    return undefined;
}

var findCellsWithSameValue = function(value) {
    sameValues = [];
    for (var i=0; i< cells.length; i++) {
        if (cells[i].getText() === value) {
            sameValues.push(cells[i]);
        }
    }
    return sameValues;
}

var pivotAlreadyMerged = function() {

    attachedCells = stackPivot.head().getAttachedCells();

    if (mergedCells !== undefined) {
        mergedCellsContent = mergedCells.getCells();

        for (var i = 0; i < mergedCellsContent.length; i++){
            var currentElem = mergedCellsContent[i];
            if (isPivot(currentElem)) {
                currentElem = currentElem.getCell();
            }

            if (containsObject(currentElem, attachedCells)) {
                return true;
            }
        }
    }
    return false;
}

var isPivot = function(cell) {
    return cell instanceof Pivot;
}

function containsObject(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

function containsCell(obj, list) {
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c instanceof Pivot) {
            c = c.getCell();
        }
        if (c === obj) {
            return true;
        }
    }
    return false;
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
            .style("stroke", "black")
            .style("stroke-width", "2px")
            .attr("class", function(d){return "cell_" + d.id + "_" + it;})

    gs.append("text")
            .text(function(d){return d.text;})
            .style("alignment-baseline", "central")
            .attr("y", function(d){return d.y + 15;})
            .attr("x", function(d){return d.x + 2;})
            .attr("class", function(d){return "cell_text_" + d.id + "_" + it;})
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


    text.transition().attr("x", x)
            .attr("y", y);
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

var getCellsAttachedToPivot = function(cellPivot) {
    cellsAttached = [];
    for (var i=0; i<cells.length; i++) {
        if (cells[i].getPivot() && cells[i].getPivot() === cellPivot) {
            cellsAttached.push(cells[i]);
        }
    }
    return cellsAttached;
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
        leafs[i].getPivot().orderCells(ordereredC)
    }
}

var mergeCells = function() {
    pivots = stackPivot.getStack();

    for (var i=pivots.length-1; i >=0; i--){
        var cell = pivots[i].getCell();
        if (cell.getPivot() !== undefined) {
            animateMergeCells(pivots[i]);
        }
    }
}

var animateMergeCells = function(pivotToMove) {
    var pivot = pivotToMove.getCell().getPivot();
    var orderedC = pivot.getOrderedCells();
    var cellsOrdered = pivotToMove.getOrderedCells();
    var nbElements = cellsOrdered.length;
    var positionX;
    var positionY = pivot.getY();

    if (pivotToMove.getCell().lower) {
        positionX = pivotToMove.getCell().getPivot().getX() - (nbElements * 30);
        orderedC.unshift(cellsOrdered);
    } else {
        positionX = pivotToMove.getCell().getPivot().getX() + 30;
        orderedC = orderedC.concat(cellsOrdered)
    }

    for (var i=0; i<nbElements; i++) {
        animateCell(cellsOrdered[i], positionX, positionY);
        cellsOrdered[i].updatePosition(positionX, positionY);
        positionX+=30;
    }

    pivot.orderCells(orderedC);
}

var removeMergedCell = function(c) {
    var index = getMergedCellIndex(c);
    mergedCells = mergedCells.splice(index, 1);
}

var pivotInMergedCell = function(c) {
    for (var i=0; i<mergedCells.length;i++) {
        if (mergedCells[i].containsCell(c)) {
            return true;
        }
    }

    return false;
}

var getMergedCell = function(c) {
    for (var i=0; i<mergedCells.length;i++) {
        if (mergedCells[i].containsCell(c)) {
            return mergedCells[i];
        }
    }
    return undefined;
}

var getMergedCellIndex = function(c) {
    for (var i=0; i<mergedCells.length;i++) {
        if (mergedCells[i].containsCell(c)) {
            return i;
        }
    }
    return -1;
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
            .attr("class", "inf_sign");
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
            .attr("stroke", "black");
}

var moveMergedCellsNextToPivot = function(pivot) {
    var x = pivot.getX();
    var y = pivot.getY();
    var currentCell;
    currentMergedCells = mergedCells.getCells();

    if (lastPivotMerged.getCell().isAttachedOnLeftPivot()) {
        for (var i=0; i < currentMergedCells.length; i++) {
            currentCell = currentMergedCells[i];
            initialX = x - ((currentMergedCells.length - (i + 1)) * 30) - 30;
            if (isPivot(currentMergedCells[i])) currentCell = currentMergedCells[i].getCell();
            animateCell(currentCell, initialX, y);
            mergedCells.appendMergeCell([pivot]);

        }
    }else {
        for (var i=0; i < currentMergedCells.length; i++) {
            currentCell = currentMergedCells[i];
            initialX = x + ((i + 1) * 30);
            if (isPivot(currentMergedCells[i])) currentCell = currentMergedCells[i].getCell();
            console.log(currentCell, initialX, y);
            animateCell(currentCell, initialX, y);
            mergedCells.prependMergeCell([pivot]);
        }
    }

    if (!checkAllAttachedCellsAreMerged(pivot)) {
        moveLeavesNextToPivot(pivot);
    }

    updateStackPivot();
}

var updateStackPivot = function() {
    lastPivotMerged = stackPivot.pop();
}

var checkAllAttachedCellsAreMerged = function(pivot) {
    var i;
    var attachedCells = pivot.getAttachedCells();
    for (i=0; i<attachedCells.length; i++) {
        if (!containsCell(attachedCells[i], mergedCells) && !hasHigherIndexStored(attachedCells[i])) {
            return false;
        }
    }
    return true;
}

var hasHigherIndexStored = function(cell) {
    var i;
    var _mergedCells = mergedCells.getCells();
    for (i=0; i< _mergedCells.length; i++) {
        if (_mergedCells[i].getText() == cell.getText() && _mergedCells[i].getIndex() >= cell.getIndex()) {
            return true;
        }
    }

    return false;
}

var moveLeavesNextToPivot = function (pivot) {
    var x = pivot.getX();
    var y = pivot.getY();
    var initialX;
    var i;

    var leftCellsToMove = pivot.getLeftCells();
    var rightCellsToMove = pivot.getRightCells();

    if (mergedCells !== undefined) {
        if (leftCellsToMove.length > 0) {
            if (hasHigherIndexStored(leftCellsToMove[0])) {
                leftCellsToMove = mergedCells.getCells();
            }
        }

        if (rightCellsToMove.length > 0) {
            if (hasHigherIndexStored(rightCellsToMove[0])) {
                rightCellsToMove = mergedCells.getCells();
            }
        }
    }

    for (i=0; i < leftCellsToMove.length; i++) {
        initialX = x - ((leftCellsToMove.length - (i + 1)) * 30) - 30;
        animateCell(leftCellsToMove[i], initialX, y);
    }

    for (i=0; i < rightCellsToMove.length; i++) {
        if (mergedCells !== undefined) {
            initialX = x + (i * 30);
        } else {
            initialX = x + ((rightCellsToMove.length - i) * 30);
        }
        animateCell(rightCellsToMove[i], initialX, y);
    }

    if (mergedCells === undefined) {
        mergedCells = new MergeCells(leftCellsToMove.concat([pivot].concat(rightCellsToMove)));
    }

    updateStackPivot();
}


$(document).ready(function() {
    var l = [1,3,7,5,6];
    var subList;

    createCells(l, 1);
    showPivot(findCellFromIndexAndIteration(1, 1));

    subList = [1];
    l = l.concat(subList);
    createCells(l, 2);
    animateSublists(subList);
    subList = [7, 5, 6];
    l = l.concat(subList);
    createCells(l, 3);
    animateSublists(subList);

    showPivot(findCellFromIndexAndIteration(7, 3));
    subList = [7, 6];
    l = l.concat([7,6]);
    createCells(l, 4);
    animateSublists(subList);

    showPivot(findCellFromIndexAndIteration(10, 4));
    subList = [7];
    l = l.concat([7]);
    createCells(l, 5);
    animateSublists(subList);


//    var l = [8, 19, 5, 9, 1, 3, 44];
//    var subList;
//
//    createCells(l, 1);
//    showPivot(findCellFromIndexAndIteration(3,1));
//    subList = [8,5,1,3];
//    l = l.concat(subList);
//    createCells(l, 2);
//    animateSublists(subList);
//    subList = [19, 44];
//    l = l.concat(subList);
//    createCells(l, 3);
//    animateSublists(subList);
//
//    showPivot(findCellFromIndexAndIteration(10,2));
//    subList = [1];
//    l = l.concat(subList);
//    createCells(l, 4);
//    animateSublists(subList);
//    subList = [8,5];
//    l = l.concat(subList);
//    createCells(l, 5);
//    animateSublists(subList);
//
//        showPivot(findCellFromIndexAndIteration(15,5));
//    subList = [8];
//    l = l.concat(subList);
//    createCells(l, 7);
//    animateSublists(subList);
//
//    showPivot(findCellFromIndexAndIteration(12,3));
//    subList = [19];
//    l = l.concat(subList);
//    createCells(l, 6);
//    animateSublists(subList);


});

function Pivot(cell) {
    this.cell = cell;
    this.attachedCells = [];
    this.orderedCells = [cell];
}

Pivot.prototype.getAttachedCells = function() {
    return this.attachedCells;
}

Pivot.prototype.getLeftCells = function() {
    leftCells = [];

    for (var i=0; i < this.attachedCells.length; i++) {
        if (this.attachedCells[i].isAttachedOnLeftPivot()) {
            leftCells.push(this.attachedCells[i]);
        }
    }

    return leftCells;
}

Pivot.prototype.getRightCells = function() {
    rightCells = [];

    for (var i=0; i < this.attachedCells.length; i++) {
        if (this.attachedCells[i].isAttachedOnRightPivot()) {
            rightCells.push(this.attachedCells[i]);
        }
    }

    return rightCells;
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

function Cell(text, id, x, y, index, iteration) {
    this.text = text;
    this.id = id;
    this.x = x;
    this.y = y;
    this.index = index;
    this.iteration = iteration;
    this.attached = false;
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
    this.attached = true;
    this.lower = lower;
}

Cell.prototype.isAttachedOnLeftPivot = function() {
    return this.attached !== undefined && this.lower;
}

Cell.prototype.isAttachedOnRightPivot = function() {
    return this.attached !== undefined && !this.lower;
}


function MergeCells(_cells)
{
    this.mergeCells = _cells;
}

MergeCells.prototype.prependMergeCell = function(_cells) {
    this.mergeCells = _cells.concat(this.mergeCells);
    this.removeDuplicates();
}

MergeCells.prototype.appendMergeCell = function(_cells) {
    this.mergeCells = this.mergeCells.concat(_cells);
    this.removeDuplicates();
}

MergeCells.prototype.getCells = function() {
    return this.mergeCells;
}

MergeCells.prototype.removeDuplicates = function() {
    _mergeCells = []
    for (var i=0; i<this.mergeCells.length; i++) {
        if (!containsObject(this.mergeCells[i], _mergeCells)) {
            _mergeCells.push(this.mergeCells[i]);
        }
    }

    this.mergeCells = _mergeCells;
}

MergeCells.prototype.containsCell = function(c) {
    for (var i=0; i<this.mergeCells.length; i++) {
        if (this.mergeCells[i].getText() === c.getText() && this.mergeCells[i].getIndex() == c.getIndex()) {
            return true;
        }
    }
    return false;
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







function CellList() {
    this.cells = [];
}

CellList.prototype.appendCell = function(cell) {
    this.cells.push(cell);
}

CellList.prototype.indexOf = function(elem) {
    for (var i=0; i < this.cells.length; i++) {
        if (this.cells[i].getText() == elem.getText() && this.cells[i].getIndex() == elem.getIndex()) {
            return i;
        }
    }
    return -1;
}
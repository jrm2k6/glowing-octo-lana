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

StackPivots.prototype.getStack = function() {
    return this.elements;
}
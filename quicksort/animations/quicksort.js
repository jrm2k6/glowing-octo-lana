var cells = [];
var lastPivot;

var findCellFromIndexAndIteration = function(index, iteration) {
    for (var i=0; i< cells.length; i++) {
        if (cells[i].getIndex() === index && cells[i].getIteration() === iteration) {
            return cells[i];
        }
    }
    return undefined;
}

var createCells = function(l, it) {
    var data = generateCoordinates(l, it);

    var svg = d3.select("svg");

    var gs = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

    gs.append("rect")
            .attr("y", function(d){return d.y;})
            .attr("x", function(d){return d.x;})
            .attr("width", 30)
            .attr("height", 30)
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
    lastPivot = c;
    var y = c.getY() + 90;
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
            _y = lastPivot.getY() + 90;
        } else {
            _y = (it+1) * 90;
        }

        var c = new Cell(ql[i], i+"_"+ql[i], x, _y, i, it);

        cells.push(c);
        result.push(c);

        x += 29;
    }

    return result;
}

var animateSublists = function(nbElements, lower) {
    var xPivot = lastPivot.getX();
    var yPivot = lastPivot.getY();
    var initialX;
    var initialY = yPivot + 90;

    if (lower) {
        initialX = xPivot - (nbElements * 29) - 29;
    } else {
        initialX = xPivot + 29;
    }



    for (var i = nbElements; i > 0; i--) {
        var c = cells[cells.length - i];
        c.updatePosition(initialX, initialY);
        animateCell(c, initialX, initialY);
        initialX+=29;
    }



}

var updateArray = function(a, p) {

    var i = a.indexOf(parseInt(p, 10));

    if (i === 0) {
        return a.slice(1)
    }
    else if (i === a.length) {
        return a.slice(0, a.length-1);
    }
    else {
        lower = a.slice(0, i);
        upper = a.slice(i+1);

        return lower.concat(upper);
    }
}

$(document).ready(function() {
    var l = [1,3,7,5,6];

    createCells(l, 1);
    var cellPivot = findCellFromIndexAndIteration(1, 1);
    showPivot(cellPivot);

    var subList = [1];
    l = l.concat(subList);
    createCells(l, 2);
    animateSublists(subList.length, true);
    subList = [7, 5, 6];
    l = l.concat(subList);
    createCells(l, 3);
    animateSublists(subList.length, false);

    showPivot(findCellFromIndexAndIteration(7, 3));
    subList = [7, 6];
    l = l.concat([7,6]);
    createCells(l, 4);
    animateSublists(subList.length, false);
//
//    showPivot(findCellFromIndexAndIteration(10, 4));
//
//    l = l.concat([7]);
//    createCells(l, 5);

});


function Cell(text, id, x, y, index, iteration) {
    this.text = text;
    this.id = id;
    this.x = x;
    this.y = y;
    this.index = index;
    this.iteration = iteration;
}

Cell.prototype.getIndex = function() {
    return this.index;
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
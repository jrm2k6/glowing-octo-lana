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

var showPivot = function(number, index, it) {
    var cell = d3.selectAll(".cell_" + index + "_" + number + "_" + it);
    var text =  d3.selectAll(".cell_text_"+ index + "_" + number + "_" + it);

    cell.transition().attr("x",620)
            .attr("y", (it + 1) * 90);


    text.transition().attr("x",620)
            .attr("y", (it + 1) * 90);

}

var generateCoordinates = function(ql, it) {
    var result = [];
    var o = {};
    var x = 100;
    var y = 90;

    for (var i=0; i < ql.length; i++)
    {
        o = {text: ql[i], id:i +"_" + ql[i], x:x, y:(it + 1) * y, index:i};
        result.push(o);
        x+=29;
    }

    return result;
}


$(document).ready(function() {
    var l = [1,3,7,5,6]
    createCells(l, 1);
    showPivot(3, 1, 1);
    createCells(l.concat([1,7,5,6]), 3);
    l = l.concat([1,7,5,6])
    console.log(l)
});
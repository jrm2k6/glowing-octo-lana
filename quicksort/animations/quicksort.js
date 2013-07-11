var createCell = function() {
    var data = generateCoordinates([1,3,7,5,6]);

    var svg = d3.select("svg");

    var gs = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g")

    gs.append("rect")
            .attr("y", function(d){return d.y;})
            .attr("x", function(d){return d.x;})
            .attr("width", 30)
            .attr("height", 30)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", "2px")

    gs.append("text")
            .text(function(d){return d.text;})
            .style("alignment-baseline", "central")
            .attr("y", function(d){return d.y + 15;})
            .attr("x", function(d){return d.x + 2;})
};

var generateCoordinates = function(ql) {
    var result = [];
    var o = {};
    var x = 100;
    var y = 90;

    for (var i=0; i < ql.length; i++)
    {
        o = {text: ql[i], x:x, y:y};
        result.push(o);
        x+=29;
    }

    console.log(result);
    return result;
}


$(document).ready(function() {
    createCell();

});
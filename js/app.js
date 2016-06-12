!function () {

    var tooltip = d3.select("body")
        .append("div")
        .classed("tooltip", true);

    function color(d, selected){
        if (d.geschlecht === "w") {
            return (selected ? "#9e2e2e" : "#D46A6A");
        }
        return (selected ? "#255774" : "#4A97C4");
    }

    function visualizeFunny (names) {
        d3.shuffle(names);
        var h = 200,
            w = 500;
        var c = d3.select("#funny-names")
            .append("svg")
            .attr({
                height: h,
                width: w
            });

        c.selectAll("text")
            .data(names)
            .enter()
            .append("text")
            .classed("funny-names", true)
            .text(function(d){return d.key;})
            .attr({
                x: w / 2,
                y: h / 2,
                "text-anchor": "middle"
            })
            .style("opacity", 0)
            .style("fill", function(d){
                return color(d.values[0], false);
            });

        c.selectAll("text")
            .transition()
            .duration(1000)
            .delay(function (d, i){return i * 4000;})
            .style("opacity", 1)
            .each("end", function(d) {
                d3.select(this)
                .transition()
                .duration(2000)
                .delay(2500)
                .attr({
                    x: (Math.random() > 0.5 ? 1 : -1) * ((Math.random() + 1) * w), 
                    y: (Math.random() > 0.5 ? 1 : -1) * ((Math.random() + 1) * w)
                })
                .remove()
            });

    }

    function visualizeTop (names) {

        var nameHeight = 30,
            h = nameHeight * names.length,
            w = 1000, 
            m = 10;  

         //define svg container - c
        var c = d3.select("#top-names")
            .append("svg")
            .attr({
                height: h + m, 
                width: w
            })

        var group = c.selectAll("g.name")
            .data(names)
            .enter()
            .append("g")
            .classed("name", true);

        group.append("text")
            .attr("x", w / 4 - m)
            .text(function (d, i) { return (i + 1) + ". " + d.key; })
            .attr("y", function (d,i) { return (i + 1) * nameHeight; })
            .attr("text-anchor", "end");

        group.selectAll("circle")
            .data(function (d) {return d.values.sort(function(a,b){return a.geschlecht.localeCompare(b.geschlecht)});})
            .enter()
            .append("circle")
            .attr("cx", function(d,i,j){return w / 4 + m + (i * 7) })
            .attr("cy", function(d,i,j) {return (j + 1) * nameHeight - 5})
            .attr("r", 3)
            .style("fill", function(d){
               return color(d, false);
            })
            .on("mouseover", function(d){
                d3.select(this)
                    .style("fill", function(d){return color(d, true);})
                    .attr("r", 5);
                tooltip.text(d.name + " was born in " + d.geburtsjahr)
                    .style({
                        top: (d3.event.pageY - 20) + "px",
                        left: (d3.event.pageX + 10) + "px"
                    })
                    .style("visibility", "visible");

            })
            .on("mouseout", function(d){
                d3.select(this)
                    .style("fill", function(d){return color(d, false);})
                    .attr("r", 3);
                tooltip.style("visibility", "hidden");
            });

        c.append("line")
            .classed("separator", true)
            .attr({
                x1:w / 4,
                y1:m,
                x2:w / 4,
                y2:h + m
            })

    }

    function processData(result){

        //group dogs by name 
        var names = d3.nest()
            .key(function (d) {return d.name;})
            .entries(result);

        //select only names shared by more than 15 dogs
        var popularNames = names.filter(function(o){return o.values.length >= 20});

        //sort the names in descending order
        popularNames.sort(function(a,b){return b.values.length - a.values.length});

        var funnyNames = names.filter(function(o){return ((o.key.length > 20) && (o.values.length == 1))});

        visualizeTop(popularNames);
        visualizeFunny(funnyNames);

    }

    d3.csv("data/20160307_hundenamen.csv", processData);

}()


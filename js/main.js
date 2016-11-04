// D3js - Profitability of Industrial Sectors
var color=d3.scale.category10();
var height = 400;

//var x = d3.scale.ordinal().rangeBands([0, width]);

//var years=[2000,2005,2010,2015];
var years=d3.range(2000,2015+1);

function updateGraph() {

    //console.info('updateGraph()',vis);
    width=$('div.container').width();
    var xScale = d3.scale.linear().range([50, width-150]);
    var yScale = d3.scale.linear().range([height-50, 0]);//PCT
    
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
        .ticks(5)
        .tickFormat(function(d){return d})
        ;
    
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6);

    var line = d3.svg.line()
        //.interpolate("basis")
        .interpolate("linear")
        .x(function(d) { return xScale(d[0]); })
        .y(function(d) { return yScale(d[1]); });


    
    vis.attr("width", width ).attr("height", 400 );
    // x.domain(data.map(function(d,i) { return i; }));
    xScale.domain([2000,2015]);//2000  2005    2010    2015
    yScale.domain([-10, 10]);
    
    //y1.domain([0, 0.25]);

    // delete prev axis
    vis.selectAll('.axis').remove();

    // x-axis to svg
    vis.append("g").attr("class", "x axis")
        .attr("transform", "translate(0,360)")
        .style("font-size","16px")
        .call(xAxis);
    

    vis.append("g")
        .attr("class", "y axis")
        .style("font-size","16px")
        .attr("transform", "translate(30,10)")
        .call(yAxis)
    
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -25)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("%");
    

    var vline= vis.selectAll("line.vline").data(years);
    vline.enter().append("line")
        .attr("class","vline")
        .attr("stroke","#aaaaaa")
        .style("stroke-dasharray", ("3, 3"))
        //.style("opacity",0.5)
        .attr("stroke-width",1)
        .style('shape-rendering','crispEdges');
    
    vline.transition()
        .attr("x1",function(d){return xScale(d);})
        .attr("x2",function(d){return xScale(d);})
        .attr("y1",0).attr("y2",height-40);

   
    




    //console.log(data.length)
    vis.selectAll(".group").remove();

    var group = vis.selectAll(".group")
        .data(data)
        .enter().append("g")
        .attr("class", "group");
            
    
    group.append("path")
        .attr("d", function(d) { return line(d.d); })
        .attr("class", "line")
        .style("cursor", "pointer")
        .style("stroke", function(d){
            //console.warn(d);
            return '#cccccc';
            return color(d.location);
        })
        .attr("stroke-width", 2)
        .style('opacity', 0.5)
        .attr("fill", "none")
        ;
          
    group.append("text")
        .datum(function(d) { return {name: d.location, value: d.d[d.d.length - 1]}; })
        .attr("transform", function(d) { 
            //console.log(d);
            return "translate(" + xScale(d.value[0]) + "," + (yScale(d.value[1])) + ")";
        })
        .attr("x", 5)
        .attr("dy", ".35em")
        .attr("fill", "#444444")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .style("cursor", "pointer")
        .style('opacity', 0.5)
        .text(function(d) { return d.name; });


    group
    .on("mouseover",function(d){
        
        if(_last){
            d3.select(_last).select('path').attr("stroke-width", 2).style('opacity', 0.5).style('stroke','#cccccc');
            d3.select(_last).select('text').style('opacity', 0.5);
        }
        
        d3.select(this).select('path').attr("stroke-width", 4).style('opacity', 1).style('stroke','#cc0000');
        d3.select(this).select('text').style('opacity', 1).style('font-weight','bold');
        var htm="Sector: <b>"+d.name+"</b><hr />";
        htm+="<table>";
        htm+="<thead><th width=60>Year</th><th>ROCE</th>";
        for(var i in d.d){
            var o=d.d[i];
            //console.log(o);
            htm+="<tr><td>"+o[0];
            htm+="<td style='text-align:right'>"+o[1]+"%</td>";    
        }
        htm+="</table>";
        ttover(htm);
        _last=this;
    }).on("mousemove",function(){
        ttmove();
    }).on("mouseout",function(d){
        //console.warn(d);
        //d3.select(this).select('path').attr("stroke-width", 2).style('opacity', 0.5).style('stroke','#cccccc');
        //d3.select(this).select('text').style('opacity', 0.5);
        ttout();
    });

}

//horizontal bars, inspired from : 
// vertical list of countries 
function updateGraph2() {

    console.log('updateGraph2()');
    
    var yr=$('input#year').val();
    
    for(var i in data){
        //var o=data[i];
        data[i].val=data[i][yr];            
    }
    //data=json;


    var margin={
        'top':20
    }
    
    
  
  
    var Scale = d3.scale.linear().domain([-30,30]).range([160,800]);
    var xAxis = d3.svg.axis().scale(Scale).tickFormat(function(d){
        //if( d > 1000)return Math.round(d/1000)+"k";
        return d;
    })
    .orient("top");
    
    vis2.selectAll('.axis').remove();//clear
    
    vis2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0,20)")
    .call(xAxis);
    
    vis2.selectAll('.axis line, .axis path').style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});
    
    // axis //
    //var teu1 = vis2.selectAll("rect.stick").data( data.filter(function(d){return d.val>0;}) );
    
    // Labels (country name)
    

    var lineheight=19;
    var txt = vis2.selectAll("text.label").data( data );
    txt.enter().append("text")
        .text(function(d,i){ 
            //console.info(d.location);
            return  d.location;
        })
        .attr("text-anchor", "end")
        .attr("x", 0 )
        .attr("y", function(d,i){ return (i*lineheight) + 14 +margin.top})
        .attr("fill", "#999")
        .attr("class", "label");
    
    txt.text(function(d,i){
            
            return  d.location;
        })//update
        .transition(500)
        .attr("x", 150 )
        .attr("y", function(d,i){ return (i*lineheight) + 14 +margin.top });
    
    txt.exit().remove();


    // Sticks //    
    
    
    var teu1 = vis2.selectAll("rect.stick").data( data );
        teu1.enter().append("rect")
        .attr("class", "stick" )
        .attr("fill", color(2) )
        .attr("x", function(d){
            return Scale(0);
        })
        .attr("y", function(d,i){
            return i*lineheight +9 +margin.top;
        })
        .attr("height" , 8 )
        .attr("width", 0 );

    teu1.transition(500)
        .attr("fill", function(d){
            if(d.val<0){
                return color(1);
            } else {
                return color(2);
            }
        })
        .attr("x", function(d){
            if(d.val<0){
                return Scale(0)-(Scale(0)-Scale(d.val));
            }else{
                return Scale(0);    
            }
        })
        .attr("y", function(d,i){return i*lineheight +9 +margin.top;} )
        .attr("width", function(d){ 
            //console.info(d.location,d.val,Scale(d.val));
            if(d.val<0){
                return Scale(0)-Scale(d.val);
            }else{
                return Scale(d.val)-Scale(0);    
            }
            
        } )
      
    teu1.exit().remove(); 
    
}

// Country evolution detail
// Show one country only, vertical bars
function updateGraph3() {
    var loc=$("select#country").val();
    if(!loc)return;
    console.info('updateGraph3()',loc);
    
    //get data
    for(var i in data){
        var o=data[i];
        if(o.location==loc){
            console.log(o);
        }
    }
}

var _last=null;

// data part
var data=[];

$(function() {
    
    $('input#year').change(function(o){
        console.log(o);
        $('label#labelYear').html("Year: "+$('input#year').val());
        updateGraph2();
    });
    
    $("select#country").empty();
    $("select#country").change(function(){
        updateGraph3();
    });

    //refresh();//compute and redraw graph
    d3.csv("data.csv", function(error, json){
        
        if (error) {
            return console.error(error);
        }
        
        var countries=[];
        for(var i in json){
            var o=json[i];
            countries.push(o.location);

            var x = document.getElementById("country");
            var option = document.createElement("option");
            option.value = o.location;
            option.text = o.location;
            x.add(option);
        }
        
        data=json;
        //console.log(countries.length,countries);
        //updateGraph();
        updateGraph2();
    });
    
   
    console.info('d3.version',d3.version);
    
    width=$('div.container').width();
    vis = d3.select("div#graph1").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "vis");

    vis2 = d3.select("div#graph2").append("svg:svg")
        .attr("width", width)
        .attr("height", 680)
        .attr("class", "vis2");

    vis3 = d3.select("div#graph3").append("svg:svg")
        .attr("width", width)
        .attr("height", 300)
        .attr("class", "vis3");



    ttdiv = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 1e-6);
    
});

var t;

d3.select(window).on('resize', function(){  
    
    clearTimeout(t);
    t=setTimeout(function()
    {
        // all resizable graph should be updated here
        console.log('resizeEnd');
        updateGraph();
        updateGraph2();
        updateGraph3();
    },300);//update all graph
});

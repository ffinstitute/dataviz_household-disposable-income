// D3js - household-disposable-income
var color=d3.scale.category10();
//var height = 400;
var WIDTH=400;//container width, updated on resize

// https://www.intradebid.org/intrade/app/web/index.php/visualizaciones/export-growth

// var x = d3.scale.ordinal().rangeBands([0, width]);

//var years=[2000,2005,2010,2015];
var years=d3.range(2000,2015+1);

function updateGraph() {//https://data.oecd.org/hha/household-savings.htm
    
    console.info('updateGraph()');
    
    //width=$('div.container').width();
    var xScale = d3.scale.linear().range([50, WIDTH-20]);
    var yScale = d3.scale.linear().range([400-50, 10]);//PCT
    
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
        .tickSize(360,0)
        .ticks(8)
        .tickFormat(function(d){return d})
        ;
    
    var yAxis = d3.svg.axis().scale(yScale).orient("left")
        .ticks(6)
        .tickFormat(function(d){return d+"%"});

    var line = d3.svg.line()
        //.interpolate("basis")
        .interpolate("linear")
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.val); });

    vis.attr("width", WIDTH ).attr("height", 400 );
    // x.domain(data.map(function(d,i) { return i; }));
    xScale.domain([2000,2015]);//2000  2005    2010    2015
    yScale.domain([-15, 40]);
    
    //y1.domain([0, 0.25]);



    

    if(!vis.selectAll('g')[0].length){// draw only once //
        
        vis.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,10)")
            //.style("font-size","16px")
            .call(xAxis);
        
        vis.append("g")
            .attr("class", "y axis")
            //.style("font-size","16px")
            .attr("transform", "translate(30,0)")
            .call(yAxis)
            ;
                
    } else {
        vis.select(".x.axis").call(xAxis);// update axis
        //vis.select(".y.axis").call(yAxis);// update axis
    }
    
    vis.selectAll('.axis line, .axis path').style({ 'stroke': '#eee', 'fill': 'none', 'stroke-width': '1px'});


    var vline= vis.selectAll("line.vline").data([0]);
    vline.enter().append("line")
        .attr("class","vline")
        .attr("stroke","#999")
        .style("stroke-dasharray", ("3, 3"))
        //.style("opacity",0.5)
        .attr("stroke-width",1)
        .style('shape-rendering','crispEdges');
    
    vline.transition()
        .attr("x1",35)
        .attr("x2",WIDTH)
        .attr("y1",function(d){return yScale(d);})
        .attr("y2",function(d){return yScale(d);});

   
    
    //console.log(data.length)
    
    
    vis.selectAll(".group").remove();

    var group = vis.selectAll(".group")
        .data(data)
        .enter().append("g")
        .attr("class", "group");
            
    
    group.append("path")
        .attr("d", function(d) { 
            //console.log(d);
            dat=[];
            for(var i=2000;i<=2015;i++){
                if(d[i])dat.push({'year':i,'val':d[i]});
            }
            
            return line(dat);
        })
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
        
        /*
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
*/

        
    group
    .on("mouseover",function(d){
        
        if(_last){
            d3.select(_last).select('path').attr("stroke-width", 2).style('opacity', 0.5).style('stroke','#cccccc');
            d3.select(_last).select('text').style('opacity', 0.5);
        }
        
        d3.select(this).select('path').attr("stroke-width", 3).style('opacity', 1).style('stroke','#cc0000');
        d3.select(this).select('text').style('opacity', 1).style('font-weight','bold');
        
        var htm="Country: <b>"+d.location+"</b>";
        
        ttover(htm);
        updateDots(d);
        _last=this;
    }).on("mousemove",function(){
        ttmove();
    }).on("mouseout",function(d){
        //console.warn(d);
        //d3.select(this).select('path').attr("stroke-width", 2).style('opacity', 0.5).style('stroke','#cccccc');
        //d3.select(this).select('text').style('opacity', 0.5);
        ttout();
    });
    
    
    function updateDots(d){
        
        

        var data=[];
        for(var i=2000;i<2015;i++){
            if(d[i])data.push({'year':i,'val':+d[i]});
        }
        
        //console.info('updateDots()',data);

        vis.selectAll(".grop").remove();

        var group = vis.selectAll(".grop")
            .data(data)
            .enter().append("g")
            .attr("class", "grop")
            .attr('transform',function(d,i){
                return "translate(" + xScale(d.year) + "," + yScale(d.val) + ")"; 
            })
            ;

        group.append("circle")
            .attr('r',3)
            .attr('fill',"#cc0000")

        group.append("text")
            
            .attr("text-anchor", "middle")
            .style("font-size", "11px")
            //.style("font-weight", "bold")
            .style("cursor", "pointer")
            //.style('opacity', 0.5)
            .text(function(d) { return d.val; })
            .attr("transform", "translate(0,-8)")
            ;

    }
}

//horizontal bars, inspired from : 
// vertical list of countries 
function updateGraph2() {
    
    var yr=$('input#year').val();
    $('label#labelYear').html("Year: "+yr);
    var margin={'top':20}
    var min=0
    var max=0;
    
    for(var i in data){
        //var o=data[i];
        data[i].val=data[i][yr];
        if(!data[i].val)continue;
        if(data[i].val<min)min=+data[i].val;
        if(data[i].val>max)max=+data[i].val;
    }
    
    data=data.sort(function(a,b){return b.val-a.val;});// Sort data

    //console.log('updateGraph2()',[min,max]);
    var Scale = d3.scale.linear().domain([min,max]).range([160,WIDTH-20]);
    var xAxis = d3.svg.axis().scale(Scale).tickFormat(function(d){
        //if( d > 1000)return Math.round(d/1000)+"k";
        return d+"%";
    })
    .tickSize(870,0)
    .ticks(6)
    .orient("top");
    
    //vis2.selectAll('.axis').remove();//clear
    
    if(!vis2.selectAll('g')[0].length){
        vis2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,890)")
        .call(xAxis);
    }else{
        vis2.selectAll('g.axis').call(xAxis);
    }
        
    vis2.selectAll('.axis line, .axis path').style({ 'stroke': '#ccc', 'fill': 'none', 'stroke-width': '1px'});
    
    // axis //
    //var teu1 = vis2.selectAll("rect.stick").data( data.filter(function(d){return d.val>0;}) );
    

    // Vertical line (Zero %)
    /*
    var vline= vis2.selectAll("line.vline").data([0]);
    vline.enter().append("line")
        .attr("class","vline")
        .attr("stroke","#aaaaaa")
        .style("stroke-dasharray", ("3, 3"))
        //.style("opacity",0.5)
        .attr("stroke-width",1)
        .style('shape-rendering','crispEdges')
        .attr("x1",function(d){
            console.info('x1',Scale(d));
            return Scale(d);
        })
        .attr("x2",function(d){return Scale(d);})
        .attr("y1",20)
        .attr("y2",800);
    
    vline.transition()
        .attr("x1",function(d){
            console.info('x1',Scale(d));
            return Scale(d);
        })
        .attr("x2",function(d){return Scale(d);})
        ;
    */


    // Labels (country name)
    var lineheight=19;
    var txt = vis2.selectAll("text.label").data( data );
    txt.enter().append("text")
        .text(function(d,i){ 
            return  d.location;
        })
        .attr("text-anchor", "end")
        .attr("x", 0 )
        .attr("y", 0)
        .attr("fill", "#999")
        .attr("class", "label");
    
    txt.transition(500)
        .text(function(d,i){return  d.location;})
        .attr("x", 150 )
        .attr("y", function(d,i){ return (i*lineheight) + 14 +margin.top });
    
    txt.exit().remove();


    // Sticks //    
    
    
    var bars = vis2.selectAll("rect.stick").data( data );
        bars.enter().append("rect")
        .attr("class", "stick" )
        .attr("fill", color(2) )
        .attr("x", function(d){
            return Scale(0);
        })
        .attr("y", function(d,i){
            return i*lineheight +9 +margin.top;
        })
        .attr("height" , 8 )
        .attr("width", 0 )
        .on("mouseover",function(d){
            //console.log(d);
            htm=d.location+" in "+yr+" : "+d.val+"%";
            ttover(htm);
        })
        .on("mousemove",ttmove)
        .on("mouseout",ttout)
        ;

    
    bars.transition(500)
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
      
    bars.exit().remove(); 
    
}

// Country evolution detail
// Show one country only, vertical bars
function updateGraph3() {
    
    var loc=$("select#country").val();
    if(!loc)return;
    //console.info('updateGraph3()',loc);
    
    //get data
    var datum=[];
    for(var i in data){
        var o=data[i];
        if(o.location==loc){
            for(var i=2000;i<=2015;i++){
                datum.push({'year':i,'pct':+o[i]});
            }
        }
    }
    
    //console.log(datum,d3.extent(datum,function(d){return d.year}));
    //console.info(parseInt(vis3.style('width')));
    
    var xScale = d3.scale.linear().domain([2000,2015]).range([40,WIDTH-40]);
    var xAxis = d3.svg.axis().scale(xScale).ticks(15).tickSize(70,0).tickFormat(function(d){
        //if( d > 1000)return Math.round(d/1000)+"k";
        return d;
    })
    .orient("bottom");
    
    var yMax=d3.max(datum,function(d){return d.pct});
    var yMin=d3.min(datum,function(d){return d.pct});
    
    //console.info(loc+' min:'+yMin+"%",'max:'+yMax+"%");
    
    var yScale = d3.scale.linear().domain([yMin,yMax]).range([0,50]);
    
    
    
    

    if(!vis3.selectAll('g')[0].length){// draw only once //
        //vis3.selectAll('.axis').remove();//clear
        vis3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,100)")
        .call(xAxis);        

        vis3.selectAll('.axis line, .axis path').style({ 'stroke': '#999', 'fill': 'none', 'stroke-width': '1px'});
    }else{
        //console.warn("Update .x.axis",WIDTH);
        
        vis3.select(".x.axis").call(xAxis);// update axis
    
    }
    
    
    
    var bars = vis3.selectAll("rect.bars").data( datum );
    
    bars.enter().append("rect")
        .attr("class", "bars" )
        .attr("fill", color(2) )
        .attr("x", function(d){
            return i*20
            //return i*lineheight +9 +margin.top;
        })
        .attr("y", function(d,i){
            return yScale(0);
        })
        .attr("height" , 0 )
        .attr("width", 20 )
        .on('mouseover',function(d){
            var htm=d.year+": "+d.pct+"%";
            ttover(htm);
        })
        .on('mousemove',ttmove)
        .on('mouseout',ttout);
    
    
    bars.transition(500)
        .attr("fill", function(d){
            if(d.pct<0){
                return color(1);
            } else {
                return color(2);
            }
        })
        .attr("x", function(d,i){
            w=WIDTH/16;
            return xScale(d.year)-10;
        })
        .attr("y", function(d,i){
            if(d.pct>0){
                return 100-yScale(Math.abs(d.pct));
            }else{
                return 100;    
            }
            
        })
        .attr("height", function(d){ 
            //console.info(d.location,d.val,Scale(d.val));
            return yScale(Math.abs(d.pct));
            //return yScale(Math.abs(d.pct);
            /*
            if (d.pct<0) {
                return yScale(0)-yScale(d.val);
            } else {
                return yScale(d.pct)-yScale(0);
            }
            */
        })
    
    bars.exit().remove();

    var txts = vis3.selectAll("text.txt").data( datum );
    txts.enter()
        .append("text")
        .attr("class", "txt" )
        .attr("x",0)
        .attr("y",0)
        .attr({
          "alignment-baseline": "middle",
          "text-anchor": "middle",
          "size":"10px"
        })
        .text(function(d){return d.pct+"%"})
        ;
    
    txts.transition(500)
        .attr("x",function(d,i){
            return xScale(d.year);
        })
        .attr("y",function(d,i){
            
            if(d.pct>0){
                return 95-yScale(Math.abs(d.pct));
            }else{
                return 95;
            }
            
        })
        .text(function(d){
            if(d.pct==0)return "";
            return d.pct+"%"
        })
        ;
}

var _last=null;

// data part
var data=[];

$(function() {
    
    WIDTH=$('div.container').width();//Get WIDTH
    
    $('input#year').change(function(o){
        //console.log(o);
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
        updateGraph();
        updateGraph2();
        updateGraph3();
    });
    
   
    console.info('d3.version',d3.version);
    
    width=$('div.container').width();
    vis = d3.select("div#graph1").append("svg:svg")
        .attr("width", width)
        .attr("height", 100)
        .attr("class", "vis");

    vis2 = d3.select("div#graph2").append("svg:svg")
        .attr("width", width)
        .attr("height", 680)
        .attr("class", "vis2");

    vis3 = d3.select("div#graph3").append("svg:svg")
        .attr("width", width)
        .attr("height", 200)
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
        WIDTH=$('div.container').width();
        vis3.attr("width", WIDTH);
        updateGraph();
        updateGraph2();
        updateGraph3();
    },300);//update all graph
});

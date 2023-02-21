Promise.all([
    d3.csv('../data/most_pop_genre_final_agg.csv'),
    d3.csv('../data/playlist_avg_duration_final.csv'),
    d3.csv('../data/master_song_features_v2.csv'),
    d3.csv('../data/timeline_info.csv')
]).then(([genre, duration, features, timeline]) => {

    allGroup = ['genre', 'duration', 'timeline', 'features']

    d3.select("#filter")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })
        .attr('id', function (d) { return d; });

    function updateChart(m) {
        d3.selectAll("svg").remove();
        d3.selectAll("#filter-feat").remove();
        
        if (m == 'genre') {
          d3.select("#title")
            .text("Count of Common Genres Across all Playlists")
            .attr('font-size', '100');
          bubble_genre(genre)
        } else if (m == 'features') {
          d3.select("#title")
            .text("Song Features Across Playlists Ranked Descending")
            .attr('font-size', '100');
          
          hor_feat(features)
        } else if (m == 'duration') {
          d3.select("#title")
            .text("Average Song Duration Across Playlists")
            .attr('font-size', '100');
          vert_dur(duration)
        } else if (m == 'timeline') {
          d3.select("#title")
            .text("Playlist Musical Eras")
            .attr('font-size', '100');

          console.log(timeline)
          ti(timeline)
        }


    }

    function bubble_genre(data) {
        for (let d of data) {
            d.count = +d.count
        }
        data.sort((a, b) => {return d3.descending(a.count, b.count)});
        console.log(data)
    
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "svg-tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden");
    
        const height = 710,
            width = 400;
    
        const svg = d3.select("#chart")  //Selecting id of chart. 
          .append("svg")
          .attr("viewBox", [0, 0, width, height + 100])
          .append('g')
          .attr('transform', 'translate(0,0)');
    
        var labels = svg.append('text');
    
        var radiusScale = d3.scaleSqrt().domain([5, 167]).range([5, 35]);
    
        const Array = data.map(d => d.count);
    
        // var colors = d3.schemeSpectral[data.length];
            
        var colors = d3.quantize(d3.interpolateGreens, data.length);
        console.log(colors)
    
        var set_color = d3.scaleOrdinal(Array, colors);
        console.log(Array)
    
        var simulation = d3.forceSimulation()
            .force('x', d3.forceX(width / 2).strength(0.05))
            .force('y', d3.forceY(height / 4).strength(0.05))
            .force('collide', d3.forceCollide(function(d) {
                return radiusScale(d.count) + 1
            }));
    
        var circles = svg.selectAll('.genre')
            .data(data)
            .enter().append('circle')
            .attr('class', 'genre')
            .attr('r', function(d) {
                return radiusScale(d.count)
            })
            .attr('fill', d => set_color(radiusScale(d.count)))
            .on("mousemove", function (event, d) {
                let genre = d.genre;
                let count = d.count;
          
                tooltip
                  .style("visibility", "visible")
                  .html(`genre: ${genre}
                        <br>count: ${count}`)
                  .style("top", (event.pageY - 10) + "px")
                  .style("left", (event.pageX + 10) + "px");
                d3.select(this).attr("fill", "goldenrod");
              })
              .on("mouseout", function () {
                tooltip.style("visibility", "hidden");
                d3.select(this).attr("fill", d => set_color(radiusScale(d.count)));
              });
        
        var labels = svg.selectAll('.bubble-text')
            .data(data)
            .enter().append('text')
            .attr('class', 'bubble-text')
            .text(function(d) {
                return d.genre
            })
            .attr('font-size', function(d) {
                return 0.35 * radiusScale((d.count))
            })
            .attr('text-anchor', 'middle');        
    
    
        simulation.nodes(data)
            .on('tick', ticked)
          
    
        function ticked() {
            circles
                .attr('cx', function(d) {
                    return d.x
                })
                .attr('cy', function(d) {
                    return d.y
                });
            labels
                .attr('dx', function(d) {
                    return d.x
                })
                .attr('dy', function(d) {
                    return d.y
                })
                
                
                
        }

    }

    function hor_feat(data) {
        for (let d of data) {
            d.value = +d.value; 
          };
          data.sort((a, b) => {return d3.descending(a.value, b.value)});
          
          const height = 700,
                width = 1200
                margin = ({ top: 25, right: 200, bottom: 35, left: 250 });
        
          // const colors = d3.schemeSpectral[10][0];
          // console.log(colors)
          const colors = d3.quantize(d3.interpolateGreens, 10)[5]
        
          const svg = d3.select("#chart")
              .append("svg")
              .attr("viewBox", [-95, 0, width + 200, height]);
        
          let y = d3.scaleBand()
              .domain(data.map(d => d.playlist_name)) 
              .range([margin.top, height - margin.bottom])
              .padding(0.1);
        
          let x = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.value)]).nice()
              .range([margin.left, width - margin.right + 100]);
        
          svg.append("g")
              .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
              .call(d3.axisBottom(x))
              .selectAll("text")
                .attr("font-size","15");
          
          svg.append("g")
              .attr("transform", `translate(${margin.left - 5},0)`)
              .attr('class', 'y axis')
              .call(d3.axisLeft(y))
              .selectAll("text")  
                // .style("text-anchor", "end")
                .attr("dx", "-0.5em")
                .attr("dy", "0.10em")
                .attr("font-size","20");
        
          allGroup = ['acousticness', 'danceability', 'energy', 'instrumentalness', 
          'liveness', 'loudness', 'speechiness', 'valence']
        
        //   d3.select("#filter-feat")
        d3.select('#viz')
              .append('select')
              .attr('id', 'filter-feat')
              .selectAll('myOptions')
              .data(allGroup)
              .enter()
              .append('option')
              .text(function (d) { return d; }) // text showed in the menu
              .attr("value", function (d) { return d; });
        
          const bar = svg.append('g');
        
          function updateChart(m) {
              let filtered = data.filter(d => d.variable == m);
        
              // let y = d3.scaleBand()
              //   .domain(filtered.map(d => d.playlist_name)) 
              //   .range([margin.top, height - margin.bottom])
              //   .padding(0.1);
              y.domain(filtered.map(d => d.playlist_name))
        
              svg.selectAll("g.y.axis")
                .call(d3.axisLeft(y));
              // yAxis.transition().duration(1000).call(d3.axisLeft(y));
              
              bar.selectAll('g') //change
                  .data(filtered)
                  .join(
                      enter => {
                        let g = enter.append("g")
                      
                        g.append("rect")
                          .attr("fill", colors)
                          .attr("x", margin.left)
                          .attr("width", d => x(d.value))
                          .attr("y", d => y(d.playlist_name))
                          .attr("height", y.bandwidth() - 1) // this height is the height attr on element
                          .transition()
                          .duration(750);
                      
                      },
                      update => {
                        update.select("rect")
                          .transition()
                          .duration(750)
                          .attr("y", d => y(d.playlist_name))
                          .attr("width", d => x(d.value))
                          .attr("height", y.bandwidth())
                          .attr("x",  margin.left);
        
                      
                        update.select("text")
                          .text(d => d.value)
                          .transition()
                          .duration(750)
                          .attr("y", d => y(d.playlist_name));
                      },
                      exit => {
                        exit.select("rect")
                          .transition()
                          .duration(750)
                          .attr("height", 0)
                          .attr("y", d => y(d.playlist_name))
                          .attr("width", d => x(d.value))
                          .attr("x",  margin.left);
                      
                        exit.select("text")
                          .text("");
                      
                        exit.transition()
                          .duration(750)
                          .remove();
                      }
                    );
        
              }
        
          updateChart('acousticness')
          d3.selectAll("#filter-feat")
            .on("change", function(d){
              selectedGroup = this.value
              return updateChart(selectedGroup)
            }); 
        
    }
    function vert_dur(data) {
        const height = 540,
                width = 1200
        margin = ({ top: 25, right: 200, bottom: 35, left: 100 });

        let svg = d3.select("#chart")
            .append("svg")
            .attr("viewBox", [0, 0, width - 98, height + 300]); // for resizing element in browser

        data.sort((a, b) => {return d3.descending(a.duration_min, b.duration_min)});

        var format = d3.format(",.2f");

        // const colors = d3.schemeSpectral[10][0];
        const colors = d3.quantize(d3.interpolateGreens, 10)[5]


        for (let d of data) {
            d.duration_min = +d.duration_min; //force a number
            d.duration_min = format(d.duration_min)
        };

        let x = d3.scaleBand()
            .domain(data.map(d => d.playlist_name)) // data, returns array
            .range([margin.left, width - margin.right]) // pixels on page
            .padding(0.1);

        let y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.duration_min)]).nice() // nice rounds the top num
            .range([height - margin.bottom, margin.top]); //svgs are built from top down, so this is reversed

        /* Update: simplfied axes */

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
            .call(d3.axisBottom(x))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr('font-size', 20)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.append("g")
            .attr("transform", `translate(${margin.left - 5},0)`)
            .call(d3.axisLeft(y))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr('font-size', 20)
            .attr("dx", "-.8em")
            .attr("dy", ".15em")

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Average Song Duration (min)");


        let bar = svg.selectAll(".bar") // create bar groups
            .append("g")
            .data(data)
            .join("g")
            .attr("class", "bar");

        bar.append("rect") // add rect to bar group
            .attr("fill", colors)
            .attr("x", d => x(d.playlist_name)) // x position attribute
            .attr("width", x.bandwidth()) // this width is the width attr on the element
            .attr("y", d => y(d.duration_min)) // y position attribute
            .attr("height", d => y(0) - y(d.duration_min)); // this height is the height attr on element

        bar.append('text') // add labels
            .attr('class', 'text')
            // .text(d => d.duration_min)
            // .attr('font-size', 50)
            .attr('x', d => x(d.playlist_name) + (x.bandwidth()/2))
            .attr('y', d => y(d.duration_min) + 13)
            .attr('text-anchor', 'middle')
            .style('fill', 'white');
        
    }

    function ti(data) {
        const tooltip = d3.select("body")
        .append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");
        // Copyright 2021 Observable, Inc.
        // Released under the ISC license.
        // https://observablehq.com/@d3/dot-plot
        function DotPlot(data, {
            x = ([x]) => x, // given d in data, returns the (quantitative) value x
            y = ([, y]) => y, // given d in data, returns the (categorical) value y
            z = () => 1, // given d in data, returns the (categorical) value z
            r = 3.5, // (fixed) radius of dots, in pixels
            xFormat, // a format specifier for the x-axis
            marginTop = 30, // top margin, in pixels
            marginRight = 60, // right margin, in pixels
            marginBottom = 10, // bottom margin, in pixels
            marginLeft = 100, // left margin, in pixels
            width = 840, // outer width, in pixels
            height = 640, // outer height, in pixels, defaults to heuristic
            xType = d3.scaleLinear, // type of x-scale
            xDomain, // [xmin, xmax]
            xRange = [marginLeft, width - marginRight], // [left, right]
            xLabel, // a label for the x-axis
            yDomain, // an array of (ordinal) y-values
            yRange, // [top, bottom]
            yPadding = 1, // separation for first and last dots from axis
            zDomain, // array of z-values
            colors, // color scheme
            stroke = "currentColor", // stroke of rule connecting dots
            strokeWidth, // stroke width of rule connecting dots
            strokeLinecap, // stroke line cap of rule connecting dots
            strokeOpacity, // stroke opacity of rule connecting dots
            duration: initialDuration = 250, // duration of transition, if any
            delay: initialDelay = (_, i) => i * 10, // delay of transition, if any
          } = {}) {
            data.sort((a, b) => {return d3.descending(a.release_date, b.release_date)});
            // Compute values.
            const X = d3.map(data, x);
            const Y = d3.map(data, y);
            const Z = d3.map(data, z);
            
    
            const track = d3.map(data, d => d.track_name);
            const artist = d3.map(data, d => d.artist_name);
            const album = d3.map(data, d => d.album_name);
            const release = d3.map(data, d => d.release_date);
            const track_pop = d3.map(data, d => d.popularity);
        
            // Compute default domains, and unique them as needed.
            if (xDomain === undefined) xDomain = d3.extent(X);
    
            if (yDomain === undefined) yDomain = Y;
            if (zDomain === undefined) zDomain = Z;
            yDomain = new d3.InternSet(yDomain);
            zDomain = new d3.InternSet(zDomain);
            console.log(zDomain)
            
    
            // Omit any data not present in the y- and z-domains.
            const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));
        
            // Compute the default height.
            if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 16) + marginTop + marginBottom;
            if (yRange === undefined) yRange = [marginTop, height - marginBottom];
        
            // Chose a default color scheme based on cardinality.
            // if (colors === undefined) colors = d3.schemeViridis[zDomain.size];
            
            if (colors === undefined) colors = d3.quantize(d3.interpolateViridis, zDomain.size);
        
            // Construct scales and axes.
            const xScale = xType(xDomain, xRange);
            
            const yScale = d3.scalePoint(yDomain, yRange).round(true).padding(yPadding);
            const color = d3.scaleOrdinal(zDomain, colors);
            const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
    
            const svg = d3.select("#chart")
                .append('svg')
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height]);
                // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        
            svg.append("g")
                .attr("transform", `translate(0,${marginTop})`)
                .call(xAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("y2", height - marginTop - marginBottom)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", width - marginRight)
                    .attr("y", -22)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(xLabel));
        
            const g = svg.append("g")
                .attr("text-anchor", "end")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
              .selectAll()
              .data(d3.group(I, i => Y[i]))
              .join("g")
                .attr("transform", ([y]) => `translate(0,${yScale(y)})`);
        
            g.append("line")
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linecap", strokeLinecap)
                .attr("stroke-opacity", strokeOpacity)
                .attr("x1", ([, I]) => xScale(d3.min(I, i => X[i])))
                .attr("x2", ([, I]) => xScale(d3.max(I, i => X[i])));
        
            g.selectAll("circle")
              .data(([, I]) => I)
              .join("circle")
                .attr("cx", i => xScale(X[i]))
                .attr("fill", i => color(Z[i]))
                .attr("r", r)
                .on("mousemove", function (event, i) {
                  tooltip
                    .style("visibility", "visible")
                    .html(`Song name: ${track[i]}
                          <br>Artist: ${artist[i]}
                          <br>Album: ${album[i]}
                          <br>Release Year: ${release[i]}
                          <br>Track Popularity: ${track_pop[i]}`)
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
                  d3.select(this).attr("fill", "goldenrod");
                })
                .on("mouseout", function (i) {
                  tooltip.style("visibility", "hidden");
                  d3.select(this).attr("fill", color(Z[i]));
                });
        
            g.append("text")
                .attr("dy", "0.35em")
                .attr("x", ([, I]) => xScale(d3.min(I, i => X[i])) - 6)
                .text(([y]) => y);
        
            return Object.assign(svg.node(), {
              color,
              update(yDomain, {
                duration = initialDuration, // duration of transition
                delay = initialDelay, // delay of transition
              } = {}) {
                yScale.domain(yDomain);
                const t = g.transition().duration(duration).delay(delay);
                t.attr("transform", ([y]) => `translate(0,${yScale(y)})`);
              }
            });
          }
    
          chart = DotPlot(data, {
            x: d => d.release_date,
            y: d => d.playlist_name,
            z: d => d.release_date,
            xFormat: "f",
            xLabel: "Year →"
          })
        
    }

    updateChart('genre')

    d3.selectAll("#filter")
      .on("change", function(d){
        selectedGroup = this.value
        console.log(selectedGroup)
        return updateChart(selectedGroup)
      }); 


})
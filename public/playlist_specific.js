Promise.all([
    d3.csv('../data/dates_edited_final.csv'),
    d3.csv('../data/playlist_descriptions_final.csv'),
    d3.csv('../data/features_w_track_info.csv'),
    d3.csv('../data/most_pop_genre_final.csv')
]).then(([data, desc, s, genre]) => {
    const width = 640,
        height = 640;

    let timeParse = d3.timeParse('%Y-%m-%d');
    let hourParse = d3.timeParse('%H:%M:%S')

    for (let d of data) {
        d.edited_ymd = timeParse(d.edited_ymd);
        d.edited_time = hourParse(d.edited_time);
    }
    allGroup = ['artsy fartsy', 'When you need it', `don't worry about it`, `i'd make u up`, 'flerw',
                `you're so stinkin' cute!!`, `hang on little tomato`, `songs that break my heart`,
                `looking for a savior`, `Heavy Feeling`, `Re-education pt. 1`, 'Re-education pt. 2',
                'Re-education pt. 3', 'Re-education pt. 4', 'Momma', `Lina's Country Classics`,
                `Lina's happy-ish love songs`, `Dancing slowly in a vast room`, 'Introducing:',
                'when you realize you’re both in love', 'to my future daughter or son', 'Apt. 435',
                'our first dance', 'Re-education: Bob Dylan', 'sing me to sleep',
                `dont worry, you're doing just fine`, 'a love letter to little me', 'You are safe',
                'coming of age online', `doin' the naughty`, 'wedding playlist 2', 'current nov22']

    d3.select("#filter")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })
        .attr('id', function (d) { return d; });

    

    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/beeswarm
    function updateChart(m) {

        d3.selectAll("svg").remove();

        let filtered = data.filter(d => d.playlist_name == m);
        let description = desc.filter(d => d.playlist_name == m);
        let sc = s.filter(d => d.playlist_name == m);
        let g = genre.filter(d => d.playlist_name == m);

        let date = new Set()
        var dateFormat = d3.timeFormat("%Y");
  
        for (let d of filtered) {
            date.add(d.edited_ymd);

        }

        d3.select("#description")
          .data(description)
          .text(d => d.description)
          .attr('font-size', 40);
        d3.select("#year")
          .data(filtered)
          .text(dateFormat(d3.min(date)))
          .attr('font-size', 40);

        chart = BeeswarmChart(filtered, {
            x: d => d.edited_time,
            label: "Hour",
            type: d3.scaleTime // try d3.scaleLog
          })

        
        scatter(sc)
        bubble(g)
        
    }

    function bubble(data) {
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

      const svg = d3.select("#chart3")  //Selecting id of chart. 
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .append('g')
        .attr('transform', 'translate(0,0)');

      var labels = svg.append('text');

      var radiusScale = d3.scaleSqrt().domain(d3.extent(data, d => d.count)).range([10, 35]);

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


    function scatter(data) {
      let height = 400,
          width = 600,
          margin = ({ top: 25, right: 30, bottom: 35, left: 40 });
      const tooltip = d3.select("body")
          .append("div")
          .attr("class", "svg-tooltip")
          .style("position", "absolute")
          .style("visibility", "hidden");
      // Selecting the ID of chart in the html page and appending an SVG to it. Adding a viewbox.
      console.log(data)
      const svg = d3.select("#chart2")
          .append("svg")
          .attr("viewBox", [0, 0, width, height]);
      let x = d3.scaleLinear()
      .domain([0, 1]).nice()
      .range([margin.left, width - margin.right]);
      // d3.extent(data, d => d.valence)
  
      // Setting the y-scale; domain is the data that will be used (set of all possible values)
      // range: extend of page taken up
      let y = d3.scaleLinear()
        .domain([0, 1]).nice()
        .range([height - margin.bottom, margin.top]);
        // d3.extent(data, d => d.energy)
  
      // Creating x and y axes line 19-27
      // Tick's create horizontal/vertical lines
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x))
        // Ticks here are vertical lines
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        // Ticks are horizontal lines
  
      // Appending SVG element
      svg.append("g")
        .attr("fill", "#003333")
        .selectAll("circle")
        // Joining data to circles; circles are the shape of the data points we want. 
        .data(data)
        .join("circle")
        // cx/cy how we position circles from center for x and y
        .attr("cx", d => x(d.valence))
        .attr("cy", d => y(d.energy))
        // r = radius of dots will be 2
        .attr("r", 5)
        .attr("opacity", 0.75)
        .on("mousemove", function (event, d) {
          let song = d.track_name;
          let artist = d.artist_name;
      
          tooltip
            .style("visibility", "visible")
            .html(`Song Name: ${song}
                  <br>Artist Name: ${artist}`)
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
          d3.select(this).attr("fill", "goldenrod");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
          d3.select(this).attr("fill", "#003333");
        });

      svg.append('text')
        .attr('x', 70)
        .attr('y', 50)
        .attr("fill", "black")
        .text('ANGRY');
      svg.append('text')
        .attr('x', 500)
        .attr('y', 45)
        .attr("fill", "black")
        .text('HAPPY');
      svg.append('text')
        .attr('x', 500)
        .attr('y', 350)
        .attr("fill", "black")
        .text('CALM');
      svg.append('text')
        .attr('x', 70)
        .attr('y', 350)
        .attr("fill", "black")
        .text('SAD');

      svg.append('line')
        .attr('x1', x(0.5))
        .attr('y1', y(0))
        .attr('x2', x(0.5))
        .attr('y2', y(1))
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "none");

      svg.append('line')
        .attr('x1', x(0))
        .attr('y1', y(0.5))
        .attr('x2', x(1))
        .attr('y2', y(0.5))
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "none");

      svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 3)
        .text("Valence");
      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Energy");
        
      return svg.node()
    }

    function BeeswarmChart(data, {
      value = d => d, // convenience alias for x
      label, // convenience alias for xLabel
      type = d3.scaleTime, // convenience alias for xType
      domain, // convenience alias for xDomain
      x = value, // given d in data, returns the quantitative x value
      title = null, // given d in data, returns the title
      group, // given d in data, returns an (ordinal) value for color
      groups, // an array of ordinal values representing the data groups
      colors = d3.schemeTableau10, // an array of color strings, for the dots
      radius = 3, // (fixed) radius of the circles
      padding = 1.5, // (fixed) padding between the circles
      marginTop = 10, // top margin, in pixels
      marginRight = 20, // right margin, in pixels
      marginBottom = 30, // bottom margin, in pixels
      marginLeft = 20, // left margin, in pixels
      width = 640, // outer width, in pixels
      height, // outer height, in pixels
      xType = type, // type of x-scale, e.g. d3.scaleLinear
      xLabel = label, // a label for the x-axis
      xDomain = domain, // [xmin, xmax]
      xRange = [marginLeft, width - marginRight] // [left, right]
    } = {}) {
      // Compute values.
      const X = d3.map(data, x).map(x => x == null ? NaN : +x);
      const T = title == null ? null : d3.map(data, title);
      const G = group == null ? null : d3.map(data, group);
    
      // Compute which data points are considered defined.
      const I = d3.range(X.length).filter(i => !isNaN(X[i]));
    
      // Compute default domains.
      if (xDomain === undefined) xDomain = d3.extent(X);
      if (G && groups === undefined) groups = d3.sort(G);
    
      // Construct scales and axes.
      const xScale = xType(xDomain, xRange);
      const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
      const color = group == null ? null : d3.scaleOrdinal(groups, colors);
    
      // Compute the y-positions.
      const Y = dodge(I.map(i => xScale(X[i])), radius * 2 + padding);
    
      // Compute the default height;
      if (height === undefined) height = d3.max(Y) + (radius + padding) * 2 + marginTop + marginBottom;
    
      // Given an array of x-values and a separation radius, returns an array of y-values.
      function dodge(X, radius) {
        const Y = new Float64Array(X.length);
        const radius2 = radius ** 2;
        const epsilon = 1e-3;
        let head = null, tail = null;
    
        // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
        function intersects(x, y) {
          let a = head;
          while (a) {
            const ai = a.index;
            if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
            a = a.next;
          }
          return false;
        }
    
        // Place each circle sequentially.
        for (const bi of d3.range(X.length).sort((i, j) => X[i] - X[j])) {
    
          // Remove circles from the queue that can’t intersect the new circle b.
          while (head && X[head.index] < X[bi] - radius2) head = head.next;
    
          // Choose the minimum non-intersecting tangent.
          if (intersects(X[bi], Y[bi] = 0)) {
            let a = head;
            Y[bi] = Infinity;
            do {
              const ai = a.index;
              let y = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
              if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
              a = a.next;
            } while (a);
          }
      
          // Add b to the queue.
          const b = {index: bi, next: null};
          if (head === null) head = tail = b;
          else tail = tail.next = b;
        }
      
        return Y;
      }
    
      const svg = d3.select("#chart")
          .append('svg')
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
    
      svg.append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(xAxis)
          .call(g => g.append("text")
              .attr("x", width)
              .attr("y", marginBottom - 4)
              .attr("fill", "currentColor")
              .attr("text-anchor", "end")
              .text(xLabel));
    
      const dot = svg.append("g")
        .selectAll("circle")
        .data(I)
        .join("circle")
          .attr("cx", i => xScale(X[i]))
          .attr("cy", i => height - marginBottom - radius - padding - Y[i])
          .attr("r", radius);
    
      if (G) dot.attr("fill", i => color(G[i]));
    
      if (T) dot.append("title")
          .text(i => T[i]);
    
      return svg.node();
    }

    updateChart('artsy fartsy')

    d3.selectAll("#filter")
      .on("change", function(d){
        selectedGroup = this.value
        console.log(selectedGroup)
        return updateChart(selectedGroup)
      }); 

})



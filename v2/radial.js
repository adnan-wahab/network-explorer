let d3 = require('d3');

  function square(x) {
    return x * x;
  }

  function radial() {
    var linear = d3.scaleLinear();

    function scale(x) {
      return Math.sqrt(linear(x));
    }

    scale.domain = function(_) {
      return arguments.length ? (linear.domain(_), scale) : linear.domain();
    };

    scale.nice = function(count) {
      return (linear.nice(count), scale);
    };

    scale.range = function(_) {
      return arguments.length ? (linear.range(_.map(square)), scale) : linear.range().map(Math.sqrt);
    };

    scale.ticks = linear.ticks;
    scale.tickFormat = linear.tickFormat;

    return scale;
  }

  d3.scaleRadial = radial;

var svg = d3.select("body").append('svg'),
    width = 500,
    height = 250,
    innerRadius = 90,
    outerRadius = Math.min(width, height) * 0.77,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height * 0.78 + ")");

var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

var y = d3.scaleRadial()
    .range([innerRadius, outerRadius]);

var z = d3.scaleOrdinal()
    .range([
        "#eff3ff",
        "#bdd7e7",
        "#6baed6",
        "#2171b5"
      ]);

d3.csv("/v2/data.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.cat; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  let radial = g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("fill", 'steelblue')
    .selectAll("path")
    .data(function(d) { return d; })
      .enter().append("path")


  
  
  window.heightRadial = function (n) {
    let k =radial
        .transition()
        .attr("d", d3.arc()
                .innerRadius(function(d,i ) { return y(d[1] + (1e6 * n[i] || 0)); })
                .outerRadius(function(d, i) { return y(d[0]) })
                .startAngle(function(d) { return x(d.data.cat); })
                .endAngle(function(d) { return x(d.data.cat) + x.bandwidth(); })
                .padAngle(0.01)
                       .padRadius(innerRadius));

    return k
  }

  heightRadial([])

  var label = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "rotate(" + ((x(d.cat) + x.bandwidth() / 2) * 180 / Math.PI - 45) +
          ")translate(" + innerRadius + ",0)"; });

  // label.append("line")
  //     .attr("x2", -5)
  //     .attr("stroke", "#000");

  // label.append("text")
  //     .attr("transform", function(d) { return (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
  //     .text(function(d) { return d.State; });

  // var yAxis = g.append("g")
  //     .attr("text-anchor", "end");

  // var yTick = yAxis
  //   .selectAll("g")
  //   .data(y.ticks(10).slice(1))
  //   .enter().append("g");

  // yTick.append("circle")
  //     .attr("fill", "none")
  //     .attr("stroke", "#000")
  //     .attr("stroke-opacity", 0.5)
  //     .attr("r", y);

  // yTick.append("text")
  //     .attr("x", -6)
  //     .attr("y", function(d) { return -y(d); })
  //     .attr("dy", "0.35em")
  //     .attr("fill", "none")
  //     .attr("stroke", "#fff")
  //     .attr("stroke-linejoin", "round")
  //     .attr("stroke-width", 3)
  //     .text(y.tickFormat(10, "s"));

  // yTick.append("text")
  //     .attr("x", -6)
  //     .attr("y", function(d) { return -y(d); })
  //     .attr("dy", "0.35em")
  //     .text(y.tickFormat(10, "s"));

  // yAxis.append("text")
  //     .attr("x", -6)
  //     .attr("y", function(d) { return -y(y.ticks(10).pop()); })
  //     .attr("dy", "-1em")
  //     .text("Population");

  // var legend = g.append("g")
  //   .selectAll("g")
  //   .data(data.columns.slice(1).reverse())
  //   .enter().append("g")
  //     .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });

  // legend.append("rect")
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .attr("fill", z);

  // legend.append("text")
  //     .attr("x", 24)
  //     .attr("y", 9)
  //     .attr("dy", "0.35em")
  //     .text(function(d) { return d; });
});

function weave(array, compare) {
  var i = -1, j, n = array.sort(compare).length, weave = new Array(n);
  while (++i < n) weave[i] = array[(j = i << 1) >= n ? (n - i << 1) - 1 : j];
  while (--n >= 0) array[n] = weave[n];
}


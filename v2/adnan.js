//require('./stress.js')

//require('./pix')

//require('./party')

let d3 = require('d3')
let _ = require('underscore')

require('./radial')

d3.json('../data/join.json', (err, join) => {
  console.log(join)

  window.join = join

  let v = _.values(join.connections).map(function (d) { return d.length })

  let sum = _.reduce(v, function(memo, num){ return memo + num; }, 0);

  let nodes = Object.keys(join.movies).map(function (key, idx) {
    return _.extend(join.movies[key], {
      name: key
    })
  });

  let p = _.pluck(nodes, 'name')

  renderMovies(p.slice(1000), join.tags)
  renderGraph(
    _.sample(p, 300)
  )
})

window.d3 = d3


function drawEdges (d, i) {
  window.lines = []
  for (let j = 0; j < 20; j++) {
    lines.push({
      source: dots[j],
      target: dots[j+i]
    })
  }

}



function renderMovies(nodes, edges) {
  d3.selectAll('.movies').selectAll('.row').data(nodes).enter()
    .append('div')
    .attr('class', 'row')
    .text((d) => {
      return d
    })
    .on('mouseover', function (d, i) {
      heightRadial(_.shuffle(_.range(20)))
      
    })
    .on('click', function (d) {
      let shift = d3.event.shiftKey

      if (shift)
        switchIframe(d)

      renderTags(
        getEdges(d)
      )
    })
}

let escape = require('escape-html')

function switchIframe(title) {
  let base = 'http://ytinstant.com/'

  let k = (Math.random() * 9 | 0)
  let src= base + '?v'+ k +  + '#' + escape(title)

  d3.select('iframe').attr('src', src).on('load')

  d3.select('.iframe-container')
    .style('opacity', 0)

  d3.select('.iframe-container').transition().duration(3000)
    .style('opacity', 1)

}

function getEdges(node) {
  return (join.movies[node] || {}).edges
}


function getAllSimilar(node) {
  return _.flatten(
    node.tags.map(function (tagname) {
      return window.join.connections[tagname]
    })
  )

}

function renderNodes(edge) {
  let nodes = join.connections[edge.name]

  d3.selectAll('.movies .row').data(nodes)
    .text((d) => { return d  })
}

function renderTags(edges) {
  let rows = d3.selectAll('.tags').selectAll('.row').data(edges).enter()
    .append('div')
      .attr('class', 'row')
      .on('click', function (d) {
        renderNodes(d)
      })
      .on('mouseover', function (d, i) {

        drawEdges(d, i % 300)
        ticked()
        
      })
  

  d3.selectAll('.tags').selectAll('.row')
    .data(edges).html((d, i) => {
      return `<span class="left">${d.name}</span><span class="right">${percent(d)}</span>`
    })
}

function percent(d) {
  return Math.floor((d.value) * 100) + '%'
}

function renderGraph (nodes, edges) {
  var width = 960,
  height = 500,
  τ = 2 * Math.PI,
  maxLength = 100,
  maxLength2 = maxLength * maxLength;

  nodes = nodes.map(function (d) {
    d = {name: d}
    d.x = Math.random() * width
    d.y = Math.random() * height
    return d
  });

  window.dots = nodes
  
  var force = d3.forceSimulation(nodes)
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .force("charge", d3.forceManyBody().strength(-10))
      .on("tick", ticked);

  var root = nodes.shift();

  root.fixed = true;

  var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height)
    .on("ontouchstart" in document ? "touchmove" : "mousemove", moved);

  var context = canvas.node().getContext("2d");

  function moved() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
  }

  window.ticked = ticked
  function ticked() {
    context.clearRect(0, 0, width, height);

    context.beginPath();
    let links = window.lines || []
    for (var i = 0, n = links.length; i < n; ++i) {
      var link = links[i],
      dx = link.source.x - link.target.x,
      dy = link.source.y - link.target.y;
      if (dx * dx + dy * dy < maxLength2) {
        context.moveTo(link.source.x, link.source.y);
        context.lineTo(link.target.x, link.target.y);
      }
    }

    context.lineWidth = 1;
    context.strokeStyle = "#333";
    context.stroke();

    context.beginPath();

    
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[i];
      context.moveTo(node.x, node.y);
      context.arc(node.x, node.y, 2, 0, τ);
    }
    
    context.lineWidth = 3;
    context.strokeStyle = "#fff";
    context.stroke();
    context.fillStyle = "#000";
    context.fill();
  }

}

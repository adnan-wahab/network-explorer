//require('./stress.js')

require('./pix')

//require('./party')

// let d3 = require('d3')
// let populate = (el) => {
//   let input = d3.select(el)

//   console.log('YO')

//   input.selectAll('option').data(
//     d3.shuffle(Object.values(tags))
//       .map((d) => { return d.name })
//   ).enter().append('option').text((d) => { return  d })
// }

// d3.json('../data/join.json', (err, data) => {
//   window.data = data
// })

// let init = () => {
//   document.querySelectorAll('select').forEach(populate)
// }

// d3.json('../data/tags.json', (err, tags) => {
//   d3.json('../data/movies.json', (err, movies) => {
//     window.tags = tags
//     window.movies = movies

//   })
// })


// console.log(123122)

// let size = {width: 960, height: 500 }
// let svg = d3.select('body').append('svg')
//     .attr('width', size.width)
//     .attr('height', size.height)

// function dostuff (hi) {
//   window.data = hi
 
//   svg.selectAll('circle').data(data)
//     .enter().append('circle')
//     .attr('cx', Math.random() * size.height)
//     .attr('cy', Math.random() * size.height) 
//     .attr('r', 10)
//     .attr('fill', 'pink')
// }




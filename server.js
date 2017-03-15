let app = require('express')()
let fs = require('fs')


let join = fs.readFileSync('./data/join.json').toString()
console.log('join loaded')

console.log(join


           )

app.get('/tags/<movie_id>', (req, res) => {
})

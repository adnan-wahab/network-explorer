// /**
//  * This is an example on how to use sigma filters plugin on a real-world graph.
//  */
// var filter;

// /**
//  * DOM utility functions
//  */
// var _ = {
//   $: function (id) {
//     return document.getElementById(id);
//   },

//   all: function (selectors) {
//     return document.querySelectorAll(selectors);
//   },

//   removeClass: function(selectors, cssClass) {
//     var nodes = document.querySelectorAll(selectors);
//     var l = nodes.length;
//     for ( i = 0 ; i < l; i++ ) {
//       var el = nodes[i];
//       // Bootstrap compatibility
//       el.className = el.className.replace(cssClass, '');
//     }
//   },

//   addClass: function (selectors, cssClass) {
//     var nodes = document.querySelectorAll(selectors);
//     var l = nodes.length;
//     for ( i = 0 ; i < l; i++ ) {
//       var el = nodes[i];
//       // Bootstrap compatibility
//       if (-1 == el.className.indexOf(cssClass)) {
//         el.className += ' ' + cssClass;
//       }
//     }
//   },

//   show: function (selectors) {
//     this.removeClass(selectors, 'hidden');
//   },

//   hide: function (selectors) {
//     this.addClass(selectors, 'hidden');
//   },

//   toggle: function (selectors, cssClass) {
//     var cssClass = cssClass || "hidden";
//     var nodes = document.querySelectorAll(selectors);
//     var l = nodes.length;
//     for ( i = 0 ; i < l; i++ ) {
//       var el = nodes[i];
//       //el.style.display = (el.style.display != 'none' ? 'none' : '' );
//       // Bootstrap compatibility
//       if (-1 !== el.className.indexOf(cssClass)) {
//         el.className = el.className.replace(cssClass, '');
//       } else {
//         el.className += ' ' + cssClass;
//       }
//     } 
//  }
// };


// function updatePane (graph, filter) {
//   // get max degree
//   var maxDegree = 0,
//       categories = {};
  
//   // read nodes
//   graph.nodes().forEach(function(n) {
//     maxDegree = Math.max(maxDegree, graph.degree(n.id));
//     categories[n.attributes.acategory] = true;
//   })

//   // min degree
//   _.$('min-degree').max = maxDegree;
//   _.$('max-degree-value').textContent = maxDegree;
  
//   // node category
//   var nodecategoryElt = _.$('node-category');
//   Object.keys(categories).forEach(function(c) {
//     var optionElt = document.createElement("option");
//     optionElt.text = c;
//     nodecategoryElt.add(optionElt);
//   });

//   // reset button
//   _.$('reset-btn').addEventListener("click", function(e) {
//     _.$('min-degree').value = 0;
//     _.$('min-degree-val').textContent = '0';
//     _.$('node-category').selectedIndex = 0;
//     filter.undo().apply();
//     _.$('dump').textContent = '';
//     _.hide('#dump');
//   });

//   // export button
//   _.$('export-btn').addEventListener("click", function(e) {
//     var chain = filter.export();
//     console.log(chain);
//     _.$('dump').textContent = JSON.stringify(chain);
//     _.show('#dump');
//   });
// }

// function filters (s) {
//   // Initialize the Filter API
//   filter = new sigma.plugins.filter(s);

//   updatePane(s.graph, filter);

//   function applyMinDegreeFilter(e) {
//     var v = e.target.value;
//     _.$('min-degree-val').textContent = v;

//     filter
//       .undo('min-degree')
//       .nodesBy(function(n) {
//         return this.degree(n.id) >= v;
//       }, 'min-degree')
//       .apply();
//   }

//   function applyCategoryFilter(e) {
//     var c = e.target[e.target.selectedIndex].value;
//     filter
//       .undo('node-category')
//       .nodesBy(function(n) {
//         return !c.length || n.attributes.acategory === c;
//       }, 'node-category')
//       .apply();
//   }

//   _.$('min-degree').addEventListener("input", applyMinDegreeFilter);  // for Chrome and FF
//   _.$('min-degree').addEventListener("change", applyMinDegreeFilter); // for IE10+, that sucks
//   _.$('node-category').addEventListener("change", applyCategoryFilter);
// }

// console.log(123)
// sigma.parsers.gexf('data/moroccan-ediaspora.gexf', {
//   container: 'graph-container',
//   settings: {
//     edgeColor: 'red',
//     defaultEdgeColor: '#999'
//   }
// }, filters);


 var g = {
        nodes: [],
        edges: []
    };

   // Create new Sigma instance in graph-container div (use your div name here) 
   s = new sigma({
   graph: g,
   container: 'graph-container',
   renderer: {
    container: document.getElementById('graph-container'),
    type: 'canvas'
   },
   settings: {
    minNodeSize: 8,
    maxNodeSize: 16
   }
   });

   // first you load a json with (important!) s parameter to refer to the sigma instance   

   sigma.parsers.json(
        '/data/join.json',
        s,
     function() {
       
            // this below adds x, y attributes as well as size = degree of the node 
            var i,
                    nodes = s.graph.nodes(),
                    len = nodes.length;

            for (i = 0; i < len; i++) {
                nodes[i].x = Math.random();
                nodes[i].y = Math.random();
                nodes[i].size = s.graph.degree(nodes[i].id);
                nodes[i].color = nodes[i].center ? '#333' : '#666';
            }

            // Refresh the display:
            s.refresh();

            // ForceAtlas Layout
            // s.startForceAtlas2();
        }
   ); 

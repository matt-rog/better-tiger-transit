import {Graph} from '../Graph.js';
import buses from './buses.json' assert { type: "json" };
import stops from './stops.json' assert { type: "json" };
import routes from './routes.json' assert { type: "json" }; 
//  Only active routes, or routes with eta's
var activeRoutes = routes.filter(function(route, index, arr){ 
    return route.active && Object.keys(route.stop_etas).length != 0;
});

// Init Evergreen as start
var startStop = stops.filter(function(v, i, r){
    return v.id == 190
})[0]

// Init Med clinic as end
var endStop = stops.filter(function(v, i, r){
    return v.id == 87
})[0]

let c = 0;
let o = 0;
for (let i = 0; i < routes.length; i++) {
    var route = routes[i]   
    if( route.stops.length != Object.keys(route.stop_etas).length){
        c++;
        if(Object.keys(route.stop_etas).length == 0){
            o++;
        }
        //c = c + Math.abs(route.stops.length - Object.keys(route.stop_etas))
    }
}
//console.log(c)
//console.log(o)


var transit = new Graph(stops, activeRoutes, true);

//var result = transit.DepthFirst('190');
console.log("\n\n")
console.log("Calculating fastest route from " + startStop.name + " to " + endStop.name + "...")
console.log("\n")
var result = transit.Dijkstra('190', '87')
//console.log(result)

let time = 0;
for (let i = 0; i < result.length; i++) {
    var point = result[i]
    if (typeof point !== "object"){
        var stop = stops.filter(function(v, i, r){
            return v.id.toString() == point
        })[0]
        console.log("Starting at " + stop.name + ":")
    } else {
        var from = stops.filter(function(v, i, r){
            return v.id.toString() == point.from
        })[0]
        var to = stops.filter(function(v, i, r){
            return v.id.toString() == point.to
        })[0]
        var weight = point.weight;
        let route = point.route;
        if( point.route != "W"){
            route = routes.filter(function(v, i, r){
                return v.id.toString() == point.route.toString()
            })[0]
            route = route.name
        }
        time += weight
        console.log("Take " + (route == "W" ? "a walk" : route) + " from " + from.name + " to " + to.name + ". (ETA " + Math.round(weight * 10) / 10 + " mins)");
    }
}

console.log("\n")
console.log("Total time: " + Math.round(time) + " minute(s).")
console.log("\n\n")

// for (let i = 0; i < result.length; i++) {
//     var point = result[i]
//     var stop = stops.filter(function(v, i, r){
//         return v.id.toString() == point
//     })[0]
//     console.log(stop.name);
// }
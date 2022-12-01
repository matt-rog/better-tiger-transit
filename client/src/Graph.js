//import { writeFile } from 'fs';

export class Graph {

    constructor(stops, routes, allowWalking){

        this.adjacencyList = {};
        this.stopNodes = [];
        this.stops = stops
        this.routes = routes
        for (let i = 0; i < stops.length; i++) {
            var stop = stops[i];
            // Init StopNode
            //var node = new StopNode(stop.id, [], haversine(stop.lat, stop.lon, endStop.lat, endStop.lon));
            this.addStopNode(stop.id);
            
            // Adding adjacent stops through official bus routes
            for (let i = 0; i < routes.length; i++) {
                var route = routes[i];        
                var indexInRoute = route.stops.indexOf(stop.id);        
                if(route.stops.length !== 0 && indexInRoute !== -1){ // this stop is a part of this route
                    // the next stop for this route comes after the index of the current one (it cycles)
                    var nextStopID = route.stops[(indexInRoute >= route.stops.length-1 ? 0 : indexInRoute + 1)];
                    // var nextStop = stops.filter(function(v, i, r){
                    //     return v.id === nextStopID;
                    // })[0];
                    //var newNode = new StopNode(stop.id, haversine(nextStop.lat, nextStop.lon, endStop.lat, endStop.lon));
                    this.addStopNode(nextStopID);
                    this.addEdge(stop.id, nextStopID, route);
                }
            }

            if( allowWalking ){
                for (let i = 0; i < stops.length; i++) {
                    var nextStop = stops[i];
                    if(nextStop.id !== stop.id){
                        this.addStopNode(nextStop.id);
                        this.addEdge(stop.id, nextStop.id, "W");
                    }
                }
            } 
        }

        // writeFile("adjacency.json", JSON.stringify(this.adjacencyList, null, 4), function(err) {
        //     if(err) {
        //       console.log(err);
        //     }
        // });
    }

    addStopNode(stopNode){
        // add a vertex to the adjacency list if it does not exist
        if (!this.adjacencyList[stopNode.toString()]){
            this.adjacencyList[stopNode.toString()] = [];
            this.stopNodes.push(stopNode.toString());
        }
    }

    addEdge(stop1, stop2, route){

        if(route !== "W"){
            if(stop1.toString() in route.stop_etas && stop2.toString() in route.stop_etas){
                var eta1 = route.stop_etas[stop1.toString()].etas[0].avg;
                var eta2 = route.stop_etas[stop2.toString()].etas[0].avg;
                let timeCost;
                if( eta2-eta1 > 0){
                    timeCost = eta2-eta1;
                } else {
                    timeCost = eta1;
                }
                this.adjacencyList[stop1].push({node: stop2.toString(), route: route.id, weight: timeCost});
            }
        } else {
            let stop = this.stops.filter(function(v, i, r){
                return v.id === stop1;
            })[0];
            let nextStop = this.stops.filter(function(v, i, r){
                return v.id === stop2;
            })[0];

            let distance = haversine(stop.lat, stop.lon, nextStop.lat, nextStop.lon)
            let timeCost = distance * 12 // Average time to walk 1 kilometer is 12 minutes

            this.adjacencyList[stop1].push({node: stop2.toString(), route: route, weight: timeCost});
        }
        
    }

    getAdjacencyList(){
        return this.adjacencyList;
    }

    Dijkstra(start, end) {

        let queue = new PriorityQueue();
        const distances = {};
        const previous = {};
        
        let path = []; // to return at the end
        let smallest;

        // Initializing all distances except start to Infinity
        // Initializing tracking data structures
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                queue.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                queue.enqueue(vertex, Infinity);
            }
            //previous[vertex] = null;
            previous[vertex] = {node: null, route: null, weight: null};
        }
        while (Object.keys(queue.elements).length) {
            smallest = queue.dequeue();
            smallest = smallest.element
            if (smallest === end) {
                while(previous[smallest].node) {
                    //console.log(smallest)
                    //console.log(previous[smallest])
                    let nextObject = previous[smallest];
                    path.push({to: smallest, from: nextObject.node, route: nextObject.route, weight: nextObject.weight});
                    smallest = previous[smallest].node;
                }
                break;
            }
            if (smallest || distances[smallest] !== Infinity) {   
                for (let neighbor in this.adjacencyList[smallest]) {
                    let nextNode = this.adjacencyList[smallest][neighbor];

                    let candidate = distances[smallest] + nextNode.weight;
                    let neighborValue = nextNode.node;

                    if (candidate < distances[neighborValue]) {
                        // update 'distances' object
                        distances[neighborValue] = candidate;
                        // update 'previous' object
                        previous[neighborValue] = {node: smallest, route: nextNode.route, weight: nextNode.weight};
                        // enqueue priority queue with new smallest distance
                        queue.enqueue(neighborValue, candidate)
                    }
                }
            }
        }
        return path.concat(smallest).reverse();
    }
}

class QueueElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
      this.elements = [];
    }
    enqueue(element, priority){
        // creating object from queue element
        var qElement = new QueueElement(element, priority);
        var contain = false;
    
        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.elements.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
    
        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.elements.push(qElement);
        }
    }
    dequeue(){
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.elements.shift();
    }

    isEmpty(){
        // return true if the queue is empty.
        return this.elements.length === 0;
    }
}

function haversine(lat1, lon1, lat2, lon2){
    var earthRadius = 6731; // in kilometers
    
    var distanceLat = degreeToRadian(lat2-lat1);
    var distanceLon = degreeToRadian(lon2-lon1);

    lat1 = degreeToRadian(lat1);
    lat2 = degreeToRadian(lat2);

    // Haversine formula
    var a = Math.sin(distanceLat/2) * Math.sin(distanceLat/2) + Math.sin(distanceLon/2) * Math.sin(distanceLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return earthRadius * c;
}

function degreeToRadian(degree){
    return degree * Math.PI / 180;
}
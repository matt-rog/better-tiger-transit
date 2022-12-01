# Better Tiger Transit
 
<p align="center">
    <img height=400 src="https://raw.githubusercontent.com/Matt-Rog/better-tiger-transit/main/client/public/demo.png">
</p>

## Problem
Auburn’s Tiger Transit offers 23 bus routes that serve 159 stops, both on and off-campus. The transit ensures local students have free, reliable transportation between residential spaces and campus. However, many students will find that important campus locations are only serviced by one route that likely is nowhere near them. The guaranteed approach to this situation is to take your local bus route to one of the two “transit hubs” where all routes converge, and then take the route that contains your destination stop. This approach, while correct, is often time-consuming. Between 159 stops and 23 routes, I believe that for a lot of scenarios there must be a faster solution. However, given the amount of data, it is unreasonable to expect a human to calculate which routes to take on their way to campus. I think that if we use information about the transit system to construct an accurate digraph, then we can use Dijktra's path-finding algorithm to deliver the quickest route between any two stops.

## Solution
The project will find the quickest route between two bus stops at Auburn University, using information from multiple bus routes. Users can define a starting bus stop and destination bus stop, as well as whether or not the solution route should consider walking distances between stops as viable “edges”. The program will return the quickest route from the start point to the endpoint using Auburn’s bus lines.
<br></br>

*Final project for COMP 3240 - Fall 2022*


 

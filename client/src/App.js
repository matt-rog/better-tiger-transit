import React, {useEffect, useState} from 'react'
import {Label, Select, ToggleSwitch, Button, Spinner} from 'flowbite-react';
import './App.css';

import githubLogo from './assets/github.png';

import {Graph} from './Graph.js';
import stops from './assets/stops.json';
import routes from './assets/routes.json'; 


function App() {

  const [stopData, setStopData] = useState([])
//  const [routeData, setRouteData] = useState([])

  const [validStarts, setValidStarts] = useState([])
  const [validEnds, setValidEnds] = useState([])
  const [inputData, setInputData] = useState({"startID": "87", "endID": "191", "allowWalking": true})

  const [result, setResult] = useState([])
  const [isGenerated, setIsGenerated] = useState([-1])
  
  useEffect(() => {

    setStopData(stops)
    setValidStarts(stops.sort(function(x,y){ return x.id.toString() === "87" ? -1 : y.id.toString() === "87" ? 1 : 0; }))
    setValidEnds(stops.filter(stop => stop.id.toString() !== "87").sort(function(x,y){ return x.id.toString() === "191" ? -1 : y.id.toString() === "191" ? 1 : 0; }))

    // fetch("/stops").then(
    //   response => response.json()
    // ).then(
    //   data => {
    //     // Using temp data
    //     // data = stops
    //     // setStopData(data)
    //     // setValidStarts(data.sort(function(x,y){ return x.id.toString() === "87" ? -1 : y.id.toString() === "87" ? 1 : 0; }))
    //     // setValidEnds(data.filter(stop => stop.id.toString() !== "87").sort(function(x,y){ return x.id.toString() === "191" ? -1 : y.id.toString() === "191" ? 1 : 0; }))
    //   }
    // )

  //   fetch("/routes").then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setRouteData(data)
  //     }
  //   )
  }, [])

  function graphDriver() {
    setIsGenerated(0)
    var activeRoutes = routes.filter(function(route, index, arr){ 
      return route.active && Object.keys(route.stop_etas).length !== 0;
    });

    var transit = new Graph(stops, activeRoutes, inputData.allowWalking);

    var result = transit.Dijkstra(inputData.startID, inputData.endID);
    setResult(result)
    setIsGenerated(-1)


  }

  const getRoute = (routeID) => {
    if( routeID === 'W' ){
      return {'name': 'Walk'}
    }
    return routes.filter(route => route.id === routeID)[0]
  }

  const getStop = (stopID) => {
    return stops.filter(stop => stop.id.toString() === stopID)[0]
  }

  const routeNotFound = () => { return <p>{"Route not found :("}</p> }

  return (
    <div className='container'>

        <Button style={{position: 'fixed', bottom: 20, right: 20, zIndex: 100}} 
          href="https://github.com/Matt-Rog/better-tiger-transit" target="_blank" rel="noopener noreferrer"
          className='bg-gradient-to-r to-blue-600 from-indigo-600'>
            <img alt="GitHub Logo" className="logo" src={githubLogo}>
            </img>
          </Button>


        <div className='header'>
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">A
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-600 from-indigo-600"> Better </span>
          Tiger Transit</h1>
          <p className="center text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Find the quickest route between bus stops at Auburn University.</p>
        </div>

    
    <div className='input'>

      <Label>Please select a starting point</Label>
      <Select
        id="stops"
        required={true}
        onChange={opt => {
          let stopID = opt.target.value;
          setInputData({...inputData, 'startID': stopID});
          setValidEnds(stopData.filter(stop => stop.id.toString() !== stopID))
          setValidStarts(stopData)
        }}
      >
        {(
            validStarts.map((stop, i) => {
              return <option key={stop.id} value={stop.id}>{stop.name}</option>
            })
          )}
      </Select>

      <br></br>
      <Label>Please select a destination point</Label>
      <Select
        id="stops"
        required={true}
        onChange={opt => {
          let stopID = opt.target.value;
          setInputData({...inputData, 'endID': stopID});
          setValidStarts(stopData.filter(stop => stop.id.toString() !== stopID))
          setValidEnds(stopData)
        }}
      >
        {(
            validEnds.map((stop, i) => {
              return <option key={stop.id} value={stop.id}>{stop.name}</option>
            })
          )}
      </Select>

      <br></br>
      <ToggleSwitch
        checked = {inputData.allowWalking}
        label='Allow walking?'
        onChange={checked => {
          setInputData({...inputData, 'allowWalking': checked});
        }}/>

      <div className='button'>
        <Button
          onClick={() => graphDriver()}
          className={isGenerated !== 0 ?'bg-gradient-to-r to-blue-600 from-indigo-600' : "gray"}>
            <div>{isGenerated === 0 ? <Spinner/> : <div></div>}</div>
            <span className="font-bold">{isGenerated >= 0 ? "Loading..." : "Find route"}</span>
        </Button>
        
      </div>
    </div>
    <div className='result'>
      {result.length === 1 ? routeNotFound() : (
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          {result.map((point, i) => {
            if( typeof point === 'object'){
              return (
                <li className="icon mb-10 ml-6">            
                  <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    {(i !== result.length-1) ?
                      <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                     :<svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>}
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-whitefont-extrabold md:text-base lg:text-lg sm:text-base xs:text-xs ">
                    {(i === 1) ? 
                      <span class="underline underline-offset-3 decoration-100 decoration-blue-400 dark:decoration-blue-600">{getStop(point.from).name}</span>
                      : getStop(point.from).name}
                    <svg class="w-4 h-4 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    {(i === result.length-1) ? 
                      <span class="icon underline underline-offset-3 decoration-100 decoration-blue-400 dark:decoration-blue-600">{getStop(point.to).name}</span>
                      : getStop(point.to).name}
                    <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">{getRoute(point.route).name}</span></h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 time">
                    <svg className="icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {(Math.round(point.weight * 10) / 10).toString() + " mins"}
                  </time>
                </li>
              )
            } else {
              return <p></p>
            }
          })}
        </ol>
        
      )}
    </div>

    </div>
  )
}

export default App
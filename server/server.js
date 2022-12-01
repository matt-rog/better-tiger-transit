const { response } = require('express');
const express = require('express');
const fetch = require('node-fetch');


const app = express();

app.get('/api', (req, res) => {
    res.json({'msg': 'it works! :)'})
})

app.get('/stops', (req, res) => {
    fetch('https://auburn.doublemap.com/map/v2/stops')
    .then(response => response.json())
    .then(body => {
        res.json(body)
    }); 
})

app.get('/routes', (req, res) => {
    fetch('https://auburn.doublemap.com/map/v2/stops')
    .then(response => response.json())
    .then(routes => {
        let newRoutes = [];
        
        for (let i = 0; i < routes.length; i++) {
            let route = routes[i]
            let etaUrl = "https://auburn.doublemap.com/map/v2/eta?route=" + route.id.toString();

            fetch(etaUrl)
            .then(response => response.json())
            .then(eta => {
                routes[i]['stop_etas'] = eta.etas;
                newRoutes.push(routes[i]);
            })
        }
        
        res.json(newRoutes)
    }); 
})

app.listen(8080, () => {console.log("running on 8080 :)")})
const { response } = require('express');
const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 8080;

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

app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/my-app/build/"));


app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/my-app/build/index.html");
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
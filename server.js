const express = require('express'),
bodyParser = require('body-parser'),
Sequelize = require('sequelize')

const sequelize = new Sequelize('VremeDB','root','',{
    dialect: 'mysql',
    define: {
        timestamps:false
    }
})


const Weather = sequelize.define('weathers', {
    locationName : {
        type: Sequelize.STRING
    },
    weatherDescribe : {
        type : Sequelize.STRING
    },
    degrees : {
        type : Sequelize.STRING
    },
      latitude : {
        type : Sequelize.STRING
    },
      longitude : {
        type : Sequelize.STRING
    },
     country : {
        type : Sequelize.STRING
    }
})
AddData();

function AddData()
{
  Weather.create({locationName:'Bucuresti',weatherDescribe:'rainy',degrees:'1 C',latitude:'44',longitude:'26',country:'Romania'});
  Weather.create({locationName:'Targoviste',weatherDescribe:'snow',degrees:'-3 C',latitude:'43',longitude:'25',country:'Romania'});
  Weather.create({locationName:'Brasov',weatherDescribe:'snow',degrees:'-5 C',latitude:'45',longitude:'22',country:'Romania'});
  
}


var Wunderground = require('wundergroundnode');
var myKey = '682131b9ddaa0c5d';
var wunderground = new Wunderground(myKey);
wunderground.conditions().request('84111', function(err, response){
    console.log(response);
})

Weather.sync();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/create', (req,res,next) => {
    sequelize.sync({force:true})
     .then(() => res.status(201).send('created'))
    .catch((err) => next(err))
})

app.get('/weathers', (req,res,next)=> {
    Weather.findAll()
    .then((weather) => res.status(200).json(weather))
    .catch((err) => next(err))
})

app.post('/weathers', (req, res) => {
  console.log(req.body.locationName); 
  console.log(req.body.weatherDescribe); 
  console.log(req.body.degrees);
  console.log(req.body.latitude); 
  console.log(req.body.longitude); 
  console.log(req.body.country); 
  Weather.create(req.body)
    .then(() => res.status(201).send('created'))
    .catch((error) => {
      console.warn(error)
      res.status(500).send('some error...')
      
    })
})



app.get('/weathers/:id', (req, res, next) => {
  Weather.findById(req.params.id) .then((weather) => {
      if (weather){
        res.status(200).json(weather)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((err) => next(err))
})

app.get('/weathersAPI/:locationName',(req,res,next)=>{
  console.log(" Date : "+req.params.locationName);
  var wundergroundRes;
  wunderground.conditions().request(req.params.locationName, function(err, response){
    console.log(response);
    res.json(response);
})
  
})


app.put('/weathers/:id', (req, res, next) => {
  Weather.findById(req.params.id)
    .then((weather) => {
      if (weather){
        return weather.update(req.body, {fields : ['Locations', 'Weather', 'Degrees','Latitude','Longitude','Country']})
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('modified')
      }
    })
    .catch((err) => next(err))
})

app.delete('/weathers/:id', (req, res, next) => {
  Weather.findById(req.params.id)
    .then((weather) => {
      if (weather){
        return weather.destroy()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('removed')
      }
    })
    .catch((err) => next(err))
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).send('some error')
})


app.listen(8081,'0.0.0.0')
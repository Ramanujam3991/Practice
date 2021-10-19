const { table } = require('console');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }));
//app.use()
const weather_db = [
    { City: "Toronto", Longitude: "20198", Latitude: "57689", State: "Ontario", Country: "Canada", Weather: "Sunny", Temperature: "20 C", Humidity: "80%", Wind_Speed: "20km/h", Direction: "East" },
    { City: "Ottava", Longitude: "20198", Latitude: "57689", State: "Ontario", Country: "Canada", Weather: "Sunny", Temperature: "20 C", Humidity: "80%", Wind_Speed: "20km/h", Direction: "East" },
    { City: "Oshwa", Longitude: "20198", Latitude: "57689", State: "Ontario", Country: "Canada", Weather: "Sunny", Temperature: "20 C", Humidity: "80%", Wind_Speed: "20km/h", Direction: "East" }]
app.use(express.json());

//Share the html file

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/form.html');
});

//return all the objects
app.get('/getWeather', function (req, res) {
    res.send(weather_db);
});

//return specific weather object
app.get('/getWeather/:City', function (req, res) {
    var obj = weather_db.find(m => m.City == req.params.City)
    res.send(obj);
});

//Update City Details
app.put('/updateWeather/:City', function (req, res) {

    var newObj = req.body;
    var oldObj = weather_db.find(m => m.City == req.params.City);

    console.log('Comes here:' + newObj.Longitude);

    oldObj.Longitude = newObj.Longitude;
    oldObj.Temperature = newObj.Temperature;
    oldObj.Weather = newObj.Weather;
    oldObj.Humidity = newObj.Humidity;
    return res.send(newObj);

});

//Add weather
app.post('/addWeather', function (req, res) {
    weather_db.push(req.body);
    if(req.body.fromFile == "True") return res.redirect('/htmlFile'); 
    return res.send(weather_db);
});

//delete a city
app.delete('/deleteCity/:City', function (req, res) {
    weather_db.splice(weather_db.indexOf(weather_db.find(m => m.City == req.params.City)), 1);
    return res.send(weather_db);
})

var fs = require('fs');


app.get('/htmlFile', function (req, res) {
    var data =dataConstruction();

    fs.writeFile(__dirname + '/index.html', data, function (err) {
        if (err) throw err;

        console.log('saved');
        res.sendFile(__dirname + '/index.html');
    })

});

//Update City Details File
app.post('/updateWeatherFile', function (req, res) {

    var oldObj = weather_db.find(m => m.City == req.body.City);

    console.log('Comes here:' + req.body.City);

    oldObj.Temperature = req.body.Temperature;
    oldObj.Humidity = req.body.Humidity;
    return res.redirect('/htmlFile');

});

app.get('/editFile/:City',function(req,res){
    var objToEdit = weather_db.find(m => m.City.trim() == req.params.City.trim());
    var data =fileForEditing(objToEdit);
    res.send(data);
})

app.get('/addFile',function(req,res){
    var data =fileForAdding();
    res.send(data);
})

function dataConstruction() {
    var data = '<!DOCTYPE html><html><head></head><body><table><tr><th>City</th><th>Temperature</th><th>Humidity</th><th>Edit</th></tr>';
    for (var i = 0; i < weather_db.length; i++) {
        data += '<tr><td>' + weather_db[i].City + '</td><td>' + weather_db[i].Temperature + '</td><td>' + weather_db[i].Humidity + '</td><td><a href="/editFile/'+weather_db[i].City +'">Edit</a></td></tr>';
    }
    data += '</table><a href="/addFile">Add new Record</a></body></html>';
    return data;
}

function fileForEditing(objToEdit) {
    console.log('comes here too'+objToEdit);
    var data = '<!DOCTYPE html><html><body><form action="/updateWeatherFile" method="post">';

        data += '<tr><td><input type="text" value="' + objToEdit.City + '" name="City"> </td><td><input type="text" value="' + objToEdit.Temperature + '" name="Temperature"> </td><td><input type="text" value="' + objToEdit.Humidity + '" name="Humidity"></td></tr>';
    data += '<input type="submit" value="submit"></form></body></html>';
    return data;
}

function fileForAdding() {
    var data = '<!DOCTYPE html><html><body><form action="/addWeather" method="post">';

        data += '<tr><td><input type="hidden" value="True" name="fromFile"><input type="text" value="" name="City"> </td><td><input type="text" value="" name="Temperature"> </td><td><input type="text" value="" name="Humidity"></td></tr>';
    data += '<input type="submit" value="submit"></form></body></html>';
    return data;
}
const port = process.env.port || 3000;
app.listen(port, () => console.log('listening on port ' + port));
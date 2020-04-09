require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
    // clientId: 'stringOfNumberAndLetter', // This will make the client ID visible, best to hide it in .env file
    // clientSecret: 'stringOfNumberAndLetter' // This will make the client ID visible, best to hide it in .env file
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => { 
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('spotifyApi works')
    })
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', function (req, res) {
    res.render('homepage')
})

app.get('/artist-search', (req, res, next) => {
    console.log('This is the return value of req query: ', req.query.artistname);

      spotifyApi
      .searchArtists(req.query.artistname)
      .then(data => {
        console.log('The received data from the API: ', data.body.artists.items);
        // let firstImage = data.body.artists.items[0].images[0].url
        console.log('IMAGES ARRAY OF OBJECT: ', data.body.artists.items[0].images);

        // console.log('firstImage: ', firstImage);
        res.render('artist-search-results', { artistArr: data.body.artists.items, /* firstImage */ })
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {
    console.log('This is the req.params', req.params);

      spotifyApi
      .getArtistAlbums(req.params.artistId)
      .then(data => {
        console.log('Artist albums: ', data.body.items);
        res.render('albums', { albumsArr: data.body.items })
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));




// HENDRIK'S EXAMPLE DURING CLASS:

// const express = require('express')
// const app = express()
// const path = require('path')
// const hbs = require('hbs')
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
// app.get('/', function (req, res) {
//   res.render('userslist')
// })
// app.get('/users/:username/books/:bookId', (req, res, next) => {
//   console.log(req.params.username)
//   console.log(req.params.bookId)
//   console.log(req.query)
//   res.send('')
// })
// app.listen(3000, () => console.log('App listening on port 3000!'))
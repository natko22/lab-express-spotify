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
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
// route for home-page
app.get("/",(req,res)=>{
  res.render("index");
});
//  route for artist
app.get("/artist-search", (req,res)=>{
  const artist =  req.query.artist
  spotifyApi.searchArtists( artist)
  .then((data) =>{
    console.log('The received data from the API: ', data.body);
    res.render("artist-search-results",{artists:data.body.artists.items});
  })
    .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );
});

// route for albums
app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId
  spotifyApi.getArtistAlbums(artistId)
  .then((data) => {
    console.log('The received data from the API: ', data.body);
  res.render("albums", { albums: data.body.items });
  })
  .catch((err) =>
  console.log("The error while searching albums occurred: ", err));
});


//get  route for tracks
app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId
  spotifyApi.getAlbumTracks(albumId)
  .then((data) => {
    const tracks = data.body.items;
  res.render("tracks", { tracks });
  })
  .catch((err) =>
  console.log("The error while searching tracks occurred: ", err));
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

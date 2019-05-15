import React, { Component } from "react";
// import { Button } from "reactstrap";
import Player from "./Player/Player";
import logo from "./mstile-150x150.png";
import "./App.css";
import { isNull, isNullOrUndefined } from "util";
// import SpotifyPlayer from "react-spotify-player";
// import Script from "react-load-script"
import SpotifyWebApi from "spotify-web-api-js";

require('dotenv').config()

// set up connection to spotifyApi library
const spotifyApi = new SpotifyWebApi();

// spotify api connection variables (some from private .env)
const sPAuthEndpoint = 'https://accounts.spotify.com/authorize';
const sPClientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const sPRedirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const sPScopes = [
  'streaming',
  'user-read-private',
  'user-read-birthdate',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'user-top-read',
  'user-follow-read',
  'user-follow-modify',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  // 'user-top-read',
  // 'user-read-currently-playing',
  // 'user-read-playback-state',
  // 'user-modify-playback-state',
  // 'streaming',
  // 'user-read-birthdate',
  // 'user-read-email',
  // 'user-read-private'
];

// MusicStory api connection variables (some from private .env)
const mSKey = process.env.REACT_APP_MUSICSTORY_CONSUMER_KEY;
var mSSecret = process.env.REACT_APP_MUSICSTORY_CONSUMER_SECRET;
var mSApi = new window.MusicStoryApi(mSKey, mSSecret);

// Helper function to get the hash of the url for spotify API comms _token
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

// App class and constructor initializing basic state
class App extends Component {
  constructor() {
    super();
    this.state = {
      // player: null,
      token: null,
      response: null,
      device_id: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms:0,
      },
      is_playing: "Paused",
      progress_ms: 0
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.previousTrack = this.previousTrack.bind(this);
    this.nextTrack = this.nextTrack.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.pauseTrack = this.pauseTrack.bind(this);
  }
  
  // Once react page is loaded/mounted after redirect from spotify login,
  // save token in state and in spotifyApi helper library
  componentDidMount = async () => {
    // Set token from hash
    let _token = hash.access_token;

    // Set token in state if truthy/exists
    if (_token) {
      // save token in state
      this.setState({
        token: _token
      });

      // set spotifyApi to our access token to be able to make requests
      await spotifyApi.setAccessToken(_token);

      // call getCurrentlyPlaying API request if token is good
      await this.getCurrentlyPlaying();
    }
  }

  // onSpotifyWebPlaybackSDKReady = () => {

  //   const sPPlayer = new window.Spotify.Player({ // Spotify is not defined until 
  //     name: 'Spotify Web Player',       // the script is loaded in 
  //     getOAuthToken: cb => { cb(this.state.token) }
  //   });
  
  //   // Error handling
  //   sPPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
  //   sPPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
  //   sPPlayer.addListener('account_error', ({ message }) => { console.error(message); });
  //   sPPlayer.addListener('playback_error', ({ message }) => { console.error(message); });
  
  //   // Playback status updates
  //   sPPlayer.addListener('sPPlayer_state_changed', status => {
  //      console.log(status);
  //   });
  
  //   // Ready
  //   sPPlayer.addListener('ready', ({ device_id }) => {
  //     console.log('Ready with Device ID', device_id);
  //   });
  
  //   // Not Ready
  //   sPPlayer.addListener('not_ready', ({ device_id }) => {
  //     console.log('Device ID has gone offline', device_id);
  //   });
  
  //   // Connect to the sPPlayer!
  //   sPPlayer.connect();

  //   this.setState({
  //     player: sPPlayer
  //   });
  // };

  // // Make a fetch call to the spotify api using the token to pauseTrack
  // pauseTrack = async (token) => {
  //   try {
  //     const url = 'https://api.spotify.com/v1/me/player/pause'
  //     const result = await fetch(url, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       }
  //     });
  //     const parsedResult = await result.json();
  //     if (result.status === 200) {
  //       console.log("data:", parsedResult);
  //       if (!isNullOrUndefined(parsedResult.item)) {
  //         this.setState({
  //           item: parsedResult.item,
  //           is_playing: parsedResult.is_playing,
  //           progress_ms: parsedResult.progress_ms,
  //         });
  //       } else {
  //         console.log('parsedResponse in pauseTrack was null or undefined')
  //       }
  //     }
  //   } catch(err) {
  //     console.log(`${err} in the spotify pauseTrack fetch call`);
  //   }
  // }

  // // Make a fetch call to the spotify api using the token to playTrack
  // playTrack = async (token) => {
  //   try {
  //     const url = 'https://api.spotify.com/v1/me/player/play'
  //     const result = await fetch(url, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       },
  //       body: {
  //         "context_uri": this.state.item.album.uri,
  //         "offset": {
  //           "position": 5
  //         },
  //         "position_ms": 0
  //       }
  //     });
  //     const parsedResult = await result.json();
  //     if (result.status === 200) {
  //       console.log("data:", parsedResult);
  //       if (!isNullOrUndefined(parsedResult.item)) {
  //         this.setState({
  //           item: parsedResult.item,
  //           is_playing: parsedResult.is_playing,
  //           progress_ms: parsedResult.progress_ms,
  //         });
  //       } else {
  //         console.log('parsedResponse in playTrack was null or undefined')
  //       }
  //     }
  //   } catch(err) {
  //     console.log(`${err} in the spotify playTrack fetch call`);
  //   }
  // }

  // // Make a fetch call to the spotify api using the token to getCurrentlyPlaying
  // getCurrentlyPlaying = async (token) => {
  //   try {
  //     const url = 'https://api.spotify.com/v1/me/player'
  //     const result = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       }
  //     });
  //     const parsedResult = await result.json();
  //     if (result.status === 200) {
  //       console.log("data:", parsedResult);
  //       if (!isNullOrUndefined(parsedResult.item)) {
  //         this.setState({
  //           item: parsedResult.item,
  //           is_playing: parsedResult.is_playing,
  //           progress_ms: parsedResult.progress_ms,
  //         });
  //       } else {
  //         console.log('parsedResponse in spotify getCurrentlyPlaying was null or undefined')
  //       }
  //     }
  //   } catch(err) {
  //     console.log(`${err} in the spotify getCurrentlyPlaying fetch call`);
  //   }
  // }

  // Make a call to the spotify ext API from previousTrack
  previousTrack = async () => {
    // e.preventDefault();
    await spotifyApi.skipToPrevious()
      .then(async (response) => {
        console.log(response);
        setTimeout(this.getCurrentlyPlaying, 200);
      }).catch((err) => {
        console.log(`${err} in the spotify previousTrack ext API lib call`);
      });
  }

   // Make a call to the spotify ext API from nextTrack
   nextTrack = async () => {
    // e.preventDefault();
    await spotifyApi.skipToNext()
      .then(async (response) => {
        console.log(response);
        setTimeout(this.getCurrentlyPlaying, 200);
      }).catch((err) => {
        console.log(`${err} in the spotify nextTrack ext API lib call`);
      });
  }

  // Make a call to the spotify ext API from pauseTrack
  pauseTrack = async () => {
    // e.preventDefault();
    await spotifyApi.pause()
      .then(async (response) => {
        console.log(response);
        await this.getCurrentlyPlaying();
        this.setState({
          is_playing: false,
        });
      }).catch((err) => {
        console.log(`${err} in the spotify pauseTrack ext API lib call`);
      });
  }

  // Make a call to the spotify ext API from playTrack
  playTrack = async () => {
    // e.preventDefault();
    if (this.state.item.artists[0].name) {
      await spotifyApi.play()
        .then(async (response) => {
          console.log(response);
          await this.getCurrentlyPlaying();
          this.setState({
            is_playing: true,
          });
        }).catch((err) => {
          console.log(`${err} in the spotify playTrack ext API lib call`);
        });
    } else {
      await spotifyApi.getMyDevices()
      .then(async (response) => {
        console.log(response);
        this.setState({
          device_id: response.devices[1].id
        });
      }).catch((err) => {
        console.log(`${err} in the spotify playTrack ext API lib call`);
      });
      await spotifyApi.play({"device_id": this.state.device_id, "context_uri": "spotify:album:2aEfwug3iZ4bivziB14C1F"})
        .then(async (response) => {
          console.log(response);
          await this.getCurrentlyPlaying();
          setTimeout(this.getCurrentlyPlaying, 200);
          this.setState({
            is_playing: true,
          });
        }).catch((err) => {
          console.log(`${err} in the spotify playTrack ext API lib call`);
        });
    }
  }

  // Make a call to the spotify ext API from getCurrentlyPlaying
  getCurrentlyPlaying = async () => {
    await spotifyApi.getMyCurrentPlaybackState()
      .then( async (response) => {
        console.log(response);
        if (response.item.artists[0].name) {
          this.setState({
            response: response,
            item: response.item,
            device_id: response.device_id,
            is_playing: response.is_playing,
            progress_ms: response.progress_ms, 
          });
        }
      }).catch((err) => {
        console.log(`${err} in the spotify getCurrentlyPlaying ext API lib call`);
      });
  }

  render() {
  // // size may also be a plain string using the presets 'large' or 'compact'
  // const size = {
  //   width: '100%',
  //   height: 300,
  // };
  // const view = 'list'; // or 'coverart'
  // const theme = 'black'; // or 'white'
    return (
      <div className="App">
        <header className="App-header">
        <h4>Welcome to DRNKJMZ, an app that links to your Spotify account to recommend the perfect cocktail for your listening experience!</h4>
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a className="btn btn--loginApp-link"
              href={`${sPAuthEndpoint}?client_id=${sPClientId}&redirect_uri=${sPRedirectUri}&scope=${sPScopes.join("%20")}&response_type=token&show_dialog=true`}
            >Login to Spotify</a>
          )}

          {this.state.token && this.state.item.artists[0].name && (
            <div className="player-info">
              <Player
                item={this.state.item}
                is_playing={this.state.is_playing}
                progress_ms={this.progress_ms}
                pauseTrack={this.pauseTrack}
                playTrack={this.playTrack}
              />
              {/* <Script
                url="https://sdk.scdn.co/spotify-player.js" 
                onError={this.handleScriptError} 
                onLoad={this.onSpotifyWebPlaybackSDKReady}
              />
              {/* <iframe className="embedded-player" title="embedded-player" src={`https://embed.spotify.com/?uri=${this.state.item.album.uri}`} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"/> */}
            </div>
          )}

          {this.state.token ? (
              <div className="now-playing__controls"><br/>
              <button className="btn btn--loginApp-link" onClick={(e) => {e.preventDefault(); this.previousTrack(); }}>&lt;&lt;</button>
              <button className="btn btn--loginApp-link" onClick={(e) => {e.preventDefault(); this.pauseTrack(); }}>PAUSE ||</button>
              <button className="btn btn--loginApp-link" onClick={(e) => {e.preventDefault(); this.playTrack(); }}>PLAY |&gt;</button>
              <button className="btn btn--loginApp-link" onClick={(e) => {e.preventDefault(); this.nextTrack(); }}>&gt;&gt;</button>

            </div>)
          : (
          <div>
            <br/><br/>
            ***Please login to your spotify account by clicking above***
          </div>)}
        </header>
        <div>
        </div>
      </div>
    );
  }
}

export default App;

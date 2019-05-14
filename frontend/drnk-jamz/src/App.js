import React, { Component } from "react";
import { Button } from "reactstrap";
import Player from "./Player/Player";
import logo from "./mstile-150x150.png";
import "./App.css";
import { isNull, isNullOrUndefined } from "util";
require('dotenv').config()

// spotify api connection variables (some from private .env)
const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const scopes = [
  'user-top-read',
  'user-read-currently-playing',
  'user-read-playback-state',
  'streaming',
  'user-read-birthdate',
  'user-read-email',
  'user-read-private'
];

// Helper function to get the hash of the url for spotify API comms
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
      token: null,
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
  }
  
  // Once react page is loaded/mounted after redirect from spotify, set token in state
  componentDidMount() {
    // Set token from hash
    let _token = hash.access_token;

    // Set token in state if truthy/exists
    if (_token) {
      this.setState({
        token: _token
      });
      // call getCurrentlyPlaying API request if token is good
      this.getCurrentlyPlaying(_token);
    }
  }

  // Make a fetch call to the spotify api using the token
  getCurrentlyPlaying = async (token) => {
    try {
      const url = 'https://api.spotify.com/v1/me/player'
      const result = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const parsedResult = await result.json();
      if (result.status === 200) {
        console.log("data:", parsedResult);
        if (!isNullOrUndefined(parsedResult)) {
          this.setState({
            item: parsedResult.item,
            is_playing: parsedResult.is_playing,
            progress_ms: parsedResult.progress_ms,
          });
        } else {
          console.log('parsedResponse in spotify call was null or undefined')
        }
      }
    } catch(err) {
      console.log(`${err} in the spotify get currently playing fetch call`);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
            className="btn btn--loginApp-link"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
            >
            Login to Spotify
            </a>
          )}
          {this.state.token && (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.progress_ms}
            />
          )}
        </header>
        <div>

        </div>
      </div>
    );
  }
}

export default App;

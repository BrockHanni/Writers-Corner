// To do list:
var addItemButton = document.querySelector("#add-item-btn");
var todoList = document.querySelector("#todo-list");
var todoNewInput = document.querySelector("#new-item-input");

window.addEventListener("load", function() {
    var savedItems = localStorage.getItem("todoListItems");
    if (savedItems) {
      todoList.innerHTML = savedItems;
    }
});

addItemButton.addEventListener("click", function() {
    var todoNew = document.createElement("li");
    var deletebtnTodo = document.createElement("button");
    todoNew.classList.add("todoItem")
    deletebtnTodo.textContent = "Delete";
    deletebtnTodo.classList.add("delete-btn");
    todoNew.textContent = todoNewInput.value;
    todoNew.appendChild(deletebtnTodo);
    todoList.appendChild(todoNew);
    todoNewInput.value = "";
    localStorage.setItem("todoListItems", todoList.innerHTML);
});

todoList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
      event.target.parentElement.remove();
      localStorage.setItem("todoListItems", todoList.innerHTML);
    }
});

// Spotify token retrievel, documentation was provided by Spotify
var redirect_uri = "http://127.0.0.1:5501/index.html";

var client_id = ""; 
var client_secret = ""; 

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];

// Endpoints received from spotify for devs, needed in order to request each of these functions
const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const DEVICES = "https://api.spotify.com/v1/me/player/devices";
const PLAY = "https://api.spotify.com/v1/me/player/play";
const PAUSE = "https://api.spotify.com/v1/me/player/pause";
const NEXT = "https://api.spotify.com/v1/me/player/next";
const PREVIOUS = "https://api.spotify.com/v1/me/player/previous";
const PLAYER = "https://api.spotify.com/v1/me/player";
const TRACKS = "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks";
const CURRENTLYPLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const SHUFFLE = "https://api.spotify.com/v1/me/player/shuffle";

// This function was required in order to get the page to load the access token after validating Client ID's, otherwise the page populates with "error message" when trying to utilize the API bercause it saves the access tokens to the local storage. 
function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    if (window.location.search.length > 0){
        handleRedirect();
    }
    else{
        access_token = localStorage.getItem("access_token");
        if (access_token == null){
            document.getElementById("tokenSection").style.display = 'block';  
        }
        else {
            document.getElementById("deviceSection").style.display = 'block';  
            refreshDevices();
            refreshPlaylists();
            currentlyPlaying();
        }
    }
    refreshRadioButtons();
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri);
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function requestAuthorization(){
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret); 
// This section uses form post, it was new for me, it uses the names and the value pairs assigned with it to get the tokens to access the API
    var url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    // This line is required to redirect the page to the Spotify Authorization page
    window.location.href = url; 
}

function fetchAccessToken(code){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}
// Spotify for devs noted that this was required in order to get it to populate in the dropdown
function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    var body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

// The POST response as documented and required in the spotify api documentation/tutorial
function callAuthorizationApi(body){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}
// A status of 200 means the request was succesful and the requested source was fetched and transmitted back to the webpage succesfully
function handleAuthorizationResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function refreshDevices(){
    callApi( "GET", DEVICES, null, handleDevicesResponse );
}

function handleDevicesResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "devices" );
        data.devices.forEach(item => addDevice(item));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addDevice(item){
    var node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    document.getElementById("devices").appendChild(node); 
}


function callApi(method, url, body, callback){
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "playlists" );
        data.items.forEach(item => addPlaylist(item));
        document.getElementById('playlists').value=currentPlaylist;
    }
    else if (this.status == 401){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addPlaylist(item){
    var node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name + " (" + item.tracks.total + ")";
    document.getElementById("playlists").appendChild(node); 
}

// Without this function when you refresh it just adds on to the items rather than pulling a new fresh list
function removeAllItems(elementId){
    var node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function play(){
    var playlist_id = document.getElementById("playlists").value;
    var trackindex = document.getElementById("tracks").value;
    var album = document.getElementById("album").value;
    var body = {};
    if ( album.length > 0 ){
        body.context_uri = album;
    }
    else{
        body.context_uri = "spotify:playlist:" + playlist_id;
    }
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    callApi("PUT", PLAY + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse);
}

function shuffle(){
    callApi("PUT", SHUFFLE + "?state=true&device_id=" + deviceId(), null, handleApiResponse);
    play(); 
}

function pause(){
    callApi("PUT", PAUSE + "?device_id=" + deviceId(), null, handleApiResponse);
}

function next(){
    callApi("POST", NEXT + "?device_id=" + deviceId(), null, handleApiResponse);
}

function previous(){
    callApi("POST", PREVIOUS + "?device_id=" + deviceId(), null, handleApiResponse);
}

function transfer(){
    let body = {};
    body.device_ids = [];
    body.device_ids.push(deviceId())
    callApi("PUT", PLAYER, JSON.stringify(body), handleApiResponse);
}

// The 401 code notifies us that the access token has expired, usually only good for about an hour and then we have to refresh. 
// The timeout here creates a delay between swapping devices, I found if I had it any lower it would bug out on occassion and this is what spotify recommends
function handleApiResponse(){
    if (this.status == 200){
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    // Status 204 indicates that the requested info succesful transmitted and allows the client to stay on the page
    else if (this.status == 204){
        setTimeout(currentlyPlaying, 2000);
    }
    else if (this.status == 401){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}

// Many of these functions were provided in the documentation listed in Spotify for developers
function deviceId(){
    return document.getElementById("devices").value;
}

function fetchTracks(){
    let playlist_id = document.getElementById("playlists").value;
    if ( playlist_id.length > 0 ){
        url = TRACKS.replace("{{PlaylistId}}", playlist_id);
        callApi( "GET", url, null, handleTracksResponse );
    }
}

function handleTracksResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("tracks");
        data.items.forEach( (item, index) => addTrack(item, index));
    }
    else if (this.status == 401){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addTrack(item, index){
    let node = document.createElement("option");
    node.value = index;
    node.innerHTML = item.track.name + " (" + item.track.artists[0].name + ")";
    document.getElementById("tracks").appendChild(node); 
}

function currentlyPlaying(){
    callApi("GET", PLAYER + "?market=US", null, handleCurrentlyPlayingResponse);
}

function handleCurrentlyPlayingResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.item != null){
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }


        if (data.device != null){
            // selects device, was unable to put a player with sound on the website, it plays through whatever device has spotify installed/is linked to you account
            currentDevice = data.device.id;
            document.getElementById('devices').value=currentDevice;
        }

        if (data.context != null){
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            document.getElementById('playlists').value=currentPlaylist;
        }
    }
    else if (this.status == 204){

    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
// These were super cool! The Radio Buttons allowed the playlists, device names, tracks, etc, to populate and stay in the local storage after refreshing devices and playlists. They would pull responses from spotify's API and populate in the text boxes to be selected. 
function saveNewRadioButton(){
    var item = {};
    item.deviceId = deviceId();
    item.playlistId = document.getElementById("playlists").value;
    radioButtons.push(item);
    localStorage.setItem("radio_button", JSON.stringify(radioButtons));
    refreshRadioButtons();
}

function refreshRadioButtons(){
    var data = localStorage.getItem("radio_button");
    if ( data != null){
        radioButtons = JSON.parse(data);
        if (Array.isArray(radioButtons) ){
            removeAllItems("radioButtons");
            radioButtons.forEach( (item, index) => addRadioButton(item, index));
        }
    }
}

function onRadioButton(deviceId, playlistId){
    var body = {};
    body.context_uri = "spotify:playlist:" + playlistId;
    body.offset = {};
    body.offset.position = 0;
    body.offset.position_ms = 0;
    callApi("PUT", PLAY + "?device_id=" + deviceId, JSON.stringify(body), handleApiResponse);
}

function addRadioButton(item, index){
    var node = document.createElement("button");
    node.className = "btn btn-primary m-2";
    node.innerText = index;
    node.onclick = function() {onRadioButton(item.deviceId, item.playlistId) };
    document.getElementById("radioButtons").appendChild(node);
}


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

// Here begins the spotify login authorizations
const SpotifyStrategy = require('passport-spotify').Strategy;

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: 'http://localhost:8888/auth/spotify/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick (function () {
        console.log('Profile: ', profile)
      
      User.findOrCreate({
        where: {
        spotifyId: profile.id}, 
        defaults: {
          name: profile.displayName,
          SpotifyId: profile.id,
          accessToken: accessToken,
          proPicP: profile.photos [0],
          refreshToken: refreshToken
        }
      })
        .spread(function (user) {
          console.log('MAKING USER: ', user)
        return done(null, user);
      })
      .catch(done);
    });
  }));

var util = require('util'),
  querystring = require('querystring'),
  OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
  InternalOAuthError = require('passport-oauth').InternalOAuthError;
// Authorization keys provided by spotify for developers
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL || 'https://accounts.spotify.com/authorize';
  options.tokenURL =
    options.tokenURL || 'https://accounts.spotify.com/api/token';
  options.scopeSeparator = options.scopeSeparator || ' ';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'spotify';
  this._userProfileURL =
    options.userProfileURL || 'https://api.spotify.com/v1/me';

  this._oauth2.getOAuthAccessToken = function(code, params, callback) {
    params = params || {};
    var codeParam =
      params.grant_type === 'refresh_token' ? 'refresh_token' : 'code';
    params[codeParam] = code;
    params['client_id'] = this._clientId;
    params['client_secret'] = this._clientSecret;

    var post_data = querystring.stringify(params);
    var post_headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    this._request(
      'POST',
      this._getAccessTokenUrl(),
      post_headers,
      post_data,
      null,
      function(error, data, response) {
        if (error) callback(error);
        else {
          var results = JSON.parse(data);
          var access_token = results.access_token;
          var refresh_token = results.refresh_token;
          var expires_in = results.expires_in;
          delete results.refresh_token;
          callback(null, access_token, refresh_token, expires_in, results); // callback results
        }
      }
    );
  };
}
util.inherits(Strategy, OAuth2Strategy); //spotify uses OAuth2.0, this pulls from that function

Strategy.prototype.authorizationParams = function(options) {
  var params = {};

  if (options.showDialog) {
    params.show_dialog = options.showDialog;
  }

  return params;
};

Strategy.prototype.userProfile = function(accessToken, done) {
  var authorization = 'Bearer ' + accessToken;
  var headers = {
    Authorization: authorization
  };
  this._oauth2._request('GET', this._userProfileURL, headers, '', '', function(
    err,
    body,
    res
  ) {
    if (err) {
      return done(new InternalOAuthError('failed to fetch user profile', err));
    }

    try {
      var json = JSON.parse(body);

      var profile = {
        provider: 'spotify',
        id: json.id,
        username: json.id,
        displayName: json.display_name,
        profileUrl: json.external_urls ? json.external_urls.spotify : null,
        photos: json.images
          ? json.images.map(function(image) {
              return {value: image.url};
            })
          : null,
        country: json.country || null,
        followers: json.followers ? json.followers.total : null,
        product: json.product || null,
        _raw: body,
        _json: json
      };

      if (json.email) {
        profile.emails = [
          {
            value: json.email,
            type: null
          }
        ];
      }

      done(null, profile);
    } catch (e) {
      done(e);
    }
  });
};

module.exports = Strategy;
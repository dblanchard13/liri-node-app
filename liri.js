function LiriInterface(twitterKeys){

  this.twitKeys = twitterKeys;
  this.commandArray = ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says', 'exit'];
  this.initDependencies();
  this.clearCmdIntf();
  this.queryUserInfo();

}

LiriInterface.prototype.initDependencies = function(){
  var TwitterBuild = require('twitter');

  this.Twitter = new TwitterBuild(this.twitKeys);
  this.Requester = require('request');
  this.Inquire = require('inquirer');
  this.fileIO = require('fs');
  this.Spotify = require('spotify');

};

LiriInterface.prototype.clearCmdIntf = function () {
  process.stdout.write('\033c');
};

LiriInterface.prototype.queryUserInfo = function () {

  this.buildPromptCallback({
    type: 'input',
    message: "Hello, what should I call you?",
    name: 'answer',
    default: 'Mysterious Stranger'
  }, this.promptUserChoice.bind(this));

};


LiriInterface.prototype.promptUserChoice = function (userName) {

  if(userName) this.userName = userName;

  this.buildPromptCallback({
    type: "list",
    message: "Hi! " + this.userName + ", please select from the following options.",
    name: 'answer',
    choices: this.commandArray
  }, this.delegate.bind(this));
};

LiriInterface.prototype.buildPromptCallback = function (promptObj, callback) {

  this.Inquire.prompt(promptObj).then(function (response) {
    callback(response.answer);
  });

};


LiriInterface.prototype.delegate = function (selection) {

  this.currentCommand = selection;

  switch (this.currentCommand){

    case 'my-tweets':

      this.clearCmdIntf();
      this.buildPromptCallback({
        type: 'input',
        message: 'What screen name should I look for?',
        name: 'answer',
        default: 'ConanOBrien'
      }, this.getTweets.bind(this));
      break;

    case 'spotify-this-song':

      this.clearCmdIntf();
      this.buildPromptCallback({
        type: 'input',
        message: 'What song would you like to search for?',
        name: 'answer',
        default: 'Killing in the Name'
      }, this.getSong.bind(this));
      break;

    case 'movie-this':

      this.clearCmdIntf();
      this.buildPromptCallback({
        type: 'input',
        message: 'What movie would you like to look up?',
        name: 'answer',
        default: 'The Matrix'
      }, this.getMovie.bind(this));
      break;

    case 'do-what-it-says':

      break;

    case 'exit':

      this.clearCmdIntf();
      console.log("Bye! Have a great time!")

  }

};

LiriInterface.prototype.getTweets = function (user) {

  var params = {
    screen_name: user,
    count: 20
  };

  this.Twitter.get('statuses/user_timeline', params, function(err, tweets, response) {
    if (!err) {
      tweets.forEach(function (tweet, index) {
        console.log('Tweet# ' + parseInt(index + 1) + ': ' + tweet.text);
      });
    }else{
      console.log("Error were declared: " + err);
    }

    this.promptUserChoice();

  }.bind(this));

};

LiriInterface.prototype.getSong = function (songChoice) {

  this.Spotify.search({type: 'track', query: songChoice}, function (err, data) {
    if (!err) {

      var song = data.tracks.items[0];
      var string = "Artist: " + song.artists[0].name + "\nName: " + song.name + "\nPreview: " +
          song.preview_url + "\nAlbum: " + song.album.name;

      console.log(string);
    }else{
      console.log('Error were declared: ' + err);
    }


  });
};

LiriInterface.prototype.getMovie = function(){



};


// End of object prototypes
// Start run Logic

new LiriInterface(require('./keys.js').twitterKeys);

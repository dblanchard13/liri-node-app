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
  this.Inquire.prompt([
    {
      type: 'input',
      message: "Hello, what should I call you?",
      name: 'userName',
      default: 'Mysterious Stranger'
    }
  ]).then(function (user) {
    this.userName = user.userName;
    this.promptUserChoice();
  }.bind(this))
};


LiriInterface.prototype.promptUserChoice = function () {
  this.Inquire.prompt([
    {
      type: "list",
      message: "Hi! " + this.userName + ", please select from the following options.",
      name: 'command',
      choices: this.commandArray
    }
  ]).then(function (userInputs) {

    this.userInputs = userInputs;
    console.log(this.userInputs.command);
    this.delegate(this.userInputs.command);

  }.bind(this));
};


LiriInterface.prototype.delegate = function (selection) {

  this.currentCommand = selection;

  switch (this.currentCommand){

    case 'my-tweets':

      this.clearCmdIntf();
      this.Inquire.prompt({
        type: 'input',
        message: 'What screen name should I look for?',
        name: 'user_name',
        default: 'ConanOBrien'

      }).then(function (response) {
        this.getTweets(response.user_name, 20);
      }.bind(this));

      break;

    case 'spotify-this-song':

      this.Inquire.prompt({
        type: 'input',
        message: 'What song would you like to search for?',
        name: 'song'
      }).then(function (input) {
        this.getSong(input.song);
      }.bind(this));

      break;

    case 'movie-this':

      break;

    case 'do-what-it-says':

      break;

    case 'exit':

      this.clearCmdIntf();
      console.log("Bye! Have a good day.")

  }

};

LiriInterface.prototype.getTweets = function (user, total) {

  var params = {
    screen_name: user,
    count: total
  };


  this.Twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      tweets.forEach(function (tweet, index) {
        console.log('Tweet# ' + parseInt(index + 1) + ': ' + tweet.text);
      });
    }else{
      console.log("Sorry but an error occured.")
    }

    this.promptUserChoice();

  }.bind(this));

};

LiriInterface.prototype.getSong = function (songChoice) {

  this.Spotify.search({type: 'track', query: songChoice}, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    console.log(data.tracks.items[0]);

  });
};


// End of object prototypes

var Liri = new LiriInterface(require('./keys.js').twitterKeys);

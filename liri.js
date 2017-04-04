function LiriInterface(twitterKeys){

  this.twitKeys = twitterKeys;
  this.commandArray = ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'];
  this.initDependencies();
  this.promptUserChoice();

}

LiriInterface.prototype.initDependencies = function(){
  var TwitterBuild = require('twitter');

  this.Twitter = new TwitterBuild(this.twitKeys);
  this.Requester = require('request');
  this.Inquire = require('inquirer');
  this.fileIO = require('fs');
  this.Spotify = require('spotify');

  // Clear Console
  console.log('\x1Bc');

};


LiriInterface.prototype.promptUserChoice = function () {

  this.Inquire.prompt([
    {
      type: 'input',
      message: "Hello, what should I call you?",
      name: 'userName',
      default: 'Mysterious Stranger'
    }
  ]).then(function (person) {
    this.Inquire.prompt([
      {
        type: "list",
        message: "Hi! " + person.userName + ", please select from the following options.",
        name: 'command',
        choices: this.commandArray
      }
    ]).then(function (userInputs) {

      this.userInputs = userInputs;
      console.log(this.userInputs.command);
      this.delegate(this.userInputs.command);

    }.bind(this));

  }.bind(this));

};

LiriInterface.prototype.delegate = function (selection) {

  this.currentCommand = selection;

  switch (this.currentCommand){

    case 'my-tweets':

      this.getTweets('mishkatronic', 20);

      break;

    case 'spotify-this-song':

      break;

    case 'movie-this':

      break;

  }

};

LiriInterface.prototype.getTweets = function (user, total) {

  var params = {
    username: user,
    count: total
  };

  this.Twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      
      tweets.forEach(function (tweet, index) {
        console.log('Tweet# ' + parseInt(index+ 1) + ': ' + tweet.text);
      });
    }
  });

};





// End of object prototypes

var Liri = new LiriInterface(require('./keys.js').twitterKeys);

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

};


LiriInterface.prototype.promptUserChoice = function () {

  var self = this;
  //this.user = prompt("Hello new friend, what should I call you?", "Mysterious Stranger");

  this.Inquire.prompt([
    {
      type: "list",
      message: "Hi! " + this.user + " , please select from the following options.",
      name: 'command',
      choices: this.commandArray
    }
  ]).then(function(userInputs) {

    self.userInputs = userInputs;
    console.log(self.userInputs.command);
    self.delegate(self.userInputs.command);

  });

};

LiriInterface.prototype.delegate = function (selection) {

  this.currentCommand = selection;

  switch (this.currentCommand){

    case 'my-tweets':

      this.getTweets();

      break;

    case 'spotify-this-song':

      break;

    case 'movie-this':

  }

};

LiriInterface.prototype.getTweets = function () {

  this.Twitter.get('statuses/user_timeline', 'mishkatronic', function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
      //console.log(response);
    }
  });

};





// End of object prototypes

var Liri = new LiriInterface(require('./keys.js').twitterKeys);

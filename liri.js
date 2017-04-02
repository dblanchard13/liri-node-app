function LiriInterface(twitterKeys){
  this.twitKeys = twitterKeys;
  this.initDependencies();
}

LiriInterface.prototype.initDependencies = function(){

  var TwitterBuild = require('twitter');

  this.Twitter = new TwitterBuild(this.twitterKeys);
  this.Requester = require('request');
  this.Inquire = require('inquirer');

};

LiriInterface.prototype.promptUserChoice = function () {

  this.user = prompt("Hello new friend, what should I call you?", "Mysterious Stranger");

  this.Inquire.prompt([
    {
      type: "list",
      message: "Hi! " + this.user + " , please select from the following options.",
      name: 'order',
      choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
    }
  ])

};



// End of object prototypes

var Liri = new LiriInterface(require('./keys.js').twitterKeys);
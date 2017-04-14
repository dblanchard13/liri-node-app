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
    message: "Hi, " + this.userName + ", please select from the following options.",
    name: 'answer',
    choices: this.commandArray
  }, this.delegate.bind(this));
};

LiriInterface.prototype.buildPromptCallback = function (promptObj, callback) {

  this.Inquire.prompt(promptObj).then(function (response) {
    this.inputVal = response.answer;
    callback(this.inputVal);
  }.bind(this));

};


LiriInterface.prototype.delegate = function (selection, value) {

  this.currentCommand = selection;
  if (value) this.inputVal = value;

  switch (this.currentCommand){

    case 'my-tweets':

      this.clearCmdIntf();

      if(value) {
        this.getTweets(value);
        break;
      }

      this.buildPromptCallback({
        type: 'input',
        message: 'What screen name should I look for?',
        name: 'answer',
        default: 'ConanOBrien'
      }, this.getTweets.bind(this));
      break;

    case 'spotify-this-song':

      this.clearCmdIntf();

      if(value) {
        this.getSong(value);
        break;
      }

      this.buildPromptCallback({
        type: 'input',
        message: 'What song would you like to search for?',
        name: 'answer',
        default: 'Killing in the Name'
      }, this.getSong.bind(this));
      break;

    case 'movie-this':

      this.clearCmdIntf();

      if(value) {
        this.getMovie(value);
        break;
      }

      this.buildPromptCallback({
        type: 'input',
        message: 'What movie would you like to look up?',
        name: 'answer',
        default: 'The Matrix'
      }, this.getMovie.bind(this));
      break;

    case 'do-what-it-says':
      this.clearCmdIntf();
      this.readInRun();
      break;

    case 'exit':

      this.clearCmdIntf();
      console.log("Bye! Have a great time!");

      break;

    default:

      console.log("How did you even manage to get here?" +
          "\nIt should not be possible... I am impressed" +
          "\nWell then you deserve something for your accomplishment..." +
              "\nHere is an NSFW emoticon for you to enjoy:\n(‿ˠ‿)"
      );

  }

};

LiriInterface.prototype.getTweets = function (user) {

  var params = {
    screen_name: user,
    count: 20
  };

  this.Twitter.get('statuses/user_timeline', params, function(err, tweets, response) {
    if (!err) {
      var string = '';
      tweets.forEach(function (tweet, index) {
        var tweetString = tweet.created_at + ' ' + parseInt(index + 1) + ': ' + tweet.text + '\n';
        console.log(tweetString);
        string += tweetString;
      });
      this.output = string;
    }else{
      console.log("Error were declared: " + err);
    }

    console.log('\n');

    this.promptUserChoice();
    this.writeToFile();

  }.bind(this));

};

LiriInterface.prototype.getSong = function (songChoice) {

  this.Spotify.search({type: 'track', query: songChoice}, function (err, data) {
    if (!err) {

      var song = data.tracks.items[0];
      var string = "Artist: " + song.artists[0].name + "\nName: " + song.name + "\nPreview: " +
          song.preview_url + "\nAlbum: " + song.album.name;

      this.output = string;
      console.log(this.output);
    }else{
      console.log('Error were declared: ' + err);
    }

    this.writeToFile();
    this.promptUserChoice();

  }.bind(this));
};

LiriInterface.prototype.getMovie = function(movie){

  this.Requester('http://www.omdbapi.com/?t=' + movie, function (err, response, body){
    if(!err){

      var movie = JSON.parse(body);

      var string = movie.Title + "\nYear: " + movie.Year + "\nIMDb Rating: " + movie.Ratings[0].Value +
          "\nCountry: " + movie.Country + "\nLanguage: " + movie.Language + "\n\nPlot\n" +
          movie.Plot + "\n\nActors\n" + movie.Actors + "\nWebsite Link: " + movie.Website;

      if(movie.Ratings.length > 1) {

        movie.Ratings.forEach(function (item) {
          if(item.Source == "Rotten Tomatoes"){
            string += "\nRotten Tomatoes Rating: " + item.Value;
          }
        });

      }else{
        string += "\nNo Rotten Tomatoes Ratings Available"
      }

      this.output = string + '\n';
      console.log(this.output);

    }else{
      console.log('Error were declared: ' + err);
    }

    this.writeToFile();
    this.promptUserChoice();

  }.bind(this));

};

LiriInterface.prototype.readInRun = function(){

  this.fileIO.readFile("random.txt", "utf8", function(err, data){

    if(!err){
      var array = data.split(',');

      //TODO: Change this to read in all possible commands in sets of two?

      this.delegate(array[0], array[1]);

    }else{
      console.log("Looks like the readFile failed");
    }

  }.bind(this));

};

LiriInterface.prototype.writeToFile = function () {

  var array = [];
  array.push(this.currentCommand);
  array.push(this.inputVal);

  var commOutputString = array + '\n' + this.output + '\n';
  console.log(commOutputString);

  this.fileIO.appendFile("log.txt", commOutputString, function (err) {
    if(err){
      console.log('Error were declared.')
    }
  })

};


// Start run Logic
new LiriInterface(require('./keys.js').twitterKeys);

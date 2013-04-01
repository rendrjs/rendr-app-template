# Rendr App Template
## GitHub Browser

The purpose of this little app is to demonstrate one way of using Rendr to build a web app that runs on both the client and the server.

## Running the example

First, make sure to have Node >= 0.8.0 [installed on your system](http://nodejs.org/). Then, clone this repo to a local directory and run `npm install` to install dependencies:

    $ npm install rendr-app-template
    $ cd rendr-app-template

Then, start the web server. It defaults to port 3030. This will also run `grunt` to compile assets.

    $ npm start

    > rendr-app-template@0.0.1 start /Users/spike/code/rendr-app-template
	> DEBUG=app:* node index.js

	Running "handlebars:compile" (handlebars) task
	File "app/templates/compiledTemplates.js" created.

	Running "bundle" task
	Compiled /Users/spike/code/rendr-app-template/public/mergedAssets.js

	Running "stylus:compile" (stylus) task
	File public/styles.css created.

	Done, without errors.

	server pid 71878 listening on port 3030 in development mode

Then pull up the app in your web browser:

    $ open http://localhost:3030

You can choose a different port by passing the `PORT` environment variable:

    $ PORT=80 npm start

### GitHub API rate limit

GitHub [rate limits](http://developer.github.com/v3/#rate-limiting) unauthenticated requests to its public API to 60 requests per hour per IP. This should be enough for just playing with the sample app, but if you pull it down and start developing off it you may run up against the rate limit.

If this happens to you, you can supply your GitHub creds for HTTP Basic Auth using the BASIC_AUTH environment variable. **Be very, very careful with this!** It means you will be typing your GitHub credentials in plain text, which will be saved to your Bash history and may be intercepted by other programs. If you do this, immediately change your password before and afterwards. This should only be necessary if you're developing on the app and need to keep refreshing the page.

	$ BASIC_AUTH=githubusername:githubpassword npm start

**You've been warned.** Your best bet may be to alter the project to read from your favorite RESTful API.

## Getting Started With Rendr

This basic Rendr app looks like a hybrid between a standard client-side MVC Backbone.js app and an Express app, with a little Rails convention thrown in.

Check out the directory structure:

    |- app/
    |--- collections/
    |--- controllers/
    |--- models/
    |--- templates/
    |--- views/
    |--- app.js
    |--- router.js
    |--- routes.js
    |- assets/
    |- config/
    |- public/
    |- server/

**Note**: I want to stress that this is just one way to build an app using Rendr. I hope it can evolve to support a number of different app configurations, with the shared premise that the components should be able to run on either side of the wire. For example, the full-on client-side MVC model isn't appropriate for all types of apps. Sometimes it's more appropriate to load HTML fragments over the wire, also known as PJAX. Rendr apps should be able to support this as well.

## CommonJS using Stitch

Node.js uses the CommonJS module pattern, and using a tool called [Stitch](https://github.com/sstephenson/stitch), we can emulate it in the browser. This looks familiar in Node.js:

```js
var User = require('app/models/user');
```
Using Stitch, we can use the same `require()` function in the browser. This is a huge win, because it allows us to just think about application logic when creating our views, models, collections, etc., and not about packaging the modules differently for client and server.

In Node.js, you can also use `require()` to load submodules within NPM models. For example, we could load Rendr's base view in order to extend it to create a view for our app.

```js
var BaseView = require('rendr/shared/base/view');
```
Using a trick with the way we do Stitch packaging, this module path works in the browser as well.

## Routes file

```js
// app/routes.js
module.exports = function(match) {
  match('',                   'home#index');
  match('repos',              'repos#index');
  match('repos/:owner/:name', 'repos#show');
  match('users'       ,       'users#index');
  match('users/:login',       'users#show');
};

```

## Controllers

A controller is a simple JavaScript object, where each property is a controller action.  Here is the most simple controller.

```js
// app/controllers/home_controller.js
module.exports = {
  index: function(params, callback) {
    callback(null, 'home_index_view');
  }
};

```


## Views

A Rendr view is a sublcass of `Backbone.View` with some additional methods added to support client-server rendering, plus methods that make it easier to manage the view lifecycle.

Creating your own view should look familiar to Backbone users:

```js
// app/views/home_index_view.js
var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'home_index_view',
  
  events: {
    'click p': 'handleClick',
  },
  
  handleClick: function() {…}
});
module.exports.id = 'HomeIndexView';
```

You can add `className`, `tagName`, `events`, and all of the other `Backbone.View` properties you know and love.

We set the property `indentifier` on the view constructor to aid in the view hydration process. More on that later.

Our views, just like all of the code in the `app/` directory, are executed in both the client and the server, but of course certain behaviors are only relevant in the client. The `events` hash is ignored by the server, as well as any DOM-related event handlers.

### The view lifecycle

### The view hierarchy


## Templates


## Assets

In this example we use [Grunt](https://github.com/gruntjs/grunt) to manage asset compilation. We compile JavaScripts using [Stitch](https://github.com/sstephenson/stitch) and stylesheets using [Stylus](https://github.com/learnboost/stylus). Check out `Gruntfile.js` in the root directory of this repo for details.


## License

MIT

# Rendr App Template
## GitHub Browser

The purpose of this little app is to demonstrate one way of using Rendr to build a web app that runs on both the client and the server.

## Running the example

First, make sure to have Node >= 0.8.0 [installed on your system](http://nodejs.org/). Then, clone this repo to a local directory and run `npm install` to install dependencies:

    $ git clone git@github.com:airbnb/rendr-app-template.git
    $ cd rendr-app-template
    $ npm install

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

```js
// app/views/home_index_view.js
var BaseView = require('./base_view');

module.exports = BaseView.extend({});
module.exports.identifier = 'HomeIndexView';
```

We set the property `indentifier` on the view constructor to aid in the view hydration process. More on that later.

If using CoffeeScript, a view constructor's `name` property is set for you.


```coffeescript
# app/views/home_index_view.coffee
BaseView = require('./base_view')

module.exports = class HomeIndexView extends BaseView

console.log(module.exports.name)
 => "HomeIndexView"
```

### The view lifecycle

### The view hierarchy


## Templates


## Asset Bundling


## TODO
* Grunt
* Lazy load repos

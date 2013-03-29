# Rendr App Template
## GitHub Browser

The purpose of this little app is to demonstrate one way of using Rendr to build a web app that runs on both the client and the server.
## Getting Started

This basic Rendr app looks like a hybrid between a standard client-side MVC Backbone.js app and an Express app, with a little Rails convention thrown in.

Check out the directory structure:

    |- app/
    |--- collections/
    |--- controllers/
    |--- helpers/
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
module.exports = function(match) {
  match('',                   'home#index');
  match('repos',              'repos#index');
  match('repos/:owner/:name', 'repos#show');
  match('users'       ,       'users#index');
  match('users/:login',       'users#show');
};

``

## Controllers


## Views


## Templates


## Asset Bundling


## TODO
* Grunt
* Lazy load repos

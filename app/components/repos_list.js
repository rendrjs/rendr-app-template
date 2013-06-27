/**
 * @jsx React.DOM
 */
var React = require('../lib/modules/React');

var ReposList = React.createClass({displayName: 'ReposList',
  getInitialState: function() {
    return {repos: this.props.repos};
  },
  render: function() {
    var listItems = this.state.repos.map(function(repo) {
      var repoUrl = "/repos/" + repo.owner.login + "/" + repo.name
        , userUrl = "/users/" + repo.owner.login;
      return React.DOM.li(null, [React.DOM.a( {href:repoUrl}, repo.name),", by ", React.DOM.a( {href:userUrl}, repo.owner.login)])
    });

    return React.DOM.div(null, [
      React.DOM.h1(null, "Repos"),
      React.DOM.ul(null, 
        listItems
      ),
      React.DOM.a( {href:"javascript:;", onClick:this.handleClick}, "Add a new repo")
    ]);
  },
  handleClick: React.autoBind(function() {
    var newRepo = {
      owner: {login: 'blah'},
      name: 'new repo'
    };
    this.setState({
      repos: this.state.repos.concat([newRepo])
    });
  })
});

module.exports = ReposList;

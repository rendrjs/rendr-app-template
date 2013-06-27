/**
 * @jsx React.DOM
 */
var React = require('../lib/modules/React');

var ReposList = React.createClass({
  getInitialState: function() {
    return {repos: this.props.repos};
  },
  render: function() {
    var listItems = this.state.repos.map(function(repo) {
      var repoUrl = "/repos/" + repo.owner.login + "/" + repo.name
        , userUrl = "/users/" + repo.owner.login;
      return <li><a href={repoUrl}>{repo.name}</a>, by <a href={userUrl}>{repo.owner.login}</a></li>
    });

    return <div>
      <h1>Repos</h1>
      <ul>
        {listItems}
      </ul>
      <a href="javascript:;" onClick={this.handleClick}>Add a new repo</a>
    </div>;
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

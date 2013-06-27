/**
 * @jsx React.DOM
 */
var React = require('../lib/modules/React');

var ReposList = React.createClass({displayName: 'ReposList',
  render: function() {
    return React.DOM.p(null, JSON.stringify(this.props.repos));
  }
});

module.exports = ReposList;

/**
 * @jsx React.DOM
 */
var React = require('..lib/modules/React');

var ExampleApplication = React.createClass({displayName: 'ExampleApplication',
  render: function() {
    var elapsed = Math.round(this.props.elapsed / 100);
    var seconds = elapsed / 10 + (elapsed % 10 ? '' : '.0' );
    var message =
      'React has been successfully running for ' + seconds + ' seconds.';

    return React.DOM.p(null, [message]);
  }
});

module.exports = ExampleApplication;

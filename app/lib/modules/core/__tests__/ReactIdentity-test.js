/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @jsx React.DOM
 * @emails react-core
 */

"use strict";

var React;
var ReactTestUtils;
var reactComponentExpect;
var ReactID;

describe('ReactIdentity', function() {

  beforeEach(function() {
    require("../../mock-modules").dumpCache();
    React = require("../../React");
    ReactTestUtils = require("../../ReactTestUtils");
    reactComponentExpect = require("../../reactComponentExpect");
    ReactID = require("../../ReactID");
  });

  var idExp = /^\.reactRoot\[\d+\](.*)$/;
  function checkId(child, expectedId) {
    var actual = idExp.exec(ReactID.getID(child));
    var expected = idExp.exec(expectedId);
    expect(actual).toBeTruthy();
    expect(expected).toBeTruthy();
    expect(actual[1]).toEqual(expected[1]);
  }

  it('should allow keyed objects to express identity', function() {
    var instance =
      React.DOM.div(null, 
        {
          first: React.DOM.div(null ),
          second: React.DOM.div(null )
        }
      );

    React.renderComponent(instance, document.createElement('div'));
    var node = instance.getDOMNode();
    reactComponentExpect(instance).toBeDOMComponentWithChildCount(2);
    checkId(node.childNodes[0], '.reactRoot[0].[0]{first}');
    checkId(node.childNodes[1], '.reactRoot[0].[0]{second}');
  });

  it('should allow key property to express identity', function() {
    var instance =
      React.DOM.div(null, 
        React.DOM.div( {key:"apple"} ),
        React.DOM.div( {key:"banana"} ),
        React.DOM.div( {key:0} ),
        React.DOM.div( {key:123} )
      );

    React.renderComponent(instance, document.createElement('div'));
    var node = instance.getDOMNode();
    reactComponentExpect(instance).toBeDOMComponentWithChildCount(4);
    checkId(node.childNodes[0], '.reactRoot[0].[0:apple]');
    checkId(node.childNodes[1], '.reactRoot[0].[0:banana]');
    checkId(node.childNodes[2], '.reactRoot[0].[0:0]');
    checkId(node.childNodes[3], '.reactRoot[0].[0:123]');
  });

  it('should use instance identity', function() {

    var Wrapper = React.createClass({displayName: 'Wrapper',
      render: function() {
        return React.DOM.a( {key:"i_get_overwritten"}, this.props.children);
      }
    });

    var instance =
      React.DOM.div(null, 
        Wrapper( {key:"wrap1"}, React.DOM.span( {key:"squirrel"} )),
        Wrapper( {key:"wrap2"}, React.DOM.span( {key:"bunny"} )),
        Wrapper(null, React.DOM.span( {key:"chipmunk"} ))
      );

    React.renderComponent(instance, document.createElement('div'));
    var node = instance.getDOMNode();
    reactComponentExpect(instance).toBeDOMComponentWithChildCount(3);
    checkId(node.childNodes[0], '.reactRoot[0].[0:wrap1]');
    checkId(
      node.childNodes[0].firstChild,
      '.reactRoot[0].[0:wrap1].[0:squirrel]'
    );
    checkId(node.childNodes[1], '.reactRoot[0].[0:wrap2]');
    checkId(node.childNodes[1].firstChild, '.reactRoot[0].[0:wrap2].[0:bunny]');
    checkId(node.childNodes[2], '.reactRoot[0].[0:2]');
    checkId(node.childNodes[2].firstChild, '.reactRoot[0].[0:2].[0:chipmunk]');
  });

  it('should let restructured components retain their uniqueness', function() {
    var instance0 = React.DOM.span(null );
    var instance1 = React.DOM.span(null );
    var instance2 = React.DOM.span(null );

    var TestComponent = React.createClass({displayName: 'TestComponent',
      render: function() {
        return (
          React.DOM.div(null, 
            instance2,
            this.props.children[0],
            this.props.children[1]
          )
        );
      }
    });

    var TestContainer = React.createClass({displayName: 'TestContainer',

      render: function() {
        return TestComponent(null, instance0, instance1);
      }

    });

    expect(function() {

      React.renderComponent(TestContainer(null ), document.createElement('div'));

    }).not.toThrow();
  });

  it('should let nested restructures retain their uniqueness', function() {
    var instance0 = React.DOM.span(null );
    var instance1 = React.DOM.span(null );
    var instance2 = React.DOM.span(null );

    var TestComponent = React.createClass({displayName: 'TestComponent',
      render: function() {
        return (
          React.DOM.div(null, 
            instance2,
            this.props.children[0],
            this.props.children[1]
          )
        );
      }
    });

    var TestContainer = React.createClass({displayName: 'TestContainer',

      render: function() {
        return (
          React.DOM.div(null, 
            TestComponent(null, instance0, instance1)
          )
        );
      }

    });

    expect(function() {

      React.renderComponent(TestContainer(null ), document.createElement('div'));

    }).not.toThrow();
  });

  it('should let text nodes retain their uniqueness', function() {
    var TestComponent = React.createClass({displayName: 'TestComponent',
      render: function() {
        return React.DOM.div(null, this.props.children,React.DOM.span(null ));
      }
    });

    var TestContainer = React.createClass({displayName: 'TestContainer',

      render: function() {
        return (
          TestComponent(null, 
            React.DOM.div(null ),
            'second'
          )
        );
      }

    });

    expect(function() {

      React.renderComponent(TestContainer(null ), document.createElement('div'));

    }).not.toThrow();
  });

  it('should retain keys during updates in composite components', function() {

    var TestComponent = React.createClass({displayName: 'TestComponent',
      render: function() {
        return React.DOM.div(null, this.props.children);
      }
    });

    var TestContainer = React.createClass({displayName: 'TestContainer',

      getInitialState: function() {
        return { swapped: false };
      },

      swap: function() {
        this.setState({ swapped: true });
      },

      render: function() {
        return (
          TestComponent(null, 
            this.state.swapped ? this.props.second : this.props.first,
            this.state.swapped ? this.props.first : this.props.second
          )
        );
      }

    });

    var instance0 = React.DOM.span( {key:"A"} );
    var instance1 = React.DOM.span( {key:"B"} );

    var wrapped = TestContainer( {first:instance0, second:instance1} );

    React.renderComponent(wrapped, document.createElement('div'));

    var beforeKey = wrapped
      ._renderedComponent
      ._renderedComponent
      .props.children[0]._key;

    wrapped.swap();

    var afterKey = wrapped
      ._renderedComponent
      ._renderedComponent
      .props.children[0]._key;

    expect(beforeKey).not.toEqual(afterKey);

  });

});

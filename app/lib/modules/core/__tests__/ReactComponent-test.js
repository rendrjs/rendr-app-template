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

describe('ReactComponent', function() {
  beforeEach(function() {
    React = require("../../React");
    ReactTestUtils = require("../../ReactTestUtils");
    reactComponentExpect = require("../../reactComponentExpect");
  });

  it('should throw when supplying a ref outside of render method', function() {
    var instance = React.DOM.div( {ref:"badDiv"} );
    expect(function() {
      ReactTestUtils.renderIntoDocument(instance);
    }).toThrow();
  });

  it('should throw when attempting to hijack a ref', function() {
    var Component = React.createClass({displayName: 'Component',
      render: function() {
        var child = this.props.child;
        this.attachRef('test', child);
        return child;
      }
    });

    var instance = Component( {child:React.DOM.span(null )} );

    expect(function() {
      ReactTestUtils.renderIntoDocument(instance);
    }).toThrow(
      'Invariant Violation: attachRef(test, ...): Only a component\'s owner ' +
      'can store a ref to it.'
    );
  });

  it('should support refs on owned components', function() {
    var inner, outer;

    var Component = React.createClass({displayName: 'Component',
      render: function() {
        inner = React.DOM.div( {ref:"inner"} );
        outer = React.DOM.div( {ref:"outer"}, inner);
        return outer;
      },
      componentDidMount: function() {
        expect(this.refs.inner).toEqual(inner);
        expect(this.refs.outer).toEqual(outer);
      }
    });

    var instance = Component( {child:React.DOM.span(null )} );
    ReactTestUtils.renderIntoDocument(instance);
  });

  it('should not have refs on unmounted components', function() {
    var Parent = React.createClass({displayName: 'Parent',
      render: function() {
        return Child(null, React.DOM.div( {ref:"test"} ));
      },
      componentDidMount: function() {
        expect(this.refs && this.refs.test).toEqual(undefined);
      }
    });
    var Child = React.createClass({displayName: 'Child',
      render: function() {
        return React.DOM.div(null );
      }
    });

    var instance = Parent( {child:React.DOM.span(null )} );
    ReactTestUtils.renderIntoDocument(instance);
  });

  it('should correctly determine if a component is mounted', function() {
    var Component = React.createClass({displayName: 'Component',
      componentWillMount: function() {
        expect(this.isMounted()).toBeFalsy();
      },
      componentDidMount: function() {
        expect(this.isMounted()).toBeTruthy();
      },
      render: function() {
        return React.DOM.div(null);
      }
    });

    var instance = Component(null );

    expect(instance.isMounted()).toBeFalsy();
    ReactTestUtils.renderIntoDocument(instance);
    expect(instance.isMounted()).toBeTruthy();
  });
});

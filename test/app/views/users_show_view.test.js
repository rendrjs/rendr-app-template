var should = require("should");
var UsersShowView = require('../../../app/views/users_show_view');

describe('UsersShowView', function() {

  it('should have repos data in getTemplateData', function() {
    var repos = [{foo: 'bar'}];
    var view = new UsersShowView({ repos: repos });
    var data = view.getTemplateData();
    data.should.have.property('repos', repos);
  });

});

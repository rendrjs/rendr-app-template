module.exports = Handlebars.templates = {};

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['error_view.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n  ";
  foundHelper = helpers.message;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n  ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "shared.Unknown Error", {hash:{}}) : helperMissing.call(depth0, "t", "shared.Unknown Error", {hash:{}});
  buffer += escapeExpression(stack1) + "\n";
  return buffer;}

function program5(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n  <pre>";
  foundHelper = helpers.stack;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.stack; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</pre>\n";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n  ";
  foundHelper = helpers['t'];
  stack1 = foundHelper ? foundHelper.call(depth0, "mobile.nice error", {hash:{}}) : helperMissing.call(depth0, "t", "mobile.nice error", {hash:{}});
  buffer += escapeExpression(stack1) + "\n";
  return buffer;}

  buffer += "<h2>\n";
  stack1 = depth0.message;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</h2>\n\n<div class=\"content\">\n";
  stack1 = depth0.stack;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;});
templates['home_index_view.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "hi\n";});
})();

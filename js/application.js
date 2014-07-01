(function (window, $, _, undefined) { 'use strict';

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g     // mustache-style bindings
  };

  //
  // Collection
  //

  var Collection = function (data, jqElem, template) {
    this.data = _.map(data, function (element) {
      return _.extend(element, { uuid: _.uniqueId() });
    });
    this.jqElem = jqElem;
    this.tmpl = _.template(template);
  };

  // Brute Force view rendering
  Collection.prototype.render = function () {
    var self = this;
    this.jqElem.empty();
    _.each(this.data, function (employee) {
      self.jqElem.prepend(self.tmpl(employee));
    });
  };

  // Adds element to collection and adds template instance to DOM
  Collection.prototype.add = function (obj) {
    this.data.push(_.extend(obj, { uuid: _.uniqueId() }));
    this.jqElem.prepend(this.tmpl(obj));
  };

  // Removes item from collection and removes template instance from DOM
  Collection.prototype.removeById = function (uuid) {
    this.data.splice(_.indexOf(
      this.data,
      _.findWhere(this.data, { uuid: uuid.toString() })
      ), 1);
    this.jqElem.find('.employee[data-uuid=' + uuid + ']').remove();
  };

  //
  // Helper Functions
  //

  // URL validator
  var isValidURL = function (url) {
    var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return re.test(url);
  };

  //
  // Init data (provided)
  //

  var data = [
    { name: "Mark-Paul Gosselaar", photo_url: "" },
    { name: "Delta Burke", photo_url: "img/avatars/delta.png" },
    { name: "Alf", photo_url: "img/avatars/alf.png" },
    { name: "Jaleel White", photo_url: "img/avatars/jaleel.png" },
    { name: "Ralph Macchio", photo_url: "img/avatars/ralph.png" },
    { name: "Candace Cameron", photo_url: "img/avatars/candace.png" },
    { name: "Patrick Duffy", photo_url: "img/avatars/pduff.png" },
    { name: "Arnold Schwartzengger", photo_url: "img/avatars/arnold.png" }
  ];

  //
  // DOM Ready
  //

  $().ready(function () {

    var $list = $('.employee-list')
      , employees = new Collection(data, $list, $('script#employee-card').html())
      ;

    // Render initial employees view
    employees.render();

    //
    // Attach Event Handlers
    //

    // Form Submitted
    $('form').submit(function (e) {

      e.preventDefault();

      // Create hash from form data
      var data = _.reduce(
        $(this).serializeArray(),
        function (obj, val) {
          obj[val.name] = val.value.trim();
          return obj;
        },
        {});

      // Replace invalid photo_urls with empty string
      if (!isValidURL(data.photo_url)) {
        data.photo_url = '';
      }

      // Mutate collection
      employees.add(data);

      // Reset the form
      $(this).find('input').val('');
    });

    // Card Remove Icon Clicked
    $list.on('click', '.close', function () {
      var uuid = $(this).closest('.employee').data('uuid');
      employees.removeById(uuid);
    });
  });


})(window, window.jQuery, window._);

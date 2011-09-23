(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    window.sanity = function() {
      return 'sane';
    };
    window.Animal = (function() {
      __extends(Animal, Backbone.Model);
      function Animal() {
        Animal.__super__.constructor.apply(this, arguments);
      }
      return Animal;
    })();
    window.AnimalView = (function() {
      __extends(AnimalView, Backbone.View);
      function AnimalView() {
        this.render = __bind(this.render, this);
        this.initialize = __bind(this.initialize, this);
        AnimalView.__super__.constructor.apply(this, arguments);
      }
      AnimalView.prototype.template = _.template($('#animal-template').html());
      AnimalView.prototype.tagName = "li";
      AnimalView.prototype.className = "animal";
      AnimalView.prototype.initialize = function() {
        return this.model.bind("change", this.render);
      };
      AnimalView.prototype.render = function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      };
      return AnimalView;
    })();
    return window.Animals = (function() {
      __extends(Animals, Backbone.Collection);
      function Animals() {
        Animals.__super__.constructor.apply(this, arguments);
      }
      Animals.prototype.model = Animal;
      Animals.prototype.url = '/animals';
      return Animals;
    })();
  })();
}).call(this);

do $ ->
  window.sanity = ->
    'sane'

  class window.Animal extends Backbone.Model

  class window.AnimalView extends Backbone.View
    template: _.template($('#animal-template').html())
    tagName: "li"
    className: "animal"

    initialize: =>
      @model.bind("change", @render)

    render: =>
       $(@el).html @template(@model.toJSON())
       @

  class window.Animals extends Backbone.Collection
    model: Animal
    url: '/animals'

  class window.AnimalsView extends Backbone.View
    tagName: "ul"
    className: "animals"

    initialize: =>
      @collection.bind("reset", @render)
      @collection.bind("add", @renderOne)
      @collection.bind("remove", @render)

    render: =>
      @$(@el).empty()
      @collection.each(@renderOne)
      @

    renderOne: (animal) =>
       view = new AnimalView({model: animal})
       @$(@el).append(view.render().el)

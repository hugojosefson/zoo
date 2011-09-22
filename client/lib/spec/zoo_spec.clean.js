(function() {

  describe('sanity', function() {
    it('should return sane', function() {
      expect(sanity()).toEqual('sane');
    });
  });

  describe('Animal', function() {
    beforeEach(function() {
      this.animal = new Animal(tapir);
    });

    it('should hold kind, name, and image', function() {
      expect(this.animal.id).toBe(1);
      expect(this.animal.get('kind')).toBe('Tapir');
      expect(this.animal.get('name')).toBe('Dan Ariely');
      expect(this.animal.get('age')).toBe(5);
      expect(this.animal.get('image')).toBe('/images/tapir.png');
    });
  });

  describe('AnimalView', function() {
    beforeEach(function() {
      this.animal = new Animal(tapir);
      this.animalView = new AnimalView({
        model: this.animal
      });
    });

    it('should have a tag of li', function() {
      expect(this.animalView.tagName).toBe('li');
    });

    it('should have a classname animal', function() {
      expect(this.animalView.className).toBe('animal');
    });

    it('should render the animal-template', function() {
      $('#container').append(this.animalView.render().el);
      expect($('#container .animal').size()).toBe(1);
      expect($('#container .animal h1').text()).toBe('Tapir');
      expect($('#container .animal h2').text()).toBe('Dan Ariely');
      expect($('#container .animal h3').text()).toBe('5');
      expect($('#container .animal img').attr('src')).toBe('/images/tapir.png');
    });

    it('should change when the model changes', function() {
      $('#container').append(this.animalView.render().el);
      expect($('#container .animal h2').text()).toBe('Dan Ariely');
      this.animal.set({
        name: 'Daniel Pink'
      });
      expect($('#container .animal h2').text()).toBe('Daniel Pink');
    });
    afterEach(function() {
      $('#container').empty();
    });
  });

  describe('Animals', function() {
    beforeEach(function() {
      this.animals = new Animals(animals);
    });

    it('should hold Animal models', function() {
      expect(this.animals.model).toBe(Animal);
    });

    it('should have a url of /animals', function() {
      expect(this.animals.url).toBe('/animals');
    });

    it('should contain three animals', function() {
      expect(this.animals.size()).toBe(3);
    });

    it('should have the kinds Tapir, Aardvark, and Sloth', function() {
      expect(this.animals.pluck('kind')).toEqual(['Tapir', 'Aardvark', 'Sloth']);
    });
  });

  describe('AnimalsView', function() {
    beforeEach(function() {
      this.animals = new Animals(animals);
      this.animalsView = new AnimalsView({
        collection: this.animals
      });
    });

    it('should have a tag of ul', function() {
      expect(this.animalsView.tagName).toBe('ul');
    });

    it('should have a classname as animals', function() {
      expect(this.animalsView.className).toBe('animals');
    });

    describe('render', function() {
      beforeEach(function() {
        $('#container').append(this.animalsView.render().el);
      });

      it('should render', function() {
        expect($('#container .animals').size()).toBe(1);
      });

      it("should render three li's", function() {
        expect($('#container .animals li').size()).toBe(3);
      });

      it('should be empty when the collection is reset', function() {
        expect($('#container .animals li').size()).toBe(3);
        this.animals.reset();
        expect($('#container .animals li').size()).toBe(0);
      });

      it('should grow when an item is added to the collection', function() {
        expect($('#container .animals li').size()).toBe(3);
        this.animals.add(new Animal({
          kind: 'Platypus',
          name: 'Plato',
          age: 100,
          image: ''
        }));
        expect($('#container .animals li').size()).toBe(4);
      });

      it('should shrink when an item is removed from the collection', function() {
        var animal;
        expect($('#container .animals li').size()).toBe(3);
        animal = this.animals.at(0);
        this.animals.remove(animal);
        expect($('#container .animals li').size()).toBe(2);
      });
      afterEach(function() {
        $('#container').empty();
      });
    });
  });

  describe('Events', function() {
    beforeEach(function() {
      this.animal = new Animal(tapir);
      this.animalView = new AnimalView({
        model: this.animal
      });
      $('#container').append(this.animalView.render().el);
    });

    it('clicking age should increase the age by one', function() {
      expect($('#container .animal h3').text()).toBe('5');
      $('#container .animal h3').click();
      expect($('#container .animal h3').text()).toBe('6');
    });
    afterEach(function() {
      $('#container').empty();
    });
  });

  describe('Router', function() {
    beforeEach(function() {
      this.router = new ZooRouter();
      if (window.routerStarted == null) {
        Backbone.history.start();
        window.routerStarted = true;
      }
    });

    it('should route "" to zoo function', function() {
      var zooCalled;
      zooCalled = false;
      this.router.bind('route:zoo', function() {
        zooCalled = true;
      });
      this.router.navigate('', true);
      expect(zooCalled).toBe(true);
    });

    it('should route #cage to cage function with id 1', function() {
      var cageCalled, cageNum;
      cageCalled = false;
      cageNum = null;
      this.router.bind('route:cage', function(num) {
        cageCalled = true;
        cageNum = num;
      });
      this.router.navigate('cage/1', true);
      expect(cageCalled).toBe(true);
      expect(cageNum).toBe('1');
    });
  });

  describe('Server', function() {
    beforeEach(function() {
      Backbone.emulateHTTP = false;
    });

    describe('/animals Animals#fetch', function() {
      beforeEach(function() {
        var found, isFound;
        this.animals = new Animals();
        found = false;
        this.animals.fetch({
          error: function(error) {
            console.log(error);
          },
          success: function(result) {
            console.log('fetch', result);
            found = true;
          }
        });
        isFound = function() {
          found;
        };
        waitsFor(isFound, 'Timeout error', 1000);
      });

      it('should populate the animals from the server', function() {
        console.log('animals', this.animals);
        expect(this.animals.size()).toBe(3);
        this.animals.at(0).destroy();
      });
    });

    describe('POST /animals Animals#create', function() {
      beforeEach(function() {
        var found, result, success;
        this.animals = new Animals();
        found = false;
        result = this.animals.create({
          kind: 'Elefant',
          name: 'Dumbo',
          image: ''
        }, {
          error: function(error) {
            console.log(error);
          },
          success: function(result) {
            console.log('create', result);
            found = true;
          }
        });
        success = function() {
          found;
        };
        waitsFor(success, 'Timeout error', 1000);
      });

      it('should save the animal to the server', function() {
        expect(this.animals.size()).toBe(4);
        this.animals.at(0).destroy();
      });
    });
  });
}).call(this);

(function() {
  describe('sanity', function() {
    return it('should return sane', function() {
      return expect(sanity()).toEqual('sane');
    });
  });
  describe('Book', function() {
    beforeEach(function() {
      return this.book = new Book(anders_books[0]);
    });
    return it('should hold title, author, and owner', function() {
      expect(this.book.get('title')).toBe('Predictably Irrational');
      expect(this.book.get('author')).toBe('Dan Ariely');
      return expect(this.book.get('owner')).toBe('Anders Janmyr');
    });
  });
  describe('BookView', function() {
    beforeEach(function() {
      this.book = new Book(anders_books[0]);
      return this.bookView = new BookView({
        model: this.book
      });
    });
    it('should hold a model', function() {
      expect(this.bookView.tagName).toBe('div');
      return expect(this.bookView.className).toBe('book');
    });
    it('should render the book-template', function() {
      $('#container').append(this.bookView.render().el);
      expect($('#container .book').size()).toBe(1);
      expect($('#container .book h1').text()).toBe('Predictably Irrational');
      expect($('#container .book h2').text()).toBe('Dan Ariely');
      return expect($('#container .book h3').text()).toBe('Anders Janmyr');
    });
    it('should change when the model changes', function() {
      $('#container').append(this.bookView.render().el);
      expect($('#container .book h2').text()).toBe('Dan Ariely');
      this.book.set({
        author: 'Daniel Pink'
      });
      return expect($('#container .book h2').text()).toBe('Daniel Pink');
    });
    return afterEach(function() {
      return $('#container').empty();
    });
  });
}).call(this);

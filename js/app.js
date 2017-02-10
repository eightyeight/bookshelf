var $ = require('jquery');
$.validate = require('jquery-validation');

var BooksApp = function() {
    var that = this;
    that.init();
}

BooksApp.prototype = {

    init: function() {
        var that = this;
        that.books = that.checkStorage() || [];
        that.$app = $('.js-app');
        that.$books = $('.js-books-block');
        that.$template = $('.js-book-template');
        that.$form = $('.js-form');
        that.$formButton = $('.js-form-button');
        that.$alert = $('.js-alert');
        if (that.books != []) {
            that.books.forEach(function(bookData, i) {
                that.renderBook(bookData, i);
            })
        }
        that.editMode = false;
        that.setValidation();
        that.setEvents();
        that.$app.show();
    },

    checkStorage: function() {
        if ('books' in localStorage) {
            var booksArr = JSON.parse(localStorage.books);
            if (booksArr.length > 0) {
                return booksArr
            }
        }
        return false
    },

    setValidation: function() {
        var that = this;
        that.$form.validate({
        	errorClass: 'book__field-alert js-field-alert',
            rules: {
                author: {
                    required: true
                },
                title: {
                	required: true
                },
                year: {
                	required: true,
                	number: true
                },
                pages: {
                	required: true,
                	number: true
                },
            },
            messages: {
            	author: 'Введите автора',
            	title: 'Введите название',
            	year: {
            		required: 'Введите год',
            		number: 'Используйте только цифры'
            	},
            	pages: {
            		required: 'Введите количество страниц',
            		number: 'Используйте только цифры'
            	}
            }
        });
    },

    setEvents: function() {
        var that = this;
        $('body')
            .on('submit', that.$form, function(e) {
                e.preventDefault();
                that.$formButton.prop('disabled', true);
                if (that.editMode) {
                    that.editBook();
                } else {
                    that.addBook();
                }
                that.$formButton.prop('disabled', false);
            })
            .on('click', '.js-book-remove', function(e) {
                if (!that.editMode) {
                    var $book = $(e.target).closest('.js-book');
                    that.removeBook($book);
                } else {
                    that.showAlert('Сохраните введенные изменения');
                }
            })
            .on('click', '.js-book-edit', function(e) {
                if (!that.editMode) {
                    var $book = $(e.target).closest('.js-book');
                    that.fillForm($book);
                } else {
                    that.showAlert('Сохраните введенные изменения');
                }
            });
    },

    renderBook: function(bookData, i) {
        var that = this,
            $newBook = that.$template.clone().appendTo(that.$books);
        $newBook.find('.js-book-author').text(bookData.author);
        $newBook.find('.js-book-title').text(bookData.title);
        $newBook
            .attr('data-index', i)
            .removeClass('book__template')
            .removeClass('js-book-template')
    },

    addBook: function() {
        var that = this,
            index = that.books.length,
            bookData = that.getFormValues();
        that.renderBook(bookData, index);
        that.books.push(bookData);
        that.updateStorage();
    },

    removeBook: function($book) {
        var that = this,
            index = $book.data('index');
        $book.remove();
        that.books.splice(index, 1);
        that.updateStorage();
    },

    editBook: function() {
        var that = this,
            index = that.$form.data('current-index'),
            bookData = that.getFormValues(),
            $currentBook = that.$books.find('.js-book[data-index=' + index + ']');
        $currentBook.find('.js-book-author').text(bookData.author);
        $currentBook.find('.js-book-title').text(bookData.title);
        that.books[index] = bookData;
        that.updateStorage();
        that.editMode = false;
        that.$form.removeAttr('data-current-index');
        that.$formButton.text('Добавить');
    },

    fillForm: function($book) {
        var that = this,
            index = $book.data('index'),
            bookData = that.books[index];
        $('label.js-field-alert').hide();
        that.$form.find('input').each(function(i, item) {
            var $item = $(item),
                key = $item.attr('name'),
                val = bookData[key];
            $item.val(val);
        })
        that.$form.attr('data-current-index', index);
        that.editMode = true;
        that.$formButton.text('Сохранить');
    },

    getFormValues: function() {
        var that = this,
            bookData = {};
        that.$form.find('input').each(function(i, item) {
            var $item = $(item),
                key = $item.attr('name'),
                val = $item.val();
            $item.val('');
            bookData[key] = val;
        });
        return bookData;
    },

    updateStorage: function() {
        var that = this;
        localStorage.books = JSON.stringify(that.books);
    },

    showAlert: function(message) {
        var that = this;
        that.$alert.text(message).show().css('opacity', 1)
        setTimeout(function() {
            that.$alert.css('opacity', 0).empty().hide();
        }, 2000);
    },

}

$(document).ready(function() {
    var booksApp = new BooksApp();
});

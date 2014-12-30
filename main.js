(function() {
  var App, COLUMN_HALF, COLUMN_WHOLE,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  COLUMN_HALF = 1;

  COLUMN_WHOLE = 2;

  App = (function() {
    var PrivateClass, columns, doms, numbers, rows, sharedInstance;

    function App() {}

    sharedInstance = null;

    numbers = [null, null, null];

    rows = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];

    columns = COLUMN_WHOLE;

    doms = null;

    PrivateClass = (function() {
      function PrivateClass() {
        doms = {
          answers: $('#answers').children('tbody'),
          left: $('#left'),
          right: $('#right'),
          answer: $('#answer'),
          help: $('#help'),
          bg: $('#background')
        };
      }

      PrivateClass.prototype.pushNumber = function(number) {
        var i, _i, _results;
        if (numbers[0] === null && number === 0) {
          return;
        }
        _results = [];
        for (i = _i = 0; _i <= 2; i = ++_i) {
          if (numbers[i] === null) {
            numbers[i] = number;
            this.updateAnswer();
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      PrivateClass.prototype.popNumber = function() {
        var i, _i, _results;
        _results = [];
        for (i = _i = 2; _i >= 0; i = --_i) {
          if (numbers[i] !== null) {
            numbers[i] = null;
            this.updateAnswer();
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      PrivateClass.prototype.submit = function() {
        var answer, left, right;
        if (numbers[0] === null) {
          return;
        }
        left = parseInt(doms.left.text(), 10);
        right = parseInt(doms.right.text(), 10);
        answer = parseInt(doms.answer.text(), 10);
        return this.updateAnswersTable(left, right, answer);
      };

      PrivateClass.prototype.updateAnswer = function() {
        var i, str, _i;
        str = '';
        for (i = _i = 0; _i <= 2; i = ++_i) {
          str += (function(n) {
            if (n === null) {
              return '';
            } else {
              return n.toString();
            }
          })(numbers[i]);
        }
        if (str === '') {
          str = '?';
        }
        return doms.answer.text(str);
      };

      PrivateClass.prototype.updateAnswersTable = function(left, right, answer) {
        var correctAnswer, isCorrect;
        correctAnswer = left * right;
        isCorrect = answer === left * right;
        doms.answers.prepend($('<tr />').append($('<td />').addClass('isCorrect ' + (isCorrect ? 'correct' : 'wrong')), $('<td />').addClass('left').text(left), $('<td />').addClass('times').text('×'), $('<td />').addClass('right').text(right), $('<td />').addClass('equal').text('='), $('<td />').addClass('answer' + (isCorrect ? '' : ' wrong')).text(answer), $('<td />').addClass('correct-answer').text(isCorrect ? '' : correctAnswer)));
        if (doms.answers.children().length > 10) {
          doms.answers.children().last().remove();
        }
        return this.updateQuestion();
      };

      PrivateClass.prototype.updateQuestion = function() {
        var left, right, _ref;
        _ref = [null, null, null], numbers[0] = _ref[0], numbers[1] = _ref[1], numbers[2] = _ref[2];
        this.updateAnswer();
        left = this.getLeft();
        right = this.getRight();
        doms.left.text(left);
        return doms.right.text(right);
      };

      PrivateClass.prototype.getLeft = function() {
        var availableNumbers, i, index, length, _i;
        availableNumbers = [];
        for (i = _i = 1; _i <= 20; i = ++_i) {
          if (rows[i - 1] === true) {
            availableNumbers.push(i);
          }
        }
        length = availableNumbers.length;
        index = Math.floor(Math.random() * length);
        return availableNumbers[index];
      };

      PrivateClass.prototype.getRight = function() {
        var availableNumbers, index, length;
        availableNumbers = columns === COLUMN_HALF ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        length = availableNumbers.length;
        index = Math.floor(Math.random() * length);
        return availableNumbers[index];
      };

      PrivateClass.prototype.toggleRow = function(row) {
        return rows[row - 1] = !rows[row - 1];
      };

      PrivateClass.prototype.toggleColumns = function() {
        if (columns === COLUMN_WHOLE) {
          return columns = COLUMN_HALF;
        } else {
          return columns = COLUMN_WHOLE;
        }
      };

      return PrivateClass;

    })();

    App.getSingletonInstance = function() {
      return sharedInstance != null ? sharedInstance : sharedInstance = new PrivateClass;
    };

    return App;

  })();

  $(function() {
    var app;
    app = App.getSingletonInstance();
    app.updateQuestion();
    $(window).keydown(function(e) {
      var isTenkeys, number, _ref, _ref1;
      isTenkeys = (_ref = e.which, __indexOf.call([96, 97, 98, 99, 100, 101, 102, 103, 104, 105], _ref) >= 0);
      if ((_ref1 = e.which, __indexOf.call([48, 49, 50, 51, 52, 53, 54, 55, 56, 57], _ref1) >= 0) || isTenkeys) {
        e.preventDefault();
        number = e.which - (isTenkeys ? 96 : 48);
        return app.pushNumber(number);
      } else if (e.which === 8) {
        e.preventDefault();
        return app.popNumber();
      } else if (e.which === 13) {
        e.preventDefault();
        return app.submit();
      }
    });
    $('.button-column').on('click', function() {
      $(this).parent().toggleClass('half');
      return app.toggleColumns();
    });
    return $('.button-row').on('click', function() {
      var row;
      row = $(this).attr('data-row');
      app.toggleRow(row);
      return $(this).parent().toggleClass('disabled');
    });
  });

}).call(this);

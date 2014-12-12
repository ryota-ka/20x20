class App
  sharedInstance = null
  numbers = [null, null, null]
  $doms = null
  class PrivateClass
    constructor: ->
      $doms =
        answers: $('#answers').children('tbody')
        left:    $('#left')
        right:   $('#right')
        answer:  $('#answer')
        help:    $('#help')

    pushNumber: (number) ->
      return if numbers[0] is null and number is 0
      for i in [0..2]
        if numbers[i] is null
          numbers[i] = number
          @updateAnswer()
          break

    popNumber: ->
      for i in [2..0]
        unless numbers[i] is null
          numbers[i] = null
          @updateAnswer()
          break

    submit: ->
      return if numbers[0] is null
      left = parseInt($doms.left.text(), 10)
      right = parseInt($doms.right.text(), 10)
      answer = parseInt($doms.answer.text(), 10)
      @updateAnswersTable(left, right, answer)

    updateAnswer: ->
      str = ''
      for i in [0..2]
        str += ((n) ->
          if n is null
            ''
          else
            n.toString()
        )(numbers[i])
      str = '?' if str is ''
      $doms.answer.text(str)

    updateAnswersTable: (left, right, answer) ->
      correctAnswer = left * right
      isCorrect = answer is left * right
      $doms.answers.prepend(
        $('<tr />').append(
          $('<td />').addClass('isCorrect ' + (if isCorrect then 'correct' else 'wrong')),
          $('<td />').addClass('left').text(left),
          $('<td />').addClass('times').text('×'),
          $('<td />').addClass('right').text(right),
          $('<td />').addClass('equal').text('='),
          $('<td />').addClass('answer' + (if isCorrect then '' else ' wrong')).text(answer),
          $('<td />').addClass('correct-answer').text(if isCorrect then '' else correctAnswer)
        )
      )
      $doms.answers.children().last().remove() if $doms.answers.children().length > 10
      @updateQuestion()

    updateQuestion: ->
      [numbers[0], numbers[1], numbers[2]] = [null, null, null]
      @updateAnswer()
      $doms.left.text(Math.floor(Math.random() * 20) + 1)
      $doms.right.text(Math.floor(Math.random() * 20) + 1)

  @getSingletonInstance: ->
    sharedInstance ?= new PrivateClass

$ ->
  app = App.getSingletonInstance()

  $(window).keydown (e) ->
    isTenkeys = e.which in [96..105]
    if e.which in [48..57] or isTenkeys
      e.preventDefault()
      number = e.which - (if isTenkeys then 96 else 48)
      app.pushNumber(number)
    else if e.which == 8
      e.preventDefault()
      app.popNumber()
    else if e.which == 13
      e.preventDefault()
      app.submit()

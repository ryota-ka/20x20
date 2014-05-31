$(function(){
  drawBackground();
  init();

  function init() {
    do {
      left = Math.floor(Math.random() * 20) + 1;
      right = Math.floor(Math.random() * 20) + 1;
    } while (!isEnabledCell(left, right));
    $('#left').text(left);
    $('#right').text(right);
    $('#answer').text('?');
    $('.current').removeClass('current');
    $('#cell-' + left + '-' + right).addClass('current');
    $(window).unbind().keydown(function(event){
      if ((isTenKeys = (event.keyCode >= 96) && (event.keyCode <= 105)) || ((event.keyCode >= 48) && (event.keyCode <= 57))) {
        text = $('#answer').text();
        if (text.length < 3) {
          number = event.keyCode - (isTenKeys ? 96 : 48);
          if (text == '?') {
            if (number != 0) {
              $('#answer').text(number);
            }
          } else {
            $('#answer').text(text + number);
          }
        }
      } else if (event.keyCode == 8) {
        text = $('#answer').text();
        if (text.slice(0, -1) == '') {
          $('#answer').text('?');
        } else {
          $('#answer').text(text.slice(0, -1));
        }
        return false;
      } else if (event.keyCode == 13) {
        text = $('#answer').text();
        if (text != '?') {
          isCorrect = (text == (left * right));
          $('#answers').prepend('<li><span class="iscorrect">' + (isCorrect ? '○' : '×') + '</span>&nbsp;' + (left < 10 ? ' ' : '') + left + ' × ' + (right < 10 ? ' ' : '') + right + ' = ' + (left * right) + (isCorrect ? '' : ', your answer was ' + text) + '</li>');
          if ($('#answers li').length > 10) {
            $('#answers li:last-child').remove();
          }
          init();
        }
        return false;
      }
    });
  }

  function drawBackground() {
    for (i=0; i<20; i++) {
      for (j=0; j<20; j++) {
        $('#background').append('<div id="cell' + '-' + (i + 1) + '-' + (j + 1) +'" class="cell"></div>');
        if (j == 0) {
          $('#background .cell:last-child').css('clear', 'left');
        }
        if (!isEnabledCell(i+1, j+1)) {
          $('#background .cell:last-child').addClass('disabled');
        }
      }
    }
  }

  $('.cell').click(function(event){
    str = $(this).attr('id').split('-');
    i_this = str[1];
    j_this = str[2];
    if (event.shiftKey && $('.cell').hasClass('newest') && ($('.newest').hasClass('disabled') ^ $(this).hasClass('disabled'))) {
      str = $(".newest").attr('id').split('-');
      i_newest = str[1];
      j_newest = str[2];

      i_smaller = i_newest <= i_this ? i_newest : i_this;
      i_bigger = i_newest <= i_this ? i_this : i_newest;
      j_smaller = j_newest <= j_this ? j_newest : j_this;
      j_bigger = j_newest <= j_this ? j_this : j_newest;

      for (i=i_smaller; i<=i_bigger; i++) {
        for (j=j_smaller; j<=j_bigger; j++) {
          if ($('.newest').hasClass('disabled')) {
            $('#cell-' + i + '-' + j).addClass('disabled');
          } else {
            $('#cell-' + i + '-' + j).removeClass('disabled');
          }
        }
      }
      $('.cell').removeClass('newest');
      if ($('.disabled').length == 400) {
        $('#cell-1-1').removeClass('disabled');
      }
      var data = '';
      for (i=0; i<20; i++) {
        for (j=0; j<20; j++) {
          data += $('#cell-' + (i+1) + '-' + (j+1)).hasClass('disabled') ? 0 : 1;
        }
      }
      writeCookie(data);
    } else {
      $('.cell').removeClass('newest');
      $(this).toggleClass('disabled').addClass('newest');
      if ($('.disabled').length == 400) {
        $(this).toggleClass('disabled');
      } else {
        writeCell(i_this, j_this, !$(this).hasClass('disabled'));
      }
    }
  });

  function isEnabledCell(i, j) {
    if (readCookie()) {
      return readCell(i, j) == 1 ? true : false;
    } else {
      writeCookie('0000000000111111111100000000001111111111000000000011111111110000000000111111111100000000001111111111000000000011111111110000000000111111111100000000001111111111000000000011111111110000000000111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111');
      return ((i > 10) || (j > 10));
    }
  }

  function readCell(i, j) {
    return readCookie().substr(getFromZero(i, j), 1);
  }

  function writeCell(i, j, isEnabled) {
    data = readCookie();
    before = data.slice(0, getFromZero(i, j));
    after = data.slice(getFromZero(i, j) + 1);
    writeCookie(before + (isEnabled ? 1 : 0) + after);
    return;
  }

  function getFromZero(i, j) {
    return 20 * (i - 1) + (j - 1);
  }

  function readCookie() {
    if (document.cookie) {
      var cookies = document.cookie.split("; ");
      for (var i = 0; i < cookies.length; i++) {
        var str = cookies[i].split("=");
        if (str[0] == 'cells' && str[1].length == 400 && str[1] != '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000') {
          cells = str[1];
          return cells;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  function writeCookie(data) {
    if (data.length == 400) {
      expires = new Date();
      expires.setTime(expires.getTime() + 86400 * 365);
      document.cookie = 'cells=' + data + '; expires=' + expires.toUTCString();
    }
    return;
  }

  $('#closehelp').click(function(){
    $('#help').fadeOut(200);
  });

  function showHelp() {
    $('#help').show();
  }
});

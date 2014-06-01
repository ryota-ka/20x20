$(function(){
  canvas = document.getElementById('background');
  ctx = canvas.getContext('2d');
  cells = new Array(400);
  for (var i = 0; i < 400; i++) {
    cells[i] = true;
  }
  drawBackground();
  init();

  function init() {
    var pair = getPair();
    var left = pair[0];
    var right = pair[1];
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
    ctx.fillStyle = 'rgba(64, 64, 224, 0.7)';
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        ctx.fillRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
      }
    }
  }

  $(canvas).click(function(e) {
    var x = e.pageX - $(canvas).offset().left;
    var y = e.pageY - $(canvas).offset().top;
    var tx = x - Math.floor(x / 120) * 2 - 5
    var ty = y - Math.floor(y / 120) * 2 - 5
    if ((tx % 23) >= 0 && (tx % 23) <= 20 && (ty % 23) >= 0 && (ty % 23) <= 20) {
      tx = Math.floor(tx / 23);
      ty = Math.floor(ty / 23);
      toggleCell(tx, ty);
    }
  });

  $(canvas).mousedown(function(e) {
    var x = e.pageX - $(canvas).offset().left;
    var y = e.pageY - $(canvas).offset().top;
    $(canvas).mouseup(function(e) {
    });
  });
  // DOM で黄色い四角を描こう

  function getPair() {
    var arr = new Array(), pair = new Array(2), num;
    for (var key in cells) {
      if (cells[key]) {
        arr.push(key);
      }
    }
    num = Math.floor(Math.random() * arr.length);
    pair[0] = Math.ceil(arr[num] / 20);
    pair[1] = (arr[num] % 20) + 1;
    return pair;
  }

  function toggleCell(i, j) {
    var index = 20 * i + j;
    console.log('index: ' + index);
    cells[index] = !cells[index];
    ctx.clearRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
    ctx.fillStyle = cells[index] ? 'rgba(64, 64, 224, 0.7)' : 'rgba(64, 64, 64, 0.7)';
    ctx.fillRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
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

  function getFromZero(i, j) {
    return 20 * (i - 1) + (j - 1);
  }

  $('#closehelp').click(function(){
    $('#help').fadeOut(200);
  });

  function showHelp() {
    $('#help').show();
  }
});

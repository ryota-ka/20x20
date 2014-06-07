$(function(){
  canvas = document.getElementById('background');
  ctx = canvas.getContext('2d');
  cells = readCookie('cells') ? readCookie('cells') : '00000000001111111111000000000011111111110000000000111111111100000000001111111111000000000011111111110000000000111111111100000000001111111111000000000011111111110000000000111111111100000000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
  $answers = $('#answers');
  $dragIndicator = $('#dragIndicator');
  $left = $('#left');
  $right = $('#right');
  $answer = $('#answer');

  drawBackground();
  init();

  $(window).keydown(function(e) {
    keydownEvent(e);
    return false;
  });

  function init() {
    var pair = getPair();
    $left.text(pair[0]);
    $right.text(pair[1]);
    $answer.text('?');
  }

  function keydownEvent(e) {
    var text = $answer.text();
    var isTenKeys = (e.which >= 96) && (e.which <= 105);
    if (isTenKeys || ((e.which >= 48) && (e.which <= 57))) {
      if (text.length < 3) {
        number = e.which - (isTenKeys ? 96 : 48);
        if (text === '?') {
          if (number !== 0) {
            $answer.text(number);
          }
        } else {
          $answer.text(text + number);
        }
      }
    } else if (e.which === 8) {
      if (text.slice(0, -1) === '') {
        $answer.text('?');
      } else {
        $answer.text(text.slice(0, -1));
      }
    } else if (e.which === 13) {
      if (text !== '?') {
        var left = $left.text();
        var right = $right.text();
        var correctAnswer = right * left;
        var isCorrect = (parseInt(text) === correctAnswer);

        $answers.prepend('<tr>'
          + '<td class="isCorrect ' + (isCorrect ? 'correct' : 'wrong') + '"></td>'
          + '<td class="left">' + left + '</td>'
          + '<td class="times">×<td>'
          + '<td class="right">' + right + '</td>'
          + '<td class="equal">=</td>'
          + '<td class="answer' + (isCorrect ? '' : ' wrong') + '"><span>' + text + '</span></td>'
          + '<td class="correctAnswer">' + (isCorrect ? '' : correctAnswer) + '</td>'
          + '</tr>');

        if ($('#answers tr').length > 10) {
          $('#answers tr:last-child').remove();
        }
        init();
      }
    }
  }

  function drawBackground() {
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        ctx.fillStyle = parseInt(cells[i * 20 + j]) ? 'rgba(64, 64, 224, 0.7)' : 'rgba(64, 64, 64, 0.7)';
        ctx.fillRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
      }
    }
  }

  $(document).mousedown(function(e) {
    var beforeX = e.pageX - $(canvas).offset().left;
    var beforeY = e.pageY - $(canvas).offset().top;
    $dragIndicator.show().css({left: e.pageX - $(canvas).offset().left, top: e.pageY - $(canvas).offset().top, width: 0, height: 0});
    $(document).mousemove(function(e) {
      var w = e.pageX - $(canvas).offset().left - beforeX;
      var h = e.pageY - $(canvas).offset().top - beforeY;
      if (w < 0) {
        $dragIndicator.css('left', beforeX + w);
      }
      if (h < 0) {
        $dragIndicator.css('top', beforeY + h);
      }
      $dragIndicator.css({width: Math.abs(w), height: Math.abs(h)});
    });
    $(document).mouseup(function(e) {
      var bx = beforeX;
      var by = beforeY;
      var ax = e.pageX - $(canvas).offset().left;
      var ay = e.pageY - $(canvas).offset().top;
      var lx = Math.min(bx, ax);
      var ty = Math.min(by, ay);
      var rx = Math.max(bx, ax);
      var by = Math.max(by, ay);
      var li = Math.max(Math.floor((lx - Math.floor(lx / 120) * 2 - 5) / 23), -1);
      var tj = Math.min(Math.floor((ty - Math.floor(ty / 120) * 2 - 5) / 23), 20);
      var ri = Math.max(Math.floor((rx - Math.floor(rx / 120) * 2 - 5) / 23), -1);
      var bj = Math.min(Math.floor((by - Math.floor(by / 120) * 2 - 5) / 23), 20);
      for (var i = li; i <= ri; i++) {
        for (var j = tj; j <= bj; j++) {
          toggleCell(i, j);
        }
      }
      saveCells();
      $(document).unbind('mousemove').unbind('mouseup');
      $dragIndicator.hide();
    });
  });

  function getPair() {
    var arr = new Array(), pair = new Array(2), num;
    for (var i = 0; i < 400; i++) {
      if (parseInt(cells[i])) {
        arr.push(i);
      }
    }
    num = Math.floor(Math.random() * arr.length);
    pair[0] = Math.floor(arr[num] / 20) + 1;
    pair[1] = (arr[num] % 20) + 1;
    return pair;
  }

  function toggleCell(i, j) {
    if (i >= 0 && i < 20 && j>= 0 && j < 20) {
      var index = 20 * i + j;
      cells = cells.substr(0, index) + (1 - cells[index]) + cells.substr(index + 1);
      ctx.clearRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
      ctx.fillStyle = parseInt(cells[index]) ? 'rgba(64, 64, 224, 0.7)' : 'rgba(64, 64, 64, 0.7)';
      ctx.fillRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
    }
  }

  function saveCells() {
    writeCookie('cells', cells);
  }

  function readCookie(key) {
    return $.cookie(key);
  }

  function writeCookie(key, value) {
    return $.cookie(key, value, {expires: 365});
  }

  $('#closehelp').click(function(){
    $('#help').fadeOut(200);
  });

  function showHelp() {
    $('#help').show();
  }
});

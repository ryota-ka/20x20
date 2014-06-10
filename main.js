$(function(){
  canvas = document.getElementById('background');
  ctx = canvas.getContext('2d');
  cells = readCookie('cells') ? decode(readCookie('cells')) : decode('00vv00vv00vv00vv00vv00vv00vv00vv00vv00vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
  selectedCells = decode('00000000000000000000000000000000000000000000000000000000000000000000000000000000');
  history = [];
  hIndex = 0;
  $answers = $('#answers');
  $dragIndicator = $('#dragIndicator');
  $left = $('#left');
  $right = $('#right');
  $answer = $('#answer');
  $help = $('#help');

  if (!readCookie('cells')) {
    $help.show();
  }

  drawBackground();
  saveHistory();
  init();

  $(window).keydown(function(e) {
    keydownEvent(e);
    return false;
  });

  function init() {
    var pair = getPair();
    var i, j, posX, posY;

    i = parseInt($right.text()) - 1;
    j = parseInt($left.text()) - 1;
    posX = 5 + i * 23 + Math.floor(i / 5) * 2;
    posY = 5 + j * 23 + Math.floor(j / 5) * 2;
    ctx.fillStyle = parseInt(cells[20 * i + j]) ? '#66a9ec' : '#aaa';
    ctx.fillRect(posX, posY, 20, 20);
    if (parseInt(selectedCells[i * 20 + j])) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(posX + 9, posY + 9, 2, 2);
    }

    i = pair[0] - 1;
    j = pair[1] - 1;
    ctx.fillStyle = '#ee9';
    posX = 5 + j * 23 + Math.floor(j / 5) * 2;
    posY = 5 + i * 23 + Math.floor(i / 5) * 2;
    ctx.fillRect(posX, posY, 20, 20);
    if (parseInt(selectedCells[(pair[1] - 1) * 20 + pair[0] - 1])) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(posX + 9, posY + 9, 2, 2);
    }

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
    } else if (e.which === 27) {
      $help.fadeOut(200);
    } else if (e.which === 65) { // A: Select all cells
      selectedCells = decode('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
      drawBackground();
      saveHistory();
    } else if (e.which === 68) { // D: Disable selected cells
      var result = '';
      for (var i = 0; i < 400; i++) {
        result += parseInt(selectedCells[i]) ? 0 : cells[i];
      }
      cells = result;
      drawBackground();
      saveHistory();
    } else if (e.which === 69) { // E: Enable selected cells
      var result = '';
      for (var i = 0; i < 400; i++) {
        result += parseInt(selectedCells[i]) ? 1 : cells[i];
      }
      cells = result;
      drawBackground();
      saveHistory();
    } else if (e.which === 73) { // I: Invert selection
      var result = '';
      for (var i = 0; i < 400; i++) {
        result += 1 - selectedCells[i];
      }
      selectedCells = result;
      drawBackground();
      saveHistory();
    } else if (e.which === 78) { // N: Select no cells
      selectedCells = decode('00000000000000000000000000000000000000000000000000000000000000000000000000000000');
      drawBackground();
      saveHistory();
    } else if (e.which === 84) { // T: Toggle selected cells
      var result = '';
      for (var i = 0; i < 400; i++) {
        result += parseInt(selectedCells[i]) ? 1 - cells[i] : cells[i];
      }
      cells = result;
      drawBackground();
      saveHistory();
    } else if (e.which === 89) { // Y: Redo
      if (hIndex < history.length - 1) {
        hIndex++;
        cells = decode(history[hIndex].substr(0, 80));
        selectedCells = decode(history[hIndex].substr(80, 80));
        drawBackground();
      }
    } else if (e.which === 90) { // Z: Undo
      if (hIndex > 0) {
        hIndex--;
        cells = decode(history[hIndex].substr(0, 80));
        selectedCells = decode(history[hIndex].substr(80, 80));
        drawBackground();
      }
    }
  }

  function drawBackground() {
    ctx.clearRect(0, 0, 500, 500);
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        var index = i * 20 + j;
        if (index === getIndex(parseInt($right.text()), parseInt($left.text()))) {
          ctx.fillStyle = '#ee9';
        } else {
          ctx.fillStyle = parseInt(cells[index]) ? '#66a9ec' : '#aaa';
        }
        var posX = 5 + i * 23 + Math.floor(i / 5) * 2;
        var posY = 5 + j * 23 + Math.floor(j / 5) * 2;
        ctx.fillRect(posX, posY, 20, 20);
        if (parseInt(selectedCells[index])) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(posX + 9, posY + 9, 2, 2);
        }
      }
    }
    saveCells();
  }

  $(document).mousedown(function(e) {
    if ($help.is(':hidden')) {
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
        selectedCells = decode('00000000000000000000000000000000000000000000000000000000000000000000000000000000');
        for (var i = li; i <= ri; i++) {
          for (var j = tj; j <= bj; j++) {
            toggleSelected(i, j);
          }
        }
        drawBackground();
        saveHistory();
        $(document).unbind('mousemove').unbind('mouseup');
        $dragIndicator.hide();
      });
    }
  });

  function getPair() {
    var arr = new Array(), pair = new Array(2), num;
    for (var i = 0; i < 400; i++) {
      if (parseInt(cells[i]) && (i !== getIndex(parseInt($right.text()), parseInt($left.text())))) {
        arr.push(i);
      }
    }
    if (arr.length) {
      num = Math.floor(Math.random() * arr.length);
      pair[1] = Math.floor(arr[num] / 20) + 1;
      pair[0] = (arr[num] % 20) + 1;
    } else {
      pair[0] = parseInt($left.text());
      pair[1] = parseInt($right.text());
    }
    return pair;
  }

  function toggleCell(i, j) {
    if (i >= 0 && i < 20 && j>= 0 && j < 20) {
      var index = 20 * i + j;
      cells = cells.substr(0, index) + (1 - cells[index]) + cells.substr(index + 1);
      ctx.clearRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
      ctx.fillStyle = parseInt(cells[index]) ? 'rgba(64, 64, 224, 0.5)' : 'rgba(64, 64, 64, 0.5)';
      ctx.fillRect(5 + i * 23 + Math.floor(i / 5) * 2, 5 + j * 23 + Math.floor(j / 5) * 2, 20, 20);
    }
  }

  function toggleSelected(i, j) {
    if (i >= 0 && i < 20 && j>= 0 && j < 20) {
      var index = 20 * i + j;
      selectedCells = selectedCells.substr(0, index) + (1 - selectedCells[index]) + selectedCells.substr(index + 1);
    }
  }

  function saveCells() {
    writeCookie('cells', encode(cells));
  }

  function saveHistory() {
    if (hIndex === history.length - 1) {
      if (history.length > 63) {
        history.shift();
      }
    } else {
      history = history.slice(0, hIndex + 1);
    }
    history.push(encode(cells) + encode(selectedCells));
    hIndex = history.length - 1;
  }

  function readCookie(key) {
    return $.cookie(key);
  }

  function writeCookie(key, value) {
    return $.cookie(key, value, {expires: 365});
  }

  $('#closehelp').click(function() {
    $help.fadeOut(200);
  });

  $('#showHelp').mouseover(function() {
    $help.show();
  });

  function getIndex(left, right) {
    return (parseInt(left) - 1) * 20 + parseInt(right) - 1;
  }

  function encode(str) {
    var result = '', letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v'];
    for (var i = 0; i < 80; i++) {
      result += letters[parseInt(str[5 * i] + str[5 * i + 1] + str[5 * i + 2] + str[5 * i + 3] + str[5 * i + 4], 2)];
    }
    return result;
  }

  function decode(str) {
    var result = '', letters = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15, 'g': 16, 'h': 17, 'i': 18, 'j': 19, 'k': 20, 'l': 21, 'm': 22, 'n': 23, 'o': 24, 'p': 25, 'q': 26, 'r': 27, 's': 28, 't': 29, 'u': 30, 'v': 31};
    for (var i = 0; i < 80; i++) {
      result += ('00000' + letters[str[i]].toString(2)).slice(-5);
    }
    return result;
  }
});

/* Reservation form for the Hotorigi design sample.
   This form is a shape only: nothing is sent or stored. The submit event is always cancelled. */
(function () {
  'use strict';

  var form = document.getElementById('reserve-form');
  if (!form) { return; }

  var $ = function (id) { return document.getElementById(id); };
  var submit = $('reserve-submit');
  var status = $('form-status');
  var layout = document.querySelector('[data-rsv]');
  var head = document.querySelector('.rsv-head');
  var done = $('reserve-done');
  var doneList = document.querySelector('[data-done-list]');

  // Room facts come from the inn's content sheet only.
  var ROOMS = {
    sawa: { name: '離れ「沢」', min: 2, max: 4, prices: { 2: 52800 } },
    mori: { name: '本館「杜」', min: 1, max: 2, prices: { 2: 38500, 1: 49500 } }
  };
  var WEEK = ['日', '月', '火', '水', '木', '金', '土'];

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var todayISO = function () { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var parseISO = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  var yen = function (n) { return n.toLocaleString('ja-JP'); };
  var dateLabel = function (d) { return (d.getMonth() + 1) + '月' + d.getDate() + '日（' + WEEK[d.getDay()] + '）'; };

  var checkin = $('checkin');
  checkin.min = todayISO();

  // ?room=sawa / ?room=mori preselects a room (not personal data)
  var params = new URLSearchParams(location.search);
  var preset = params.get('room');
  if (preset && ROOMS[preset]) { $('room-' + preset).checked = true; }

  var selectedRoom = function () { var r = form.querySelector('input[name="room"]:checked'); return r ? r.value : ''; };
  var selectedPickup = function () { var r = form.querySelector('input[name="pickup"]:checked'); return r ? r.value : 'none'; };

  // ---------------------------------------------------------------- live summary
  var sum = function (key) { return document.querySelector('[data-sum="' + key + '"]'); };

  function nightsText() { return $('nights').value + '泊'; }

  function updateSummary() {
    var room = selectedRoom();
    var guests = +$('guests').value;
    var nights = +$('nights').value;

    if (checkin.value) {
      var inDate = parseISO(checkin.value);
      var outDate = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate() + nights);
      sum('dates').textContent = dateLabel(inDate) + ' 〜 ' + dateLabel(outDate) + '、' + nightsText();
    } else {
      sum('dates').textContent = '未選択';
    }
    sum('room').textContent = room ? ROOMS[room].name : '未選択';
    sum('guests').textContent = guests + '名';

    var price = sum('price');
    price.textContent = '';
    if (!room) {
      price.textContent = '客室を選ぶと表示します';
    } else if (guests < ROOMS[room].min || guests > ROOMS[room].max) {
      price.textContent = ROOMS[room].name + 'は' + ROOMS[room].min + '〜' + ROOMS[room].max + '名です';
    } else if (ROOMS[room].prices[guests]) {
      var total = ROOMS[room].prices[guests] * guests * nights;
      var num = document.createElement('span');
      num.className = 'mono';
      num.textContent = yen(total);
      price.appendChild(num);
      price.appendChild(document.createTextNode(' 円〜（' + guests + '名・' + nightsText() + '）'));
    } else {
      price.textContent = guests + '名でのご利用は、ご予約のあとに料金をご案内します';
    }
  }

  // ---------------------------------------------------------------- validation
  function showError(el, errorEl, message) {
    errorEl.textContent = message;
    errorEl.hidden = !message;
    if (el) {
      if (message) { el.setAttribute('aria-invalid', 'true'); } else { el.removeAttribute('aria-invalid'); }
    }
    return !message;
  }

  var checks = {
    checkin: function () {
      var msg = '';
      if (!checkin.value) { msg = 'チェックイン日を選んでください。'; }
      else if (checkin.value < todayISO()) { msg = '今日以降の日付を選んでください。'; }
      var hint = $('checkin-hint');
      var month = checkin.value ? parseISO(checkin.value).getMonth() + 1 : 0;
      hint.textContent = (month === 12 || month <= 3) && month
        ? '12月〜3月は、スタッドレスタイヤか四輪駆動の車でお越しください。'
        : 'チェックインは15:00〜18:00、チェックアウトは11:00です。';
      return showError(checkin, $('checkin-error'), msg);
    },
    room: function () {
      var pick = form.querySelector('.room-pick');
      return showError(pick, $('room-error'), selectedRoom() ? '' : '客室を選んでください。');
    },
    guests: function () {
      var room = selectedRoom();
      var g = +$('guests').value;
      var msg = '';
      if (room && (g < ROOMS[room].min || g > ROOMS[room].max)) {
        msg = ROOMS[room].name + 'は' + ROOMS[room].min + '〜' + ROOMS[room].max + '名でご利用いただけます。人数か客室を選び直してください。';
      }
      return showError($('guests'), $('guests-error'), msg);
    },
    'guest-name': function () {
      var v = $('guest-name').value.trim();
      return showError($('guest-name'), $('guest-name-error'), v ? '' : 'お名前を入力してください。');
    },
    'guest-kana': function () {
      var v = $('guest-kana').value.trim();
      var msg = '';
      if (!v) { msg = 'フリガナを入力してください。'; }
      else if (!/^[ァ-ヶ・ー\s　]+$/.test(v)) { msg = 'フリガナはカタカナで入力してください。'; }
      return showError($('guest-kana'), $('guest-kana-error'), msg);
    },
    'guest-email': function () {
      var v = $('guest-email').value.trim();
      var msg = '';
      if (!v) { msg = 'メールアドレスを入力してください。'; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg = 'メールアドレスの形を確認してください（例：stay@example.com）。'; }
      return showError($('guest-email'), $('guest-email-error'), msg);
    },
    'guest-tel': function () {
      var v = $('guest-tel').value.replace(/[\s\-‐－ー]/g, '');
      var msg = '';
      if (!v) { msg = '電話番号を入力してください。'; }
      else if (!/^\d{10,11}$/.test(v)) { msg = '電話番号は数字10〜11桁で入力してください。ハイフンはあってもなくても構いません。'; }
      return showError($('guest-tel'), $('guest-tel-error'), msg);
    },
    pickup: function () {
      var msg = '';
      if (selectedPickup() !== 'none' && checkin.value && checkin.value <= todayISO()) {
        msg = '送迎は前日までのご予約が必要です。別の日を選ぶか、「利用しない」を選んでください。';
      }
      return showError(null, $('pickup-error'), msg);
    },
    agree: function () {
      return showError($('agree'), $('agree-error'), $('agree').checked ? '' : 'キャンセル料の決まりへの同意が必要です。');
    }
  };

  var FOCUS = { checkin: 'checkin', room: 'room-sawa', guests: 'guests', pickup: 'pickup-none', agree: 'agree' };
  var touched = {};

  function runCheck(key) { return checks[key](); }

  // re-check a field once the person has left it, and keep checking it while they fix it
  function watch(key, el, events) {
    events.forEach(function (type) {
      el.addEventListener(type, function () {
        if (type === 'blur' || type === 'change') { touched[key] = true; }
        if (touched[key]) { runCheck(key); }
        updateSummary();
      });
    });
  }

  watch('checkin', checkin, ['change', 'blur']);
  watch('guests', $('guests'), ['change']);
  ['guest-name', 'guest-kana', 'guest-email', 'guest-tel'].forEach(function (id) { watch(id, $(id), ['blur', 'input']); });
  watch('agree', $('agree'), ['change']);
  $('nights').addEventListener('change', updateSummary);
  form.querySelectorAll('input[name="room"]').forEach(function (r) {
    r.addEventListener('change', function () { touched.room = true; runCheck('room'); if (touched.guests || $('guests-error').textContent) { runCheck('guests'); } updateSummary(); });
  });
  form.querySelectorAll('input[name="pickup"]').forEach(function (r) {
    r.addEventListener('change', function () { runCheck('pickup'); });
  });

  var area = $('guest-request');
  var count = document.querySelector('[data-count]');
  area.addEventListener('input', function () { count.textContent = area.value.length; });

  // ---------------------------------------------------------------- submit (never sends)
  submit.disabled = false;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var order = ['checkin', 'room', 'guests', 'guest-name', 'guest-kana', 'guest-email', 'guest-tel', 'pickup', 'agree'];
    var failed = order.filter(function (key) { touched[key] = true; return !runCheck(key); });

    if (failed.length) {
      status.textContent = '入力を確認してください。' + failed.length + 'か所に直すところがあります。';
      status.hidden = false;
      var first = $(FOCUS[failed[0]] || failed[0]);
      if (first) { first.focus(); }
      return;
    }
    status.hidden = true;
    showDone();
  });

  function showDone() {
    var room = selectedRoom();
    var inDate = parseISO(checkin.value);
    var nights = +$('nights').value;
    var outDate = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate() + nights);
    var pickup = selectedPickup();
    var rows = [
      ['日程', dateLabel(inDate) + ' 〜 ' + dateLabel(outDate) + '、' + nights + '泊'],
      ['客室', ROOMS[room].name],
      ['人数', $('guests').value + '名'],
      ['お名前', $('guest-name').value.trim() + '（' + $('guest-kana').value.trim() + '）'],
      ['ご連絡先', $('guest-email').value.trim() + '\n' + $('guest-tel').value.trim()],
      ['チェックイン', $('arrival').value + 'ごろ'],
      ['送迎', pickup === 'none' ? '利用しない' : pickup + '発の便'],
      ['ご要望', area.value.trim() || 'なし']
    ];
    doneList.textContent = '';
    rows.forEach(function (row) {
      var wrap = document.createElement('div');
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');
      dt.textContent = row[0];
      dd.textContent = row[1];
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      doneList.appendChild(wrap);
    });
    layout.hidden = true;
    head.hidden = true;
    done.hidden = false;
    window.scrollTo(0, 0);
    done.focus();
  }

  document.querySelector('[data-edit]').addEventListener('click', function () {
    done.hidden = true;
    head.hidden = false;
    layout.hidden = false;
    window.scrollTo(0, 0);
    checkin.focus();
  });

  updateSummary();
})();

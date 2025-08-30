
(function () {
    const input = document.getElementById('timeInput');
    const display = document.getElementById('display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
  
    let totalSeconds = 0;
    let remaining = 0;
    let timerId = null;
    let running = false;
  
    function parseTime(mmss) {
      const m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(mmss);
      if (!m) return null;
      const minutes = parseInt(m[1], 10);
      const seconds = parseInt(m[2], 10);
      if (seconds > 59) return null;
      return minutes * 60 + seconds;
    }
  
    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
  
    function setDisplay(sec) {
      display.textContent = formatTime(sec);
      display.style.color = sec <= 9 ? '#e74c3c' : '#333333';
    }
  
    function setState(state) {
      // 'idle' | 'running' | 'paused'
      if (state === 'idle') {
        input.disabled = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
      } else if (state === 'running') {
        input.disabled = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
      } else if (state === 'paused') {
        input.disabled = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
      }
    }
  
    function start() {
      if (running) return;
      const val = parseTime(input.value || '00:00');
      if (val == null) {
        alert('Please enter time as MM:SS (e.g., 05:00)');
        return;
      }
      if (val <= 0) return;
  
      if (remaining === 0 || remaining > val) {
        totalSeconds = val;
        remaining = val;
      }
      setState('running');
      running = true;
  
      const startAt = Date.now();
      let expected = startAt + 1000;
  
      timerId = setInterval(() => {
        const now = Date.now();
        const drift = now - expected;
        if (drift > 1000) {
          // big drift; correct by skipping (no-op here)
        }
        if (remaining > 0) {
          remaining -= 1;
          setDisplay(remaining);
        }
        if (remaining <= 0) {
          clearInterval(timerId);
          running = false;
          setState('idle');
          remaining = 0;
          setDisplay(0);
        }
        expected += 1000;
      }, 1000);
  
      setDisplay(remaining);
    }
  
    function pause() {
      if (!running) return;
      clearInterval(timerId);
      running = false;
      setState('paused');
    }
  
    function reset() {
      clearInterval(timerId);
      running = false;
      remaining = 0;
      setState('idle');
      setDisplay(0);
    }
  
    // Event listeners
    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', pause);
    resetBtn.addEventListener('click', reset);
  
    input.addEventListener('input', () => {
      // Auto insert colon for MM:SS
      let v = input.value.replace(/[^0-9]/g, '');
      if (v.length > 4) v = v.slice(0, 4);
      if (v.length >= 3) v = v.slice(0, v.length - 2) + ':' + v.slice(-2);
      input.value = v;
    });
  
    // init
    setDisplay(0);
    setState('idle');
  })();

  
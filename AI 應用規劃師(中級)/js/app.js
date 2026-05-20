/**
 * iPAS AI 應用規劃師（中級）能力鑑定輔考平台 - 核心業務邏輯與引擎
 * 採用 100% 繁體中文，無後端純前端 SPA 方案，使用 localStorage 進行持久化。
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 全域狀態與初始化 ---
  const state = {
    wrongQuestions: JSON.parse(localStorage.getItem('ipas_wrong_questions')) || [],
    readTopics: JSON.parse(localStorage.getItem('ipas_read_topics')) || [],
    examHistory: JSON.parse(localStorage.getItem('ipas_exam_history')) || [],
    currentExam: null,
    flashcards: [],
    currentFlashcardIndex: 0,
    activeTheme: localStorage.getItem('ipas_theme') || 'dark'
  };

  // 初始化主題
  if (state.activeTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      themeBtn.title = '切換主題 (目前為亮色模式)';
    }
  }

  // --- 2. SPA 路由器 (Routing) ---
  const pages = {
    'dashboard': { el: document.getElementById('page-dashboard'), title: '學習控制台', subtitle: '掌握最新考情，全面迎戰中級能力鑑定' },
    'exam': { el: document.getElementById('page-exam'), title: '模擬測驗區', subtitle: '全真限時模擬考與碎片化隨機測驗' },
    'mistakes': { el: document.getElementById('page-mistakes'), title: '個人錯題本', subtitle: '溫故知新，攻克所有弱點，答對自動移除' },
    'flashcards': { el: document.getElementById('page-flashcards'), title: '高頻記憶卡', subtitle: '3D 卡片雙面速記，深度背誦核心考點' },
    'knowledge': { el: document.getElementById('page-knowledge'), title: '核心知識庫', subtitle: '融合 L21 學習指南與 2025-2026 前沿技術考點' }
  };

  function router() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const page = pages[hash];

    if (!page) return;

    // 更新導覽列 Active 狀態
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeNav = document.getElementById(`nav-${hash}`);
    if (activeNav) activeNav.classList.add('active');

    // 切換頁面顯示
    document.querySelectorAll('.app-page').forEach(el => {
      el.classList.remove('active');
    });
    
    // 微延遲以利 transition 動畫觸發
    setTimeout(() => {
      page.el.classList.add('active');
    }, 50);

    // 更新 Header 文字
    document.getElementById('page-title').innerText = page.title;
    document.getElementById('page-subtitle').innerText = page.subtitle;

    // 觸發各分頁特有初始化
    initPage(hash);
  }

  window.addEventListener('hashchange', router);
  
  // 首次載入執行路由
  router();

  // --- 3. 頁面初始化派發器 ---
  function initPage(pageId) {
    updateGlobalBadges();

    switch (pageId) {
      case 'dashboard':
        initDashboard();
        break;
      case 'exam':
        initExamSetup();
        break;
      case 'mistakes':
        initMistakesPage();
        break;
      case 'flashcards':
        initFlashcards();
        break;
      case 'knowledge':
        initKnowledgeBase();
        break;
    }
  }

  // 更新導覽列與全局的錯題徽章
  function updateGlobalBadges() {
    const mistakeCountBadge = document.getElementById('mistake-count');
    if (mistakeCountBadge) {
      mistakeCountBadge.innerText = state.wrongQuestions.length;
      mistakeCountBadge.style.display = state.wrongQuestions.length > 0 ? 'inline-block' : 'none';
    }
  }

  // --- 4. 控制台 (Dashboard) 邏輯 ---
  function initDashboard() {
    // 1. 知識庫學習進度計算
    const totalTopics = LEARNING_DATABASE.reduce((sum, cat) => sum + cat.topics.length, 0);
    const readCount = state.readTopics.length;
    const learnPercent = totalTopics > 0 ? Math.round((readCount / totalTopics) * 100) : 0;
    
    document.getElementById('stats-learn-percent').innerText = learnPercent;
    document.getElementById('learn-progress-bar').style.width = `${learnPercent}%`;

    // 2. 模擬考平均答對率
    const validExams = state.examHistory.filter(h => h.total > 0);
    let avgAccuracy = 0;
    if (validExams.length > 0) {
      const totalAccuracy = validExams.reduce((sum, h) => sum + (h.correct / h.total), 0);
      avgAccuracy = Math.round((totalAccuracy / validExams.length) * 100);
    }
    
    document.getElementById('stats-avg-accuracy').innerText = avgAccuracy;
    document.getElementById('accuracy-progress-bar').style.width = `${avgAccuracy}%`;

    // 3. 累積待複習錯題
    document.getElementById('stats-mistake-count').innerText = state.wrongQuestions.length;

    // 4. L21 九大單元雷達圖數據計算與渲染
    const unitProgress = [];
    const labels = [];
    const dataPct = [];

    LEARNING_DATABASE.forEach(cat => {
      const catTotal = cat.topics.length;
      const catRead = cat.topics.filter(t => state.readTopics.includes(t.id)).length;
      const pct = catTotal > 0 ? Math.round((catRead / catTotal) * 100) : 0;
      
      // 去除 L21XXXX 前綴以便在列表美觀顯示
      const unitNameClean = cat.title.replace(/L21\d{3,5}\s*/, '');
      unitProgress.push({
        id: cat.id,
        name: unitNameClean,
        pct: pct
      });

      // 提取前6個字作為雷達圖標籤，防止文字過長被 Canvas 裁切
      const shortLabel = unitNameClean.substring(0, 6);
      labels.push(shortLabel);
      dataPct.push(pct);
    });

    // 渲染右側列表
    const radarUnitList = document.getElementById('radar-unit-list');
    if (radarUnitList) {
      radarUnitList.innerHTML = '';
      unitProgress.forEach(unit => {
        const item = document.createElement('div');
        item.className = `unit-progress-item ${unit.pct === 0 ? 'not-started' : ''}`;
        item.innerHTML = `
          <span class="unit-name" title="${unit.name}">${unit.name}</span>
          <span class="unit-pct">${unit.pct}%</span>
        `;
        radarUnitList.appendChild(item);
      });
    }

    // 繪製與更新雷達圖 (使用 Chart.js)
    const ctx = document.getElementById('learningRadarChart');
    if (ctx && typeof Chart !== 'undefined') {
      // 銷毀先前創建的實例，防止切換分頁時圖表殘留與閃爍 bug
      if (window.ipasRadarChart) {
        window.ipasRadarChart.destroy();
      }

      const isLight = document.body.classList.contains('light-theme');
      
      // 暗色/亮色主題動態配色方案
      const textColor = isLight ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)';
      const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
      const radarColor = isLight ? 'rgba(16, 185, 129, 0.18)' : 'rgba(20, 233, 178, 0.18)';
      const radarBorderColor = isLight ? 'rgba(16, 185, 129, 1)' : 'rgba(20, 233, 178, 1)';

      window.ipasRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: '研讀進度 (%)',
            data: dataPct,
            backgroundColor: radarColor,
            borderColor: radarBorderColor,
            borderWidth: 2.5,
            pointBackgroundColor: radarBorderColor,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: radarBorderColor,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // 隱藏上方 label 區，以獲取最大繪圖視區
            },
            tooltip: {
              padding: 10,
              titleFont: {
                family: "'Outfit', 'Noto Sans TC', sans-serif",
                size: 13,
                weight: 'bold'
              },
              bodyFont: {
                family: "'Outfit', 'Noto Sans TC', sans-serif",
                size: 12
              },
              callbacks: {
                label: function(context) {
                  return ` 研讀比例: ${context.raw}%`;
                }
              }
            }
          },
          scales: {
            r: {
              angleLines: {
                color: gridColor
              },
              grid: {
                color: gridColor
              },
              pointLabels: {
                color: textColor,
                font: {
                  family: "'Outfit', 'Noto Sans TC', sans-serif",
                  size: 11,
                  weight: '600'
                }
              },
              ticks: {
                display: false, // 隱藏刻度數字，保持圖形簡約質感
                stepSize: 20
              },
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });
    }
  }

  // --- 5. 模擬測驗區 (Exam Engine) ---
  const examSetupDiv = document.getElementById('exam-setup');
  const examActiveDiv = document.getElementById('exam-active');
  const examResultDiv = document.getElementById('exam-result');

  // 初始化設置畫面事件
  function initExamSetup() {
    examSetupDiv.style.display = 'block';
    examActiveDiv.style.display = 'none';
    examResultDiv.style.display = 'none';

    // 重置考試狀態
    if (state.currentExam && state.currentExam.timer) {
      clearInterval(state.currentExam.timer);
    }
    state.currentExam = null;

    // 綁定單選卡片點擊事件
    const radioCards = document.querySelectorAll('.radio-card');
    radioCards.forEach(card => {
      card.addEventListener('click', function() {
        radioCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // 綁定模式選擇卡片點擊事件
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
      card.addEventListener('click', function() {
        modeCards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // 綁定快速題數選擇按鈕
    const countBtns = document.querySelectorAll('.q-count-btn');
    countBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation(); // 防止觸發 mode-card 的點擊
        countBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // 同時確保其父容器 mode-card 被激活
        this.closest('.mode-card').classList.add('active');
      });
    });
  }

  // 開始測驗
  document.getElementById('start-exam-btn').addEventListener('click', () => {
    // 1. 取得選定的科目
    const selectedSubjectRadio = document.querySelector('input[name="exam-subject"]:checked');
    if (!selectedSubjectRadio) return;
    const subjectId = selectedSubjectRadio.value;

    // 2. 取得選定模式
    const activeModeCard = document.querySelector('.mode-card.active');
    const mode = activeModeCard.getAttribute('data-mode');

    // 3. 取得題數
    let numQuestions = 50;
    if (mode === 'quick') {
      const activeCountBtn = document.querySelector('.q-count-btn.active');
      numQuestions = activeCountBtn ? parseInt(activeCountBtn.getAttribute('data-count')) : 10;
    }

    // 4. 抽取題目
    let rawQuestions = [];
    if (subjectId === 'subject1') {
      // 科目一合併歷屆試題與模擬題庫，為考生提供最大刷題庫
      rawQuestions = [...QUESTIONS_DATABASE.subject1, ...QUESTIONS_DATABASE.mock_questions];
    } else if (subjectId === 'subject2') {
      rawQuestions = [...QUESTIONS_DATABASE.subject2];
    } else if (subjectId === 'subject3') {
      rawQuestions = [...QUESTIONS_DATABASE.subject3];
    }

    if (rawQuestions.length === 0) {
      alert('抱歉，此科目題庫暫無題目。');
      return;
    }

    // 隨機洗牌演算法
    const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

    // 5. 初始化考試狀態
    state.currentExam = {
      subjectId: subjectId,
      subjectName: selectedSubjectRadio.closest('.radio-card').querySelector('h4').innerText,
      subjectBadge: selectedSubjectRadio.closest('.radio-card').querySelector('.badge').innerText,
      questions: selectedQuestions,
      userAnswers: new Array(selectedQuestions.length).fill(null),
      flagged: new Set(),
      currentIndex: 0,
      mode: mode,
      timeLeft: mode === 'full' ? 80 * 60 : 0, // 全真模擬考 80 分鐘
      timeSpent: 0,
      isSubmitted: false,
      timer: null
    };

    // 6. UI 切換
    examSetupDiv.style.display = 'none';
    examActiveDiv.style.display = 'block';
    
    document.getElementById('active-subject-badge').innerText = state.currentExam.subjectBadge;
    // 依選考還是必考改變徽章樣式
    if (state.currentExam.subjectBadge.includes('選考')) {
      document.getElementById('active-subject-badge').className = 'badge badge-choice';
    } else {
      document.getElementById('active-subject-badge').className = 'badge badge-required';
    }
    document.getElementById('active-subject-title').innerText = state.currentExam.subjectName;

    // 7. 渲染答題板與第一題
    renderPalette();
    renderQuestion(0);

    // 8. 啟動計時器
    startExamTimer();
  });

  // 計時器邏輯
  function startExamTimer() {
    const timerDisplay = document.getElementById('exam-timer');
    const timerWrapper = timerDisplay.parentElement;

    if (state.currentExam.mode === 'full') {
      timerWrapper.style.backgroundColor = 'hsla(350, 89%, 60%, 0.1)';
      timerWrapper.style.color = 'var(--danger)';
      timerDisplay.innerText = formatTime(state.currentExam.timeLeft);
    } else {
      // 快速練習為正計時
      timerWrapper.style.backgroundColor = 'hsla(162, 97%, 38%, 0.1)';
      timerWrapper.style.color = 'var(--success)';
      timerDisplay.innerText = '00:00';
    }

    state.currentExam.timer = setInterval(() => {
      state.currentExam.timeSpent++;

      if (state.currentExam.mode === 'full') {
        state.currentExam.timeLeft--;
        timerDisplay.innerText = formatTime(state.currentExam.timeLeft);

        if (state.currentExam.timeLeft <= 0) {
          clearInterval(state.currentExam.timer);
          alert('考試時間到！系統將自動為您交卷。');
          submitExam();
        }
      } else {
        timerDisplay.innerText = formatTime(state.currentExam.timeSpent);
      }
    }, 1000);
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // 渲染答題板 Palette
  function renderPalette() {
    const paletteGrid = document.getElementById('question-palette');
    paletteGrid.innerHTML = '';

    state.currentExam.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.innerText = idx + 1;
      btn.id = `palette-btn-${idx}`;

      // 點擊調色盤跳題
      btn.addEventListener('click', () => {
        saveAnswerState();
        renderQuestion(idx);
      });

      paletteGrid.appendChild(btn);
    });

    updatePaletteStatus();
  }

  // 更新答題板上的視覺狀態
  function updatePaletteStatus() {
    const exam = state.currentExam;
    exam.questions.forEach((q, idx) => {
      const btn = document.getElementById(`palette-btn-${idx}`);
      if (!btn) return;

      btn.className = 'palette-btn';

      if (idx === exam.currentIndex) {
        btn.classList.add('active');
      }

      if (exam.isSubmitted) {
        // 已交卷，以紅綠標示對錯
        const isCorrect = exam.userAnswers[idx] === q.answer;
        btn.classList.add(isCorrect ? 'p-correct' : 'p-wrong');
      } else {
        // 未交卷，標示已答題與標記
        if (exam.userAnswers[idx] !== null) {
          btn.classList.add('answered');
        }
        if (exam.flagged.has(idx)) {
          btn.classList.add('flagged');
        }
      }
    });

    // 更新已答題比例
    const answeredCount = exam.userAnswers.filter(a => a !== null).length;
    document.getElementById('answered-ratio').innerText = `已答 ${answeredCount}/${exam.questions.length} 題`;
  }

  // 渲染單一題目
  function renderQuestion(index) {
    const exam = state.currentExam;
    exam.currentIndex = index;

    const q = exam.questions[index];

    // 更新題號與難度
    document.getElementById('current-q-index').innerText = `第 ${index + 1} / ${exam.questions.length} 題`;
    document.getElementById('current-q-diff').innerText = `難度：${'★'.repeat(q.difficulty)}${'☆'.repeat(5 - q.difficulty)}`;

    // 更新標記按鈕狀態
    const flagBtn = document.getElementById('flag-question-btn');
    if (exam.flagged.has(index)) {
      flagBtn.classList.add('flagged');
      flagBtn.innerHTML = '<i class="fa-solid fa-flag text-danger"></i> <b>已標記</b>';
    } else {
      flagBtn.classList.remove('flagged');
      flagBtn.innerHTML = '<i class="fa-regular fa-flag"></i> 標記此題';
    }

    // 題目文本（若有程式碼或公式，會進行包覆）
    const qTextEl = document.getElementById('active-question-text');
    qTextEl.innerText = q.question;

    // 選項容器
    const optionsContainer = document.getElementById('active-options-container');
    optionsContainer.innerHTML = '';

    // A, B, C, D 選項渲染
    Object.entries(q.options).forEach(([letter, text]) => {
      if (!text) return; // 略過空選項

      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${letter}</span> <span class="option-text">${text}</span>`;
      
      // 已答過的選項高亮
      if (exam.userAnswers[index] === letter) {
        btn.classList.add('selected');
      }

      // 如果已交卷，高亮正解與錯誤
      if (exam.isSubmitted) {
        btn.disabled = true;
        if (letter === q.answer) {
          btn.classList.add('opt-correct');
        } else if (exam.userAnswers[index] === letter) {
          btn.classList.add('opt-wrong');
        }
      } else {
        // 未交卷，點擊選擇答案
        btn.addEventListener('click', () => {
          document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          exam.userAnswers[index] = letter;
          updatePaletteStatus();
          
          // 快速練習模式下，如果開啟了「即時解析」，點選後可立即看解析
          if (exam.mode === 'quick' && document.getElementById('instant-check-btn').style.display !== 'none') {
            showInstantExplanation();
          }
        });
      }

      optionsContainer.appendChild(btn);
    });

    // 解析盒渲染控制
    const explBox = document.getElementById('active-explanation-box');
    if (exam.isSubmitted) {
      explBox.style.display = 'block';
      document.getElementById('correct-ans-label').innerText = q.answer;
      
      const explTextEl = document.getElementById('active-explanation-text');
      explTextEl.innerText = q.explanation || '本題考點明確，請參照最新中級核心指南。';
      
      // 設定解析盒頂部的紅綠對錯提示
      const isCorrect = exam.userAnswers[index] === q.answer;
      const statusIndicator = explBox.querySelector('.status-indicator');
      if (isCorrect) {
        statusIndicator.innerHTML = '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> 回答正確</span>';
      } else {
        statusIndicator.innerHTML = '<span class="badge badge-danger"><i class="fa-solid fa-circle-xmark"></i> 回答錯誤</span>';
      }
    } else {
      explBox.style.display = 'none';
    }

    // 導覽按鈕狀態控制
    document.getElementById('prev-q-btn').disabled = index === 0;
    
    const nextBtn = document.getElementById('next-q-btn');
    if (index === exam.questions.length - 1) {
      nextBtn.innerHTML = '交卷 <i class="fa-solid fa-file-import"></i>';
      nextBtn.className = 'btn btn-danger';
    } else {
      nextBtn.innerHTML = '下一題 <i class="fa-solid fa-chevron-right"></i>';
      nextBtn.className = 'btn btn-primary';
    }

    // 快速練習模式下提供「即時看解析」按鈕
    const instantCheckBtn = document.getElementById('instant-check-btn');
    if (exam.mode === 'quick' && !exam.isSubmitted) {
      instantCheckBtn.style.display = 'inline-flex';
    } else {
      instantCheckBtn.style.display = 'none';
    }

    updatePaletteStatus();
    
    // 重新排版可能包含的數學公式
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([qTextEl, optionsContainer, explBox]).catch(err => console.log(err));
    }
  }

  // 即時看解析
  document.getElementById('instant-check-btn').addEventListener('click', () => {
    showInstantExplanation();
  });

  function showInstantExplanation() {
    const exam = state.currentExam;
    const index = exam.currentIndex;
    const q = exam.questions[index];

    // 如果考生還沒選答案，提示一下
    if (exam.userAnswers[index] === null) {
      alert('請先選擇一個選項再查看解析。');
      return;
    }

    // 模擬已交卷狀態來渲染解析
    const explBox = document.getElementById('active-explanation-box');
    explBox.style.display = 'block';
    document.getElementById('correct-ans-label').innerText = q.answer;
    
    const explTextEl = document.getElementById('active-explanation-text');
    explTextEl.innerText = q.explanation || '本題考點明確，請參照最新中級核心指南。';

    const isCorrect = exam.userAnswers[index] === q.answer;
    const statusIndicator = explBox.querySelector('.status-indicator');
    if (isCorrect) {
      statusIndicator.innerHTML = '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> 回答正確</span>';
    } else {
      statusIndicator.innerHTML = '<span class="badge badge-danger"><i class="fa-solid fa-circle-xmark"></i> 回答錯誤</span>';
      
      // 答錯自動加入錯題本
      addQuestionToMistakes(q);
    }

    // 凍結當前題目選項
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = true;
      const letter = btn.querySelector('.option-letter').innerText;
      if (letter === q.answer) {
        btn.classList.add('opt-correct');
      } else if (exam.userAnswers[index] === letter) {
        btn.classList.add('opt-wrong');
      }
    });

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([explBox]).catch(err => console.log(err));
    }
  }

  // 標記題目按鈕
  document.getElementById('flag-question-btn').addEventListener('click', () => {
    const exam = state.currentExam;
    const index = exam.currentIndex;

    if (exam.flagged.has(index)) {
      exam.flagged.delete(index);
    } else {
      exam.flagged.add(index);
    }

    renderQuestion(index);
  });

  // 暫存答題狀態（切換題時自動保存）
  function saveAnswerState() {
    // 由於我們是直接修改記憶體中的 state.currentExam.userAnswers，此步驟其實已由選項 click 完成。
  }

  // 導覽按鈕點擊
  document.getElementById('prev-q-btn').addEventListener('click', () => {
    if (state.currentExam.currentIndex > 0) {
      renderQuestion(state.currentExam.currentIndex - 1);
    }
  });

  document.getElementById('next-q-btn').addEventListener('click', () => {
    const exam = state.currentExam;
    if (exam.currentIndex < exam.questions.length - 1) {
      renderQuestion(exam.currentIndex + 1);
    } else {
      // 最後一題的「交卷」按鈕
      if (confirm('確定要結束測驗並交卷結算嗎？')) {
        submitExam();
      }
    }
  });

  // 交卷並結算考試
  function submitExam() {
    const exam = state.currentExam;
    if (exam.timer) clearInterval(exam.timer);
    exam.isSubmitted = true;

    // 1. 計算分數
    let correctCount = 0;
    const wrongList = [];

    exam.questions.forEach((q, idx) => {
      if (exam.userAnswers[idx] === q.answer) {
        correctCount++;
      } else {
        wrongList.push(q);
        // 自動加入錯題本
        addQuestionToMistakes(q);
      }
    });

    const score = Math.round((correctCount / exam.questions.length) * 100);
    const isPassed = score >= 70; // 中級合格標準為 70 分

    // 2. 儲存至考試歷史
    const historyItem = {
      date: new Date().toLocaleDateString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      subjectName: exam.subjectName,
      correct: correctCount,
      total: exam.questions.length,
      score: score,
      timeSpent: formatTime(exam.timeSpent)
    };
    state.examHistory.push(historyItem);
    localStorage.setItem('ipas_exam_history', JSON.stringify(state.examHistory));

    // 3. 渲染成績畫面
    examActiveDiv.style.display = 'none';
    examResultDiv.style.display = 'block';

    document.getElementById('result-subject-title').innerText = exam.subjectName;
    document.getElementById('final-score').innerText = score;
    document.getElementById('result-correct-count').innerText = `${correctCount} 題`;
    document.getElementById('result-wrong-count').innerText = `${exam.questions.length - correctCount} 題`;
    document.getElementById('result-time-spent').innerText = formatTime(exam.timeSpent);

    const badge = document.getElementById('score-status-badge');
    if (isPassed) {
      badge.innerText = '合格 (達到 70 分標準)';
      badge.className = 'score-result-badge passed';
    } else {
      badge.innerText = '未合格 (需達 70 分標準)';
      badge.className = 'score-result-badge failed';
    }

    // 圓環動畫繪製
    const ring = document.getElementById('score-ring-progress');
    const radius = ring.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    
    // 計算 offset
    const offset = circumference - (score / 100) * circumference;
    // 圓環顏色調整
    ring.style.stroke = isPassed ? 'var(--success)' : 'var(--danger)';
    
    setTimeout(() => {
      ring.style.strokeDashoffset = offset;
    }, 100);

    updateGlobalBadges();
  }

  // 結束測驗並交卷按鈕
  document.getElementById('submit-exam-btn').addEventListener('click', () => {
    const unanswered = state.currentExam.userAnswers.filter(a => a === null).length;
    let msg = '確定要交卷結算嗎？';
    if (unanswered > 0) {
      msg = `您還有 ${unanswered} 題尚未作答，確定要結束測驗並交卷嗎？`;
    }
    if (confirm(msg)) {
      submitExam();
    }
  });

  // 交卷後「逐題檢討解析」
  document.getElementById('review-exam-btn').addEventListener('click', () => {
    examResultDiv.style.display = 'none';
    examActiveDiv.style.display = 'block';
    
    // 渲染第一題開始檢討
    renderPalette();
    renderQuestion(0);
  });

  document.getElementById('exit-exam-btn').addEventListener('click', () => {
    window.location.hash = 'dashboard';
  });

  // --- 6. 錯題本 (Mistakes) 邏輯 ---
  function initMistakesPage() {
    const emptyView = document.getElementById('empty-mistakes-view');
    const listContainer = document.getElementById('mistakes-container');

    if (state.wrongQuestions.length === 0) {
      emptyView.style.display = 'block';
      listContainer.style.display = 'none';
      document.getElementById('start-mistake-practice').disabled = true;
    } else {
      emptyView.style.display = 'none';
      listContainer.style.display = 'flex';
      document.getElementById('start-mistake-practice').disabled = false;

      renderMistakeList();
    }
  }

  // 寫入錯題至 localStorage
  function addQuestionToMistakes(q) {
    const exists = state.wrongQuestions.some(item => item.id === q.id);
    if (!exists) {
      state.wrongQuestions.push(q);
      localStorage.setItem('ipas_wrong_questions', JSON.stringify(state.wrongQuestions));
      updateGlobalBadges();
    }
  }

  // 渲染錯題列表
  function renderMistakeList() {
    const container = document.getElementById('mistakes-container');
    container.innerHTML = '';

    state.wrongQuestions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'mistake-item';
      
      let badgeHtml = '<span class="badge badge-required">科目一</span>';
      if (q.id.startsWith('subject2_')) badgeHtml = '<span class="badge badge-choice">科目二</span>';
      if (q.id.startsWith('subject3_')) badgeHtml = '<span class="badge badge-choice">科目三</span>';

      card.innerHTML = `
        <div class="mistake-meta">
          <span>錯題編號：${q.id}</span>
          ${badgeHtml}
        </div>
        <div class="mistake-text">${q.question}</div>
        <div class="mistake-options">
          <div class="mistake-opt ${q.answer === 'A' ? 'correct' : ''}"><b>A:</b> ${q.options.A || ''}</div>
          <div class="mistake-opt ${q.answer === 'B' ? 'correct' : ''}"><b>B:</b> ${q.options.B || ''}</div>
          <div class="mistake-opt ${q.answer === 'C' ? 'correct' : ''}"><b>C:</b> ${q.options.C || ''}</div>
          <div class="mistake-opt ${q.answer === 'D' ? 'correct' : ''}"><b>D:</b> ${q.options.D || ''}</div>
        </div>
        <div class="mistake-expl">
          <strong>正確答案：${q.answer}</strong><br/>
          ${q.explanation || '本題考點明確，請牢記核心觀念。'}
        </div>
        <div class="mistake-footer">
          <button class="btn btn-outline btn-block remove-mistake-btn" data-id="${q.id}">
            <i class="fa-solid fa-trash"></i> 我已學會，移出錯題本
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    // 綁定單個移除事件
    document.querySelectorAll('.remove-mistake-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        removeMistake(id);
      });
    });

    // 重新排版公式
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([container]).catch(err => console.log(err));
    }
  }

  function removeMistake(id) {
    state.wrongQuestions = state.wrongQuestions.filter(q => q.id !== id);
    localStorage.setItem('ipas_wrong_questions', JSON.stringify(state.wrongQuestions));
    updateGlobalBadges();
    initMistakesPage();
  }

  // 清空錯題本
  document.getElementById('clear-all-mistakes').addEventListener('click', () => {
    if (confirm('確定要清空所有的錯題紀錄嗎？此動作無法復原！')) {
      state.wrongQuestions = [];
      localStorage.setItem('ipas_wrong_questions', JSON.stringify(state.wrongQuestions));
      updateGlobalBadges();
      initMistakesPage();
    }
  });

  // 錯題本複習模式 (Dumbbell Practice)
  document.getElementById('start-mistake-practice').addEventListener('click', () => {
    if (state.wrongQuestions.length === 0) return;

    // 將所有錯題打亂作為新測驗
    const shuffled = [...state.wrongQuestions].sort(() => 0.5 - Math.random());
    
    state.currentExam = {
      subjectId: 'mistake_review',
      subjectName: '個人錯題精準複習',
      subjectBadge: '錯題複習',
      questions: shuffled,
      userAnswers: new Array(shuffled.length).fill(null),
      flagged: new Set(),
      currentIndex: 0,
      mode: 'quick', // 錯題複習預設為快速模式，可即時看解析
      timeLeft: 0,
      timeSpent: 0,
      isSubmitted: false,
      timer: null
    };

    // UI 跳轉到 Exam 分頁
    window.location.hash = 'exam';
    
    setTimeout(() => {
      examSetupDiv.style.display = 'none';
      examActiveDiv.style.display = 'block';
      examResultDiv.style.display = 'none';
      
      document.getElementById('active-subject-badge').innerText = '錯題複習';
      document.getElementById('active-subject-badge').className = 'badge badge-required';
      document.getElementById('active-subject-title').innerText = '個人錯題精準複習';
      
      renderPalette();
      renderQuestion(0);
      startExamTimer();
    }, 100);
  });

  // --- 7. 高頻記憶卡 (Flashcards) 邏輯 ---
  const FLASHCARDS_DATA = [
    {
      subject: "科目一 · 機器學習",
      front: "PSI (群體穩定性指標) 預警臨界值與對應維運決策",
      back: `
        <p><strong>PSI &lt; 0.1</strong>：分佈無變化，模型穩定。</p>
        <p><strong>0.1 &le; PSI &lt; 0.25</strong>：中度變化，需密切監控，並可安排模型<strong>定期重新訓練 (Retraining)</strong>。</p>
        <p><strong>PSI &ge; 0.25</strong>：資料發生顯著漂移 (Data Drift)！<strong>必須立即觸發報警，並啟動自動化再訓練流水線重新部署</strong>，否則模型效能將雪崩式下滑。</p>
      `
    },
    {
      subject: "科目一 · 自然語言處理",
      front: "Word2Vec 與 GloVe 的模型本質差異",
      back: `
        <p><strong>Word2Vec</strong>：基於預測 (Predictive-based) 的淺層神經網路，使用滑動窗口捕捉局部上下文資訊（CBOW 或 Skip-gram 方式）。</p>
        <p><strong>GloVe</strong>：基於共現統計 (Count-based) 的非線性擬合模型，先構建整個語料庫的<strong>全局詞共現矩陣 (Global Co-occurrence Matrix)</strong> 再進行降維，能更完美捕捉全局語意特徵。</p>
      `
    },
    {
      subject: "科目三 · 深度學習代碼",
      front: "PyTorch 凍結權重進行遷移學習的關鍵語法",
      back: `
        <pre><code class="language-python"># 遍歷特徵提取層並凍結
for param in model.parameters():
    param.requires_grad = False

# 替換全連接分類層 (新層預設 requires_grad=True)
model.fc = nn.Linear(in_features, num_classes)</code></pre>
        <p class="note">註：若出現 <code>trainable=False</code> 屬干擾干擾項。</p>
      `
    },
    {
      subject: "科目三 · 機器學習調參",
      front: "DBSCAN 密度聚類核心超參數及其影響",
      back: `
        <p><strong>eps ($\epsilon$)</strong>：鄰域半徑。設太小會將大部分正常點判定為噪聲 (-1)；設太大會將本應獨立的多個群集融合成一個。</p>
        <p><strong>min_samples (MinPts)</strong>：核心點所需最少鄰居數。設太小容易把小雜訊當作獨立群集；設太大會使分群變得過於嚴苛，核心點減少。</p>
      `
    },
    {
      subject: "科目三 · 計算題",
      front: "卷積層 (Convolutional Layer) 輸出尺寸計算公式",
      back: `
        <div class="formula">$$W_{out} = \lfloor \frac{W_{in} - F + 2P}{S} \rfloor + 1$$</div>
        <p>其中 $W_{in}$ 為輸入寬度，$F$ 為卷積核大小，$P$ 為 Padding，$S$ 為 Stride 步長，$\lfloor \cdot \rfloor$ 代表向下取整。</p>
      `
    },
    {
      subject: "科目三 · 計算題",
      front: "卷積層參數量 (Parameters) 計算公式 (有 Bias)",
      back: `
        <div class="formula">$$\text{Params} = (F \times F \times C_{in} + 1) \times C_{out}$$</div>
        <p>其中 $F \times F$ 為卷積核大小，$C_{in}$ 為輸入通道數，$+1$ 代表偏置項 (Bias)，$C_{out}$ 為輸出通道數。</p>
      `
    },
    {
      subject: "科目二 · 大數據技術",
      front: "Spark 記憶體計算與 Ray 分散式計算的差異",
      back: `
        <p><strong>Spark</strong>：大數據 ETL 首選。基於數據並行的 BSP 模式，提供 RDD/DataFrame 抽象，極度擅長結構化數據與流處理。</p>
        <p><strong>Ray</strong>：AI 分散式訓練首選。基於 Actor (有狀態) 和 Task (無狀態) 的動態任務圖架構，支持共享記憶體 Plasma 零拷貝，能以微秒級延遲調度大規模 ML/RL 任務。</p>
      `
    },
    {
      subject: "科目一 · 生成式 AI",
      front: "多模態 CLIP 架構如何將圖像與文字關聯？",
      back: `
        <p>CLIP 使用<strong>對比式學習 (Contrastive Learning)</strong>，分別通過圖像編碼器與文本編碼器，將圖文投影到一個<strong>「共同嵌入空間 (Shared Embedding Space)」</strong>。</p>
        <p>藉由最大化配對圖文的餘弦相似度、最小化不配對圖文的相似度進行聯合訓練，賦予模型極強的 Zero-shot 影像識別能力。</p>
      `
    },
    {
      subject: "科目一 · 安全與合規",
      front: "台灣《人工智慧導入指引》核心精神",
      back: `
        <p>由數發部推動之指引，核心在於保障<strong>人本與自主性</strong>、<strong>安全性與可靠性</strong>、<strong>隱私與數據治理</strong>等七大原則。</p>
        <p>要求在 AI 導入鏈中保有「人類監督 (Human-in-the-loop)」與完善的「審計可責任化」問責機制，防範演算法偏見與歧視。</p>
      `
    },
    {
      subject: "2026 前沿技術 · 知識圖譜",
      front: "GraphRAG 與傳統 RAG 的核心差異",
      back: `
        <p>傳統 RAG 僅基於向量相似度進行局部切片檢索，對於跨章節的「全局性總結」常力不從心。</p>
        <p><strong>GraphRAG</strong> 將文本結構化為<strong>知識圖譜 (Knowledge Graph)</strong>，利用 Leiden 社群聚類演算法對圖譜進行分層摘要，能提供具全局視野、結構完整且幾無幻覺的宏觀回答。</p>
      `
    }
  ];

  function initFlashcards() {
    const cardEl = document.getElementById('active-flashcard');
    cardEl.classList.remove('flipped');

    // 打亂記憶卡
    state.flashcards = [...FLASHCARDS_DATA].sort(() => 0.5 - Math.random());
    state.currentFlashcardIndex = 0;

    renderFlashcard();

    // 綁定 3D 點擊翻轉事件（只綁定一次）
    if (!cardEl.dataset.bound) {
      cardEl.addEventListener('click', function() {
        this.classList.toggle('flipped');
      });
      cardEl.dataset.bound = "true";
    }
  }

  function renderFlashcard() {
    const cardEl = document.getElementById('active-flashcard');
    cardEl.classList.remove('flipped');

    const fc = state.flashcards[state.currentFlashcardIndex];
    
    // 前面
    document.getElementById('fc-subject-tag').innerText = fc.subject;
    document.getElementById('fc-index-label').innerText = `${state.currentFlashcardIndex + 1} / ${state.flashcards.length}`;
    document.getElementById('fc-front-title').innerText = fc.front;

    // 後面
    document.getElementById('fc-back-content').innerHTML = fc.back;

    // 重新高亮背面的 Python 程式碼
    setTimeout(() => {
      const codeBlock = cardEl.querySelector('pre code');
      if (codeBlock && window.Prism) {
        window.Prism.highlightElement(codeBlock);
      }
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([document.getElementById('fc-back-content')]).catch(err => console.log(err));
      }
    }, 100);
  }

  // 記憶卡控制按鈕
  document.getElementById('fc-prev-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.currentFlashcardIndex > 0) {
      state.currentFlashcardIndex--;
      renderFlashcard();
    }
  });

  document.getElementById('fc-next-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.currentFlashcardIndex < state.flashcards.length - 1) {
      state.currentFlashcardIndex++;
      renderFlashcard();
    } else {
      // 完結輪迴，重新打亂
      if (confirm('已背誦完所有高頻卡片！要重新打亂隨機複習嗎？')) {
        initFlashcards();
      }
    }
  });

  // 我已記住此卡（從隊列中移除）
  document.getElementById('fc-toggle-known').addEventListener('click', (e) => {
    e.stopPropagation();
    state.flashcards.splice(state.currentFlashcardIndex, 1);

    if (state.flashcards.length === 0) {
      alert('恭喜！您已成功記住所有高頻考點卡片！');
      initFlashcards();
    } else {
      // 邊界調整
      if (state.currentFlashcardIndex >= state.flashcards.length) {
        state.currentFlashcardIndex = 0;
      }
      renderFlashcard();
    }
  });

  // --- 8. 核心知識庫 (Knowledge Base) 邏輯 ---
  let selectedTopicId = null;

  function initKnowledgeBase() {
    renderTopicsTree();
    
    // 綁定搜尋框
    const searchInput = document.getElementById('knowledge-search');
    searchInput.addEventListener('input', function() {
      filterTopics(this.value.trim());
    });
  }

  // 渲染左側目錄樹
  function renderTopicsTree() {
    const treeContainer = document.getElementById('knowledge-topics-tree');
    treeContainer.innerHTML = '';

    LEARNING_DATABASE.forEach(cat => {
      const catDiv = document.createElement('div');
      catDiv.className = 'tree-category';
      
      const title = document.createElement('div');
      title.className = 'category-title';
      title.innerText = cat.title;
      catDiv.appendChild(title);

      cat.topics.forEach(topic => {
        const btn = document.createElement('button');
        btn.className = 'tree-topic-btn';
        
        // 已讀標記打勾
        const isRead = state.readTopics.includes(topic.id);
        const checkIcon = isRead ? '<i class="fa-solid fa-circle-check text-success"></i> ' : '';
        btn.innerHTML = `${checkIcon}${topic.title}`;
        btn.id = `tree-btn-${topic.id}`;

        if (topic.id === selectedTopicId) {
          btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
          document.querySelectorAll('.tree-topic-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadTopicContent(topic.id);
        });

        catDiv.appendChild(btn);
      });

      treeContainer.appendChild(catDiv);
    });
  }

  // 載入右側研讀內容
  function loadTopicContent(topicId) {
    selectedTopicId = topicId;
    
    // 找出對應的主題
    let foundTopic = null;
    let foundCat = null;
    for (const cat of LEARNING_DATABASE) {
      foundTopic = cat.topics.find(t => t.id === topicId);
      if (foundTopic) {
        foundCat = cat;
        break;
      }
    }

    if (!foundTopic) return;

    // 標記為已讀並存檔
    if (!state.readTopics.includes(topicId)) {
      state.readTopics.push(topicId);
      localStorage.setItem('ipas_read_topics', JSON.stringify(state.readTopics));
      
      // 更新左側樹狀目錄的打勾符號
      renderTopicsTree();
      updateGlobalBadges();
    }

    const emptyState = document.getElementById('knowledge-empty-state');
    const contentArea = document.getElementById('knowledge-reader-content');

    emptyState.style.display = 'none';
    contentArea.style.display = 'block';

    contentArea.innerHTML = `
      <h2>${foundTopic.title}</h2>
      <div class="topic-meta-bar" style="display:flex; justify-content:space-between; margin-bottom:1.5rem; font-size:0.8rem; color:var(--text-muted);">
        <span>分類大綱：${foundCat.title}</span>
        <span class="text-success"><i class="fa-solid fa-circle-check"></i> 本主題已閱讀完成</span>
      </div>
      <div class="topic-body-html">${foundTopic.content}</div>
    `;

    // 重新高亮程式碼與重新渲染數學公式
    setTimeout(() => {
      // 獲取所有 pre code 元素並使用 Prism 高亮
      contentArea.querySelectorAll('pre code').forEach(block => {
        if (window.Prism) window.Prism.highlightElement(block);
      });

      // 觸發 MathJax 公式渲染
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([contentArea]).catch(err => console.log(err));
      }
    }, 50);
  }

  // 全文搜尋過濾主題
  function filterTopics(query) {
    if (!query) {
      renderTopicsTree();
      return;
    }

    const lowerQuery = query.toLowerCase();
    const treeContainer = document.getElementById('knowledge-topics-tree');
    treeContainer.innerHTML = '';

    LEARNING_DATABASE.forEach(cat => {
      // 篩選出符合主題標題或內容關鍵字的主題
      const matchedTopics = cat.topics.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        t.content.toLowerCase().includes(lowerQuery)
      );

      if (matchedTopics.length > 0) {
        const catDiv = document.createElement('div');
        catDiv.className = 'tree-category';
        
        const title = document.createElement('div');
        title.className = 'category-title';
        title.innerText = cat.title;
        catDiv.appendChild(title);

        matchedTopics.forEach(topic => {
          const btn = document.createElement('button');
          btn.className = 'tree-topic-btn';
          
          const isRead = state.readTopics.includes(topic.id);
          const checkIcon = isRead ? '<i class="fa-solid fa-circle-check text-success"></i> ' : '';
          btn.innerHTML = `${checkIcon}${topic.title}`;
          btn.id = `tree-btn-${topic.id}`;

          if (topic.id === selectedTopicId) {
            btn.classList.add('active');
          }

          btn.addEventListener('click', () => {
            document.querySelectorAll('.tree-topic-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadTopicContent(topic.id);
          });

          catDiv.appendChild(btn);
        });

        treeContainer.appendChild(catDiv);
      }
    });
  }

  // --- 9. 主題切換 (Light / Dark) 邏輯 ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        themeToggleBtn.title = '切換主題 (目前為亮色模式)';
        state.activeTheme = 'light';
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeToggleBtn.title = '切換主題 (目前為暗色模式)';
        state.activeTheme = 'dark';
      }
      localStorage.setItem('ipas_theme', state.activeTheme);
      
      // 當前在學習控制台時，主題切換後即時刷新雷達圖配色，維持至臻視覺品質
      const hash = window.location.hash.slice(1) || 'dashboard';
      if (hash === 'dashboard') {
        initDashboard();
      }
    });
  }
});

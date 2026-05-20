import os
import re

def bundle():
    workspace = "c:/Git-Data/AI 應用規劃師(中級)"
    
    # 讀取 CSS
    css_path = os.path.join(workspace, "index.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
        
    # 讀取 questions_db.js
    q_db_path = os.path.join(workspace, "js/questions_db.js")
    with open(q_db_path, "r", encoding="utf-8") as f:
        q_db_content = f.read()
        
    # 讀取 learning_db.js
    l_db_path = os.path.join(workspace, "js/learning_db.js")
    with open(l_db_path, "r", encoding="utf-8") as f:
        l_db_content = f.read()
        
    # 讀取 app.js
    app_path = os.path.join(workspace, "js/app.js")
    with open(app_path, "r", encoding="utf-8") as f:
        app_content = f.read()

    # 定義原始的 HTML 結構，但不引用外部 CSS 與 JS，而是直接內聯 (Inline)
    html_template = """<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iPAS AI 應用規劃師（中級）能力鑑定——極致輔考與模擬測驗平台</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="專為經濟部 iPAS AI 應用規劃師（中級）能力鑑定打造的極致輔考平台。提供第一科人工智慧技術應用與規劃、第二科大數據處理分析、第三科機器學習模擬題庫，整合 114 年最新歷屆試題與 2025-2026 最新 AI 代理、GraphRAG、MLOps 漂移監控熱點。">
  <meta name="keywords" content="iPAS, AI應用規劃師, 中級, 模擬試題, 人工智慧技術應用與規劃, 大數據處理分析與應用, 機器學習技術與應用, Python程式題, 2025 AI熱點">
  <meta name="author" content="Antigravity AI">
  
  <!-- Google Fonts & FontAwesome -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Prism.js Code Highlighting (Tomorrow Dark theme) -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
  
  <!-- Chart.js CDN for Learning Radar Chart -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <style>
/* ==========================================================================
   CSS STYLESHEET (INLINED)
   ========================================================================== */
__CSS_PLACEHOLDER__
  </style>
  
  <!-- MathJax for Math Formulas -->
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
  </script>
  <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" defer></script>
</head>
<body class="dark-theme">
  
  <!-- Background Glows -->
  <div class="bg-glow bg-glow-1"></div>
  <div class="bg-glow bg-glow-2"></div>
  <div class="bg-glow bg-glow-3"></div>

  <!-- Main Container -->
  <div class="app-container">
    
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-logo">
          <i class="fa-solid fa-brain-circuit brain-icon"></i>
        </div>
        <div class="brand-text">
          <h1>iPAS AI 規劃師</h1>
          <span>中級輔考平台 v2.5</span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <a href="#dashboard" class="nav-item active" id="nav-dashboard">
          <i class="fa-solid fa-gauge-high"></i>
          <span>學習控制台</span>
        </a>
        <a href="#exam" class="nav-item" id="nav-exam">
          <i class="fa-solid fa-laptop-code"></i>
          <span>模擬測驗區</span>
        </a>
        <a href="#mistakes" class="nav-item" id="nav-mistakes">
          <i class="fa-solid fa-circle-xmark"></i>
          <span>個人錯題本</span>
          <span class="badge" id="mistake-count">0</span>
        </a>
        <a href="#flashcards" class="nav-item" id="nav-flashcards">
          <i class="fa-solid fa-rectangle-list"></i>
          <span>高頻記憶卡</span>
        </a>
        <a href="#knowledge" class="nav-item" id="nav-knowledge">
          <i class="fa-solid fa-book-open-reader"></i>
          <span>核心知識庫</span>
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="avatar"><i class="fa-solid fa-user-graduate"></i></div>
          <div class="user-info">
            <h4>卓越考生</h4>
            <p>目標：一次考取中級證照</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <h2 id="page-title">學習控制台</h2>
          <p id="page-subtitle" class="text-muted">掌握最新考情，全面迎戰中級能力鑑定</p>
        </div>
        <div class="header-right">
          <div class="stat-pill">
            <i class="fa-solid fa-trophy text-warning"></i>
            <span>合格門檻：每科均達 70 分</span>
          </div>
          <button id="theme-toggle" class="icon-btn" title="切換主題 (目前為暗色模式)">
            <i class="fa-solid fa-moon"></i>
          </button>
        </div>
      </header>

      <!-- Dynamic Page Container -->
      <div class="page-container">
        
        <!-- PAGE 1: DASHBOARD -->
        <section id="page-dashboard" class="app-page active">
          <!-- Welcome Widget -->
          <div class="card welcome-card">
            <div class="welcome-content">
              <h3>歡迎回來，迎戰 iPAS AI 中級證照！</h3>
              <p>平台已為您同步最新考情：自 114 年起，<strong>科目二（大數據）與科目三（機器學習）中 Python 程式題比重高達 25%</strong>。本平台已針對該重大變更進行全面考點特化，並補強了 2025-2026 最新 AI 代理、GraphRAG 與台灣公佈之《人工智慧導入指引》。</p>
              <div class="welcome-actions">
                <a href="#exam" class="btn btn-primary"><i class="fa-solid fa-circle-play"></i> 進入模擬測驗</a>
                <a href="#knowledge" class="btn btn-outline"><i class="fa-solid fa-book"></i> 研讀最新知識庫</a>
              </div>
            </div>
            <div class="welcome-icon">
              <i class="fa-solid fa-chart-line-up"></i>
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="stats-grid">
            <div class="card stat-card glow-card-blue">
              <div class="stat-icon"><i class="fa-solid fa-graduation-cap"></i></div>
              <div class="stat-info">
                <h3>知識庫學習進度</h3>
                <div class="stat-number"><span id="stats-learn-percent">0</span>%</div>
                <div class="progress-bar-container">
                  <div class="progress-bar" id="learn-progress-bar" style="width: 0%"></div>
                </div>
              </div>
            </div>
            
            <div class="card stat-card glow-card-green">
              <div class="stat-icon"><i class="fa-solid fa-circle-check"></i></div>
              <div class="stat-info">
                <h3>模擬考平均答對率</h3>
                <div class="stat-number"><span id="stats-avg-accuracy">0</span>%</div>
                <div class="progress-bar-container">
                  <div class="progress-bar bg-green" id="accuracy-progress-bar" style="width: 0%"></div>
                </div>
              </div>
            </div>

            <div class="card stat-card glow-card-purple">
              <div class="stat-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <div class="stat-info">
                <h3>累積待複習錯題</h3>
                <div class="stat-number"><span id="stats-mistake-count">0</span> 題</div>
                <p class="stat-subtext">答錯題目將自動加入錯題本</p>
              </div>
            </div>
          </div>

          <!-- Certification Structure & News -->
          <div class="dashboard-details-grid">
            <!-- Left: IPAS Certification Details -->
            <div class="card">
              <div class="card-header">
                <h3><i class="fa-solid fa-id-card text-primary"></i> iPAS 中級證照獲取結構</h3>
              </div>
              <div class="card-body">
                <div class="cert-flow">
                  <div class="cert-step cert-step-required">
                    <h4>第一科：必考</h4>
                    <p>人工智慧技術應用與規劃</p>
                    <span class="badge badge-required">必備</span>
                  </div>
                  <div class="cert-arrow"><i class="fa-solid fa-plus"></i></div>
                  <div class="cert-step-group">
                    <div class="cert-step cert-step-choice">
                      <h4>第二科：選考 A</h4>
                      <p>大數據處理分析與應用</p>
                      <span class="badge badge-choice">選考之一</span>
                    </div>
                    <div class="cert-divider"><span>或</span></div>
                    <div class="cert-step cert-step-choice">
                      <h4>第三科：選考 B</h4>
                      <p>機器學習技術與應用</p>
                      <span class="badge badge-choice">選考之一</span>
                    </div>
                  </div>
                </div>
                <div class="info-alert">
                  <i class="fa-solid fa-circle-info"></i>
                  <span><strong>取得證照條件：</strong>第一科必考，並搭配第二科或第三科（二擇一選考）。所有報考科目於當次或保留期限內皆須達到 <strong>70 分 (含) 以上</strong>，即可獲頒證照。</span>
                </div>
              </div>
            </div>

            <!-- Right: Latest Exam News (2025-2026) -->
            <div class="card">
              <div class="card-header">
                <h3><i class="fa-solid fa-bullhorn text-danger"></i> 2025-2026 最新考情公告</h3>
              </div>
              <div class="card-body">
                <ul class="news-list">
                  <li>
                    <span class="news-date">2026年最新</span>
                    <div class="news-content">
                      <strong>大數據與機器學習 Python 程式題比重正式提高至 25%</strong>
                      <p>考題著重於 PyTorch 遷移學習結構（requires_grad）、Scikit-Learn 的 DBSCAN 模型超參數微調、以及 CNN 特徵圖尺寸與參數量計算。</p>
                    </div>
                  </li>
                  <li>
                    <span class="news-date">2025年公告</span>
                    <div class="news-content">
                      <strong>新增負責任 AI 與時事熱點考題</strong>
                      <p>新增台灣《人工智慧導入指引》七大原則、MLOps 模型數據漂移監控指標（KL散度與 PSI）、RAG 與 GraphRAG 架構。</p>
                    </div>
                  </li>
                  <li>
                    <span class="news-date">官方消息</span>
                    <div class="news-content">
                      <strong>中級題型配置說明</strong>
                      <p>每科皆為 50 題單選題，作答時間 80 分鐘。本平台模擬測驗提供 100% 全真倒數計時模擬。</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- L21 Learning Radar Chart Card -->
          <div class="card learning-radar-card" style="margin-top: 1.5rem;">
            <div class="card-header">
              <h3><i class="fa-solid fa-chart-pie text-success"></i> L21 核心單元研讀進度雷達圖</h3>
              <span class="badge badge-required" style="background: linear-gradient(135deg, var(--success), #10b981); margin-left: auto;">實時動態更新</span>
            </div>
            <div class="card-body radar-card-body">
              <div class="radar-chart-container">
                <canvas id="learningRadarChart"></canvas>
              </div>
              <div class="radar-details">
                <h4>九大核心單元研讀狀態</h4>
                <p>雷達圖動態反映您在『L21 人工智慧技術應用與規劃』官方教材中各單元的研讀比例。請至「核心知識庫」進行研讀並標記為已讀，您的雷達圖即會向外擴張！目標是將所有單元填滿 100%！</p>
                <div class="unit-progress-list" id="radar-unit-list">
                  <!-- 動態渲染各單元百分比 -->
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- PAGE 2: EXAM ENGINE -->
        <section id="page-exam" class="app-page">
          <!-- Setup Exam Screen -->
          <div id="exam-setup" class="exam-setup-container">
            <div class="card setup-card">
              <div class="setup-header">
                <i class="fa-solid fa-file-signature setup-icon"></i>
                <h3>選擇測驗科目與模式</h3>
                <p>選擇您想練習的科目，或直接啟動 80 分鐘的全真模擬考。</p>
              </div>
              
              <div class="setup-body">
                <!-- Subject Select -->
                <div class="setup-section">
                  <label class="section-title"><i class="fa-solid fa-list-check"></i> 1. 選擇考試科目</label>
                  <div class="radio-group-cards">
                    <label class="radio-card active">
                      <input type="radio" name="exam-subject" value="subject1" checked>
                      <div class="radio-card-content">
                        <span class="badge badge-required">科目一</span>
                        <h4>人工智慧技術應用與規劃</h4>
                        <p>含歷屆試題與 490 題學習模擬題</p>
                      </div>
                    </label>
                    <label class="radio-card">
                      <input type="radio" name="exam-subject" value="subject2">
                      <div class="radio-card-content">
                        <span class="badge badge-choice">科目二</span>
                        <h4>大數據處理分析與應用</h4>
                        <p>大數據計算、前處理標準化與同態加密</p>
                      </div>
                    </label>
                    <label class="radio-card">
                      <input type="radio" name="exam-subject" value="subject3">
                      <div class="radio-card-content">
                        <span class="badge badge-choice">科目三</span>
                        <h4>機器學習技術與應用</h4>
                        <p>機器學習、遷移學習與 Python 程式題專區</p>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Mode Select -->
                <div class="setup-section">
                  <label class="section-title"><i class="fa-solid fa-sliders"></i> 2. 選擇測驗模式與題數</label>
                  <div class="mode-options">
                    <div class="mode-card active" data-mode="quick">
                      <div class="mode-icon"><i class="fa-solid fa-bolt"></i></div>
                      <div class="mode-details">
                        <h4>快速隨機練習</h4>
                        <p>碎片化練習，可自訂題數，答完立即顯示解析。</p>
                        <div class="question-count-select">
                          <span>題數：</span>
                          <button type="button" class="q-count-btn active" data-count="10">10</button>
                          <button type="button" class="q-count-btn" data-count="20">20</button>
                          <button type="button" class="q-count-btn" data-count="50">50</button>
                        </div>
                      </div>
                    </div>

                    <div class="mode-card" data-mode="full">
                      <div class="mode-icon"><i class="fa-solid fa-stopwatch"></i></div>
                      <div class="mode-details">
                        <h4>全真模擬考試</h4>
                        <p>模擬真實考場，共 50 題，限時 80 分鐘，交卷後統一結算。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="setup-footer">
                <button id="start-exam-btn" class="btn btn-primary btn-lg btn-block">
                  <i class="fa-solid fa-play"></i> 開始測驗
                </button>
              </div>
            </div>
          </div>

          <!-- Active Exam Screen (Hidden initially) -->
          <div id="exam-active" class="exam-active-container" style="display: none;">
            <div class="exam-header-bar card">
              <div class="exam-info">
                <span class="badge badge-required" id="active-subject-badge">科目一</span>
                <h3 id="active-subject-title">人工智慧技術應用與規劃</h3>
              </div>
              <div class="exam-timer-wrapper">
                <div id="timer-icon"><i class="fa-solid fa-clock"></i></div>
                <div id="exam-timer">80:00</div>
              </div>
            </div>

            <div class="exam-workspace">
              <!-- Left: Question Area -->
              <div class="question-panel">
                <div class="card question-card">
                  <div class="question-meta">
                    <span class="q-index" id="current-q-index">第 1 / 10 題</span>
                    <span class="q-difficulty" id="current-q-diff">難度：★★★☆☆</span>
                    <button id="flag-question-btn" class="flag-btn" title="標記本題，回頭檢查">
                      <i class="fa-regular fa-flag"></i> 標記此題
                    </button>
                  </div>
                  
                  <div class="question-text" id="active-question-text">
                    題目載入中...
                  </div>
                  
                  <div class="options-container" id="active-options-container">
                    <!-- Dynamic rendering of options -->
                  </div>
                  
                  <!-- Explanation Area (only visible in review/post-submission) -->
                  <div class="card explanation-box" id="active-explanation-box" style="display: none;">
                    <div class="expl-header">
                      <span class="status-indicator"></span>
                      <h4><i class="fa-solid fa-circle-info"></i> 答案與解析</h4>
                    </div>
                    <div class="expl-body">
                      <p><strong>正確答案：</strong> <span class="correct-ans-highlight" id="correct-ans-label">A</span></p>
                      <p class="expl-text" id="active-explanation-text">解析載入中...</p>
                    </div>
                  </div>

                  <div class="question-navigation">
                    <button id="prev-q-btn" class="btn btn-secondary"><i class="fa-solid fa-chevron-left"></i> 上一題</button>
                    <button id="instant-check-btn" class="btn btn-info" style="display: none;"><i class="fa-solid fa-eye"></i> 即時看解析</button>
                    <button id="next-q-btn" class="btn btn-primary">下一題 <i class="fa-solid fa-chevron-right"></i></button>
                  </div>
                </div>
              </div>

              <!-- Right: Question Palette Navigation -->
              <aside class="palette-panel card">
                <div class="palette-header">
                  <h4>答題板</h4>
                  <span id="answered-ratio">已答 0/10 題</span>
                </div>
                <div class="palette-grid" id="question-palette">
                  <!-- Dynamic palette numbers -->
                </div>
                <div class="palette-footer">
                  <button id="submit-exam-btn" class="btn btn-danger btn-block"><i class="fa-solid fa-square-check"></i> 結束測驗並交卷</button>
                </div>
              </aside>
            </div>
          </div>

          <!-- Exam Result / Score Screen (Hidden initially) -->
          <div id="exam-result" class="exam-result-container" style="display: none;">
            <div class="card score-card">
              <div class="score-header">
                <h3>測驗結果報告</h3>
                <p id="result-subject-title">人工智慧技術應用與規劃</p>
              </div>
              <div class="score-body">
                <div class="score-circle-wrapper">
                  <svg class="score-ring" width="200" height="200">
                    <circle class="score-ring-bg" cx="100" cy="100" r="85"></circle>
                    <circle class="score-ring-fill" id="score-ring-progress" cx="100" cy="100" r="85" style="stroke-dasharray: 534; stroke-dashoffset: 534;"></circle>
                  </svg>
                  <div class="score-value">
                    <span id="final-score">0</span>
                    <span class="score-total">/ 100</span>
                  </div>
                </div>

                <div class="score-result-badge" id="score-status-badge">
                  未合格 (需達 70 分)
                </div>

                <div class="score-stats-row">
                  <div class="score-stat-box">
                    <span class="label">答對題數</span>
                    <span class="value text-success" id="result-correct-count">0 題</span>
                  </div>
                  <div class="score-stat-box">
                    <span class="label">答錯題數</span>
                    <span class="value text-danger" id="result-wrong-count">0 題</span>
                  </div>
                  <div class="score-stat-box">
                    <span class="label">花費時間</span>
                    <span class="value text-primary" id="result-time-spent">00:00</span>
                  </div>
                </div>

                <div class="score-actions">
                  <button id="review-exam-btn" class="btn btn-primary"><i class="fa-solid fa-magnifying-glass"></i> 逐題檢討解析</button>
                  <button id="exit-exam-btn" class="btn btn-outline"><i class="fa-solid fa-house"></i> 返回控制台</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- PAGE 3: MY MISTAKES -->
        <section id="page-mistakes" class="app-page">
          <div class="mistake-header-container">
            <div class="mistake-description">
              <h3>個人錯題本</h3>
              <p>這裡自動收錄您在模擬測驗中答錯的題目。您可以在此重新練習，答對後題目會自動自錯題本中移除，直到錯題歸零！</p>
            </div>
            <div class="mistake-actions-top">
              <button id="start-mistake-practice" class="btn btn-success"><i class="fa-solid fa-dumbbell"></i> 啟動錯題複習模式</button>
              <button id="clear-all-mistakes" class="btn btn-outline-danger"><i class="fa-solid fa-trash-can"></i> 清空錯題本</button>
            </div>
          </div>

          <div class="card mistake-list-card">
            <div id="empty-mistakes-view" class="empty-state">
              <i class="fa-solid fa-circle-check text-success"></i>
              <h4>太棒了，目前沒有任何錯題！</h4>
              <p>模擬測驗答錯的題目會自動出現在這裡。去試試模擬測驗吧！</p>
              <a href="#exam" class="btn btn-primary mt-4">前往模擬測驗</a>
            </div>

            <div id="mistakes-container" class="mistakes-list" style="display: none;">
              <!-- Dynamic mistake list rendering -->
            </div>
          </div>
        </section>

        <!-- PAGE 4: FLASHCARDS -->
        <section id="page-flashcards" class="app-page">
          <div class="flashcard-intro">
            <h3>高頻考點核心記憶卡</h3>
            <p>透過精選 3D 記憶雙面卡，快速背誦高頻考點。點擊卡片可 3D 翻轉顯示背面的精確解釋、速記公式或 Python 核心片段。</p>
          </div>

          <div class="flashcard-interactive-area">
            <div class="flashcard-container">
              <div class="flashcard" id="active-flashcard">
                <!-- Front Side -->
                <div class="flashcard-face flashcard-front">
                  <div class="card-face-header">
                    <span class="fc-subject" id="fc-subject-tag">第一科核心</span>
                    <span class="fc-num" id="fc-index-label">1 / 15</span>
                  </div>
                  <div class="card-face-body">
                    <h3 id="fc-front-title">PSI (群體穩定性指標) 預警臨界值</h3>
                    <p class="tap-hint"><i class="fa-solid fa-hand-pointer"></i> 點擊卡片以翻轉查看詳解</p>
                  </div>
                </div>
                <!-- Back Side -->
                <div class="flashcard-face flashcard-back">
                  <div class="card-face-header">
                    <span class="fc-subject text-purple">核心詳解與公式</span>
                    <span class="fc-num"><i class="fa-solid fa-rotate-right"></i></span>
                  </div>
                  <div class="card-face-body">
                    <div id="fc-back-content">
                      <p><strong>PSI &lt; 0.1</strong>：分佈無變化，模型穩定。</p>
                      <p><strong>0.1 &le; PSI &lt; 0.25</strong>：中度變化，需密切監控並規劃重新訓練。</p>
                      <p><strong>PSI &ge; 0.25</strong>：發生顯著漂移，必須立即重新訓練模型！</p>
                    </div>
                    <p class="tap-hint"><i class="fa-solid fa-hand-pointer"></i> 點擊卡片以翻回正面</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flashcard-controls">
              <button id="fc-prev-btn" class="fc-btn" title="上一個考點"><i class="fa-solid fa-arrow-left"></i> 上一卡</button>
              <button id="fc-toggle-known" class="fc-btn fc-btn-success" title="我已記住此考點"><i class="fa-solid fa-check-double"></i> 我已記住</button>
              <button id="fc-next-btn" class="fc-btn" title="下一個考點">下一卡 <i class="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>
        </section>

        <!-- PAGE 5: KNOWLEDGE BASE -->
        <section id="page-knowledge" class="app-page">
          <div class="knowledge-header">
            <h3>iPAS AI 規劃師中級系統化知識庫</h3>
            <p>融合 L21 學習指南精華、114 年第二次歷屆試題方向，與 2025~2026 最前沿技術考點補強。</p>
          </div>

          <div class="knowledge-layout">
            <!-- Left: Sidebar topics list -->
            <aside class="knowledge-sidebar card">
              <div class="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="knowledge-search" placeholder="搜尋核心知識與關鍵字...">
              </div>
              <div class="topics-tree" id="knowledge-topics-tree">
                <!-- Dynamically loaded topics tree -->
              </div>
            </aside>

            <!-- Right: Content reader -->
            <article class="knowledge-reader card">
              <div id="knowledge-empty-state" class="reader-empty">
                <i class="fa-solid fa-book-open-reader"></i>
                <h4>請在左側選擇學習主題</h4>
                <p>點擊左側目錄即可展開詳細單元。包含 Python 程式解析、CNN 參數量公式以及大數據標準化等重點。</p>
              </div>
              <div id="knowledge-reader-content" class="reader-content" style="display: none;">
                <!-- Dynamically rendered knowledge HTML -->
              </div>
            </article>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- Prism.js Code Highlighting Script -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>

  <script>
/* ==========================================================================
   QUESTIONS DATABASE (INLINED)
   ========================================================================== */
__QUESTIONS_DB_PLACEHOLDER__
  </script>

  <script>
/* ==========================================================================
   LEARNING DATABASE (INLINED)
   ========================================================================== */
__LEARNING_DB_PLACEHOLDER__
  </script>

  <script>
/* ==========================================================================
   APPLICATION CORE LOGIC (INLINED)
   ========================================================================== */
__APP_LOGIC_PLACEHOLDER__
  </script>
</body>
</html>
"""

    # 取代 CSS 佔位符
    html_bundled = html_template.replace("__CSS_PLACEHOLDER__", css_content)
    
    # 取代 JS 佔位符
    html_bundled = html_bundled.replace("__QUESTIONS_DB_PLACEHOLDER__", q_db_content)
    html_bundled = html_bundled.replace("__LEARNING_DB_PLACEHOLDER__", l_db_content)
    html_bundled = html_bundled.replace("__APP_LOGIC_PLACEHOLDER__", app_content)
    
    # 寫入最終 index.html
    bundled_html_path = os.path.join(workspace, "index.html")
    with open(bundled_html_path, "w", encoding="utf-8") as f:
        f.write(html_bundled)
        
    print("Bundle complete successfully! HTML file size:", len(html_bundled), "bytes")

if __name__ == "__main__":
    bundle()

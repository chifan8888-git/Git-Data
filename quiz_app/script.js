let QUESTIONS_DATA = [];
let testQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

const TOTAL_QUESTIONS_PER_TEST = 25;

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const reviewScreen = document.getElementById('review-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const reviewBtn = document.getElementById('review-btn');
const backToResultBtn = document.getElementById('back-to-result');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const categoryBadge = document.getElementById('category-badge');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');

const finalScoreElement = document.getElementById('final-score');
const feedbackElement = document.getElementById('result-feedback');
const reviewContainer = document.getElementById('review-container');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    if (QUESTIONS_DATA.length === 0) {
        alert('題庫載入中，請稍候...');
        return;
    }
    testQuestions = shuffle([...QUESTIONS_DATA]).slice(0, TOTAL_QUESTIONS_PER_TEST);
    currentQuestionIndex = 0;
    userAnswers = new Array(TOTAL_QUESTIONS_PER_TEST).fill(null);
    
    // 重置科目統計條
    document.getElementById('stat-bar-1').style.width = '0%';
    document.getElementById('stat-bar-2').style.width = '0%';
    
    showScreen(quizScreen);
    updateQuestion();
}

function updateQuestion() {
    const q = testQuestions[currentQuestionIndex];
    categoryBadge.innerText = q.category;
    questionText.innerText = q.question;
    progressText.innerText = `題目 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS_PER_TEST}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS_PER_TEST) * 100}%`;
    
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        if (userAnswers[currentQuestionIndex] === index) btn.classList.add('selected');
        btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span class="option-text">${opt}</span>`;
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });
    
    nextBtn.innerText = currentQuestionIndex === TOTAL_QUESTIONS_PER_TEST - 1 ? '提交測驗' : '下一題';
    nextBtn.disabled = userAnswers[currentQuestionIndex] === null;
}

function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((b, i) => i === index ? b.classList.add('selected') : b.classList.remove('selected'));
    nextBtn.disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < TOTAL_QUESTIONS_PER_TEST - 1) {
        currentQuestionIndex++;
        updateQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    let score = 0;
    
    // 初始化科目計分器
    const cat1 = { name: "人工智慧基礎概論", correct: 0, total: 0 };
    const cat2 = { name: "生成式 AI 應用與規劃", correct: 0, total: 0 };

    testQuestions.forEach((q, i) => {
        const isCorrect = userAnswers[i] === q.answer;
        if (isCorrect) score++;
        
        // 累加科目統計
        if (q.category === cat1.name) {
            cat1.total++;
            if (isCorrect) cat1.correct++;
        } else if (q.category === cat2.name) {
            cat2.total++;
            if (isCorrect) cat2.correct++;
        }
    });

    const finalPercent = Math.round((score / TOTAL_QUESTIONS_PER_TEST) * 100);
    finalScoreElement.innerText = finalPercent;
    feedbackElement.innerText = finalPercent >= 80 ? "太棒了！" : (finalPercent >= 60 ? "不錯哦！" : "再加油！");
    
    // 更新科目統計顯示
    const updateStat = (id, cat) => {
        const percent = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
        document.getElementById(`stat-value-${id}`).innerText = `${percent}%`;
        // 使用 setTimeout 確保動畫能在畫面切換後觸發
        setTimeout(() => {
            document.getElementById(`stat-bar-${id}`).style.width = `${percent}%`;
        }, 100);
    };

    updateStat(1, cat1);
    updateStat(2, cat2);

    showScreen(resultScreen);
}

function showReview() {
    reviewContainer.innerHTML = '';
    testQuestions.forEach((q, i) => {
        const isCorrect = userAnswers[i] === q.answer;
        const item = document.createElement('div');
        item.className = 'review-item';
        item.innerHTML = `
            <div class="review-q-header"><span class="badge">${q.category}</span><span class="review-status ${isCorrect ? 'correct' : 'wrong'}">${isCorrect ? '✓ 答對' : '✗ 答錯'}</span></div>
            <p class="review-q-text">${i + 1}. ${q.question}</p>
            <div class="review-ans-grid">
                <div class="ans-box ans-correct"><span class="ans-label">正確答案</span>${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}</div>
                <div class="ans-box ans-user ${isCorrect ? '' : 'wrong'}"><span class="ans-label">您的選擇</span>${userAnswers[i] !== null ? String.fromCharCode(65 + userAnswers[i]) + '. ' + q.options[userAnswers[i]] : '未作答'}</div>
            </div>
            <div class="explanation-box"><strong>解析：</strong> ${q.explanation}</div>
        `;
        reviewContainer.appendChild(item);
    });
    showScreen(reviewScreen);
}

function showScreen(screen) {
    [startScreen, quizScreen, resultScreen, reviewScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

startBtn.onclick = startQuiz;
nextBtn.onclick = nextQuestion;
restartBtn.onclick = startQuiz;
reviewBtn.onclick = showReview;
backToResultBtn.onclick = () => showScreen(resultScreen);

async function init() {
    try {
        // 優先嘗試從全域變數載入 (支援直接點擊檔案開啟)
        if (window.QUIZ_QUESTIONS && window.QUIZ_QUESTIONS.length > 0) {
            QUESTIONS_DATA = window.QUIZ_QUESTIONS;
            console.log('使用預載入腳本資料。');
        } else {
            // 若全域變數不存在，則嘗試 fetch (支援透過伺服器開啟)
            const response = await fetch('questions.json');
            if (!response.ok) throw new Error('無法讀取 questions.json');
            QUESTIONS_DATA = await response.json();
            console.log('透過 Fetch 載入資料。');
        }
        
        const totalText = document.getElementById('total-questions-text');
        const totalCountDisplay = document.getElementById('total-questions-count');
        if (totalText) totalText.innerText = QUESTIONS_DATA.length;
        if (totalCountDisplay) totalCountDisplay.innerText = `${QUESTIONS_DATA.length} 題`;
        
        console.log('測驗系統初始化完成，題庫共 ' + QUESTIONS_DATA.length + ' 題。');
    } catch (error) {
        console.error('題庫載入失敗：', error);
        alert('題庫載入失敗。請確認專案資料夾中包含 questions.json.js 或 questions.json 檔案，且未被損毀。');
    }
}

init();

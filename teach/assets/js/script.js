// ===================================
// 全域變數
// ===================================
let counter = 0;

// ===================================
// 頁面載入完成後執行
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProgressBar();
    initTabs();
    initCSSDemo();
    initBackToTop();
    highlightCode();
});

// ===================================
// 導航功能
// ===================================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// 進度條
// ===================================
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===================================
// 分頁功能
// ===================================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parent = button.closest('.code-demo');
            const targetId = button.getAttribute('data-tab');

            // 移除所有 active 類別
            parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // 添加 active 到當前元素
            button.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// ===================================
// CSS 互動示範
// ===================================
function initCSSDemo() {
    const textColor = document.getElementById('textColor');
    const fontSize = document.getElementById('fontSize');
    const bgColor = document.getElementById('bgColor');
    const padding = document.getElementById('padding');
    const borderRadius = document.getElementById('borderRadius');
    const previewBox = document.getElementById('cssPreviewBox');
    const generatedCSS = document.getElementById('generatedCSS');

    if (!previewBox) return;

    const updateCSS = () => {
        const colorValue = textColor.value;
        const sizeValue = fontSize.value + 'px';
        const bgValue = bgColor.value;
        const paddingValue = padding.value + 'px';
        const radiusValue = borderRadius.value + 'px';

        // 更新預覽
        previewBox.style.color = colorValue;
        previewBox.style.fontSize = sizeValue;
        previewBox.style.background = bgValue;
        previewBox.style.padding = paddingValue;
        previewBox.style.borderRadius = radiusValue;

        // 更新顯示值
        document.getElementById('fontSizeValue').textContent = sizeValue;
        document.getElementById('paddingValue').textContent = paddingValue;
        document.getElementById('radiusValue').textContent = radiusValue;

        // 更新生成的 CSS
        generatedCSS.textContent = `.element {
    color: ${colorValue};
    font-size: ${sizeValue};
    background: ${bgValue};
    padding: ${paddingValue};
    border-radius: ${radiusValue};
}`;

        // 重新高亮
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(generatedCSS);
        }
    };

    textColor.addEventListener('input', updateCSS);
    fontSize.addEventListener('input', updateCSS);
    bgColor.addEventListener('input', updateCSS);
    padding.addEventListener('input', updateCSS);
    borderRadius.addEventListener('input', updateCSS);
}

// ===================================
// 返回頂部按鈕
// ===================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

// ===================================
// 程式碼高亮
// ===================================
function highlightCode() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

// ===================================
// 滾動到指定區塊
// ===================================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===================================
// 滾動到頂部
// ===================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================================
// 顯示/隱藏答案
// ===================================
function toggleAnswer(answerId) {
    const answerBox = document.getElementById(answerId);
    if (answerBox.classList.contains('show')) {
        answerBox.classList.remove('show');
    } else {
        answerBox.classList.add('show');
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(answerBox);
        }
    }
}

// ===================================
// 表單示範 Alert
// ===================================
function showFormAlert() {
    const input = document.getElementById('demoInput').value;
    const select = document.getElementById('demoSelect').value;
    const radio = document.querySelector('input[name="choice"]:checked');
    const radioValue = radio ? radio.value : '未選擇';

    alert(`表單提交成功！\n\n輸入: ${input}\n下拉: ${select}\n單選: ${radioValue}`);
}

// ===================================
// 打招呼功能
// ===================================
function showGreeting() {
    const name = document.getElementById('greetName').value;
    const result = document.getElementById('greetingResult');

    if (name.trim() === '') {
        result.textContent = '請輸入你的名字！';
        result.style.color = '#E60023';
    } else {
        result.textContent = `你好，${name}！很高興認識你 😊`;
        result.style.color = '#06C755';
    }
}

// ===================================
// 計算總和
// ===================================
function calculateSum() {
    const num1 = parseInt(document.getElementById('num1').value) || 0;
    const num2 = parseInt(document.getElementById('num2').value) || 0;
    document.getElementById('result').textContent = num1 + num2;
}

// ===================================
// 計數器功能
// ===================================
function incrementCounter() {
    counter++;
    updateCounterDisplay();
}

function decrementCounter() {
    counter--;
    updateCounterDisplay();
}

function resetCounter() {
    counter = 0;
    updateCounterDisplay();
}

function updateCounterDisplay() {
    const display = document.getElementById('counterDisplay');
    if (display) {
        display.textContent = counter;

        // 添加動畫效果
        display.style.transform = 'scale(1.2)';
        setTimeout(() => {
            display.style.transform = 'scale(1)';
        }, 200);
    }
}

// ===================================
// 待辦事項功能
// ===================================
function addTodo() {
    const input = document.getElementById('todoInput');
    const list = document.getElementById('todoList');
    const text = input.value.trim();

    if (text === '') {
        alert('請輸入待辦事項！');
        return;
    }

    const li = document.createElement('li');
    li.textContent = text;
    li.onclick = function() {
        if (confirm('確定要刪除這個事項嗎？')) {
            this.style.transform = 'translateX(100%)';
            this.style.opacity = '0';
            setTimeout(() => {
                this.remove();
            }, 300);
        }
    };

    // 添加進入動畫
    li.style.opacity = '0';
    li.style.transform = 'translateX(-100%)';
    list.appendChild(li);

    setTimeout(() => {
        li.style.transition = 'all 0.3s';
        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
    }, 10);

    input.value = '';
    input.focus();
}

// ===================================
// 實戰練習：生成 GAS 程式碼
// ===================================
function generatePracticeCode() {
    const token = document.getElementById('practiceToken').value;
    const sheetId = document.getElementById('practiceSheetId').value;
    const sheetName = document.getElementById('practiceSheetName').value;
    const aiService = document.querySelector('input[name="practiceAI"]:checked').value;

    const gasCode = `// ===================================
// LINE Bot × Google Sheets × ${aiService === 'gemini' ? 'Gemini AI' : 'OpenAI'}
// 學員實作練習版本
// ===================================

// --- LINE Bot 設定 ---
const CHANNEL_ACCESS_TOKEN = '${token}';

// --- Google 試算表設定 ---
const SPREADSHEET_ID = '${sheetId}';
const SHEET_NAME = '${sheetName}';

// --- AI 服務設定 ---
${aiService === 'gemini'
    ? `const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_MODEL = 'gemini-2.5-flash';`
    : `const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const OPENAI_MODEL = 'gpt-4o';`
}

/**
 * 當 LINE Bot 收到訊息時會觸發此函式
 */
function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0];
  const replyToken = event.replyToken;

  if (typeof replyToken === 'undefined') {
    return;
  }

  if (!event.message || event.message.type !== 'text') {
    return;
  }

  const userMessage = event.message.text;

  try {
    const knowledgeBase = getKnowledgeBase();
    const aiResponse = getAiResponse(userMessage, knowledgeBase);
    replyMessage(replyToken, aiResponse);
  } catch (error) {
    console.error("錯誤發生: " + error.toString());
    replyMessage(replyToken, '抱歉，處理您的請求時發生錯誤。');
  }
}

/**
 * 從 Google 試算表讀取知識庫
 */
function getKnowledgeBase() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return "知識庫目前沒有資料。";
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  let knowledgeText = "以下是知識庫資料：\\n\\n";

  data.forEach((row) => {
    if (row[0] && row[1]) {
      knowledgeText += \`問題: \${row[0]}\\n答案: \${row[1]}\\n\\n\`;
    }
  });

  return knowledgeText;
}

/**
 * 呼叫 AI API
 */
function getAiResponse(userInput, context) {
  ${aiService === 'gemini'
    ? `const url = \`https://generativelanguage.googleapis.com/v1beta/models/\${GEMINI_MODEL}:generateContent?key=\${GEMINI_API_KEY}\`;

  const prompt = \`\${context}\\n\\n請用友善的語氣回答：\${userInput}\`;

  const payload = {
    "contents": [{ "parts": [{ "text": prompt }] }],
    "generationConfig": {
      "temperature": 0.3,
      "maxOutputTokens": 2048
    }
  };`
    : `const url = 'https://api.openai.com/v1/chat/completions';

  const payload = {
    "model": OPENAI_MODEL,
    "messages": [
      { "role": "system", "content": context },
      { "role": "user", "content": userInput }
    ],
    "temperature": 0.3,
    "max_tokens": 2048
  };`
  }

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    ${aiService === 'openai' ? `'headers': { 'Authorization': 'Bearer ' + OPENAI_API_KEY },` : ''}
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  const jsonResponse = JSON.parse(response.getContentText());

  ${aiService === 'gemini'
    ? `return jsonResponse.candidates[0].content.parts[0].text.trim();`
    : `return jsonResponse.choices[0].message.content.trim();`
  }
}

/**
 * 回覆訊息到 LINE
 */
function replyMessage(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';

  const payload = {
    'replyToken': replyToken,
    'messages': [{ 'type': 'text', 'text': message }]
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': { 'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  UrlFetchApp.fetch(url, options);
}`;

    // 顯示結果
    document.getElementById('practiceCode').value = gasCode;
    document.getElementById('practiceResult').style.display = 'block';

    // 滾動到結果區
    document.getElementById('practiceResult').scrollIntoView({ behavior: 'smooth' });

    // 高亮程式碼
    if (typeof Prism !== 'undefined') {
        setTimeout(() => {
            Prism.highlightAll();
        }, 100);
    }
}

// ===================================
// 複製練習程式碼
// ===================================
function copyPracticeCode() {
    const code = document.getElementById('practiceCode');
    code.select();
    document.execCommand('copy');

    // 視覺回饋
    const btn = event.target;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> 已複製！';
    btn.style.background = '#4CAF50';

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 2000);
}

// ===================================
// 下載練習程式碼
// ===================================
function downloadPracticeCode() {
    const code = document.getElementById('practiceCode').value;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.download = `LineBot_Practice_${timestamp}.gs`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 視覺回饋
    const btn = event.target;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> 已下載！';
    btn.style.background = '#4CAF50';

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 2000);
}

// ===================================
// 動態添加學習進度追蹤
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // 追蹤用戶閱讀進度
    const sections = document.querySelectorAll('.content-section');
    const pathItems = document.querySelectorAll('.path-item');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateProgress(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    function updateProgress(sectionId) {
        const progressMap = {
            'html-basics': 1,
            'css-basics': 2,
            'js-basics': 3,
            'project': 4,
            'practice': 5
        };

        const step = progressMap[sectionId];
        if (step) {
            pathItems.forEach((item, index) => {
                if (index < step) {
                    item.style.opacity = '1';
                    item.querySelector('.path-icon').style.background =
                        'linear-gradient(135deg, #06C755, #05A644)';
                } else if (index === step - 1) {
                    item.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 300);
                }
            });
        }
    }
});

// ===================================
// 互動式學習功能
// ===================================
class InteractiveLearning {
    constructor() {
        this.completedLessons = new Set();
        this.init();
    }

    init() {
        // 從 localStorage 載入進度
        const saved = localStorage.getItem('learning_progress');
        if (saved) {
            this.completedLessons = new Set(JSON.parse(saved));
        }
    }

    markComplete(lessonId) {
        this.completedLessons.add(lessonId);
        this.save();
        this.updateUI();
    }

    save() {
        localStorage.setItem('learning_progress',
            JSON.stringify([...this.completedLessons]));
    }

    updateUI() {
        const total = 5; // 總共5個章節
        const completed = this.completedLessons.size;
        const percentage = (completed / total * 100).toFixed(0);

        console.log(`學習進度: ${percentage}%`);
    }
}

// 初始化學習追蹤
const learning = new InteractiveLearning();

// ===================================
// Easter Egg: Konami Code
// ===================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                       'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    alert('🎉 恭喜你發現了隱藏彩蛋！你已經是程式高手了！');
    document.body.style.animation = 'rainbow 2s infinite';
}

console.log('%c歡迎來到 LINE Bot 教學！',
    'font-size: 20px; color: #06C755; font-weight: bold;');
console.log('%c試試看輸入 Konami Code: ↑↑↓↓←→←→BA',
    'font-size: 14px; color: #666;');

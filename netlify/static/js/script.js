// ===================================
// 原版 GAS 檔案內容
// ===================================
const ORIGINAL_GAS_CONTENT = `// --- 請修改以下設定 ---

// LINE Bot 的 Channel Access Token
const CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';

// Google AI Studio 的 API 金鑰
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

// Google 試算表的 ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// 知識庫工作表的名稱
const SHEET_NAME = '工作表1'; // 例如: '知識庫' 或 'Q&A'

// --- 設定結束 ---

/**
 * 當 LINE Bot 收到訊息時會觸發此函式
 */
function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0];
  const replyToken = event.replyToken;

  // 如果沒有收到訊息或 replyToken，則不處理
  if (typeof replyToken === 'undefined') {
    return;
  }

  // 檢查是否為文字訊息
  if (!event.message || event.message.type !== 'text') {
    return;
  }

  const userMessage = event.message.text;

  try {
    // 1. 取得 Google 試算表的知識庫內容
    const knowledgeBase = getKnowledgeBase();

    // 2. 呼叫 Google AI 取得回覆
    const aiResponse = getAiResponse(userMessage, knowledgeBase);

    // 3. 回覆訊息到 LINE
    replyMessage(replyToken, aiResponse);

  } catch (error) {
    // 發生錯誤時，在 LINE 中回覆錯誤訊息，並在 GAS Log 中記錄詳細錯誤
    console.error("錯誤發生: " + error.toString());
    replyMessage(replyToken, '抱歉，處理您的請求時發生錯誤。請稍後再試。');
  }
}

/**
 * 從 Google 試算表讀取知識庫
 * @returns {string} 格式化後的知識庫字串
 */
function getKnowledgeBase() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  // 檢查是否有資料（至少要有標題列和一列資料）
  if (lastRow < 2) {
    return "知識庫目前沒有資料。";
  }

  // 假設第一列是標題，例如 "問題", "答案"
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();

  // 將試算表資料轉換為純文字格式，供 AI 讀取
  let knowledgeText = "以下是知識庫資料。請優先使用知識庫中的資訊來回答問題。如果知識庫中完全沒有相關資料，請先說明「目前知識庫無相關資料」，然後仍然要根據你的知識盡力回答使用者的問題。\\n\\n---\\n知識庫內容：\\n";
  data.forEach((row) => {
    // 確保儲存格內容不是空的
    if (row[0] && row[1]) {
      knowledgeText += \`問題範例: \${row[0]}\\n答案: \${row[1]}\\n\\n\`;
    }
  });
  knowledgeText += "---\\n";
  return knowledgeText;
}

/**
 * 呼叫 Google Gemini API
 * @param {string} userInput - 使用者的問題
 * @param {string} context - 從 Google 試算表提供的知識庫內容
 * @returns {string} AI 生成的回覆
 */
function getAiResponse(userInput, context) {
  // ** 使用最新的 Gemini 2.5 Flash 模型 **
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${GEMINI_API_KEY}\`;

  // 建立提示 (Prompt)，結合知識庫和使用者問題
  const prompt = \`\${context}\\n---\\n\\n請用友善、自然的語氣回答以下問題：\\n\\n【回答規則】\\n1. 如果知識庫中有相關資訊，請優先使用知識庫內容回答\\n2. 如果知識庫中完全沒有相關內容，請先說「目前知識庫無相關資料，不過...」，然後根據你的一般知識盡力回答\\n3. 絕對不要說「我無法回答」或「這個問題我無法回答」\\n4. 請保持友善且樂於助人的態度\\n\\n使用者問題：「\${userInput}」\`;

  const payload = {
    "contents": [
      {
        "parts": [
          { "text": prompt }
        ]
      }
    ],
    "generationConfig": {
      "temperature": 0.3, // 降低 temperature 讓模型回答更基於事實
      "topK": 1,
      "topP": 1,
      "maxOutputTokens": 2048
    }
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true // 當 API 回傳錯誤時，不會中斷程式，而是回傳錯誤訊息
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.candidates && jsonResponse.candidates.length > 0 && jsonResponse.candidates[0].content && jsonResponse.candidates[0].content.parts) {
      return jsonResponse.candidates[0].content.parts[0].text.trim();
    } else {
      // API 回應成功，但沒有內容
      return "抱歉，我目前無法回答這個問題，請嘗試其他問法。";
    }
  } else {
    // API 回應錯誤
    console.error(\`API 請求失敗，狀態碼: \${responseCode}, 回應: \${responseBody}\`);
    return \`抱歉，AI 服務暫時無法連線，請稍後再試。(錯誤碼: \${responseCode})\`;
  }
}

/**
 * 回覆訊息到 LINE
 * @param {string} replyToken - 用於回覆訊息的權杖
 * @param {string} message - 要回覆的訊息內容
 */
function replyMessage(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';

  const payload = {
    'replyToken': replyToken,
    'messages': [
      {
        'type': 'text',
        'text': message,
      },
    ],
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    console.error(\`回覆 LINE 失敗: \${response.getContentText()}\`);
  }
}`;

// ===================================
// AI 服務切換
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const aiServiceRadios = document.querySelectorAll('input[name="ai_service"]');
    const geminiConfig = document.getElementById('gemini-config');
    const openaiConfig = document.getElementById('openai-config');

    // 初始化 AI 服務顯示
    updateAiServiceDisplay();

    // 監聽 AI 服務切換
    aiServiceRadios.forEach(radio => {
        radio.addEventListener('change', updateAiServiceDisplay);
    });

    function updateAiServiceDisplay() {
        const selectedService = document.querySelector('input[name="ai_service"]:checked').value;

        if (selectedService === 'gemini') {
            geminiConfig.style.display = 'block';
            openaiConfig.style.display = 'none';
            // 設定必填欄位
            document.getElementById('gemini_api_key').required = true;
            document.getElementById('openai_api_key').required = false;
        } else {
            geminiConfig.style.display = 'none';
            openaiConfig.style.display = 'block';
            // 設定必填欄位
            document.getElementById('gemini_api_key').required = false;
            document.getElementById('openai_api_key').required = true;
        }
    }

    // ===================================
    // 下載原版 GAS 檔案按鈕
    // ===================================
    const downloadOriginalBtn = document.getElementById('download-original-btn');

    downloadOriginalBtn.addEventListener('click', function() {
        // 建立 Blob 物件
        const blob = new Blob([ORIGINAL_GAS_CONTENT], { type: 'text/plain;charset=utf-8' });

        // 建立下載連結
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'LineBot_Sample_Original.gs';

        // 觸發下載
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // 視覺回饋
        const originalText = downloadOriginalBtn.textContent;
        downloadOriginalBtn.textContent = '✅ 已下載原版檔案！';
        downloadOriginalBtn.style.background = '#4CAF50';

        setTimeout(() => {
            downloadOriginalBtn.textContent = originalText;
            downloadOriginalBtn.style.background = '#FFC107';
        }, 2000);
    });

    // ===================================
    // Temperature 滑桿更新
    // ===================================
    const temperatureSlider = document.getElementById('temperature');
    const tempValue = document.getElementById('temp-value');

    temperatureSlider.addEventListener('input', function() {
        tempValue.textContent = this.value;
    });

    // ===================================
    // 表單提交處理
    // ===================================
    const configForm = document.getElementById('configForm');
    const resultSection = document.getElementById('result-section');
    const generatedCode = document.getElementById('generated-code');
    const loading = document.getElementById('loading');

    configForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 收集表單資料
        const formData = {
            channel_access_token: document.getElementById('channel_access_token').value,
            spreadsheet_id: document.getElementById('spreadsheet_id').value,
            sheet_name: document.getElementById('sheet_name').value,
            ai_service: document.querySelector('input[name="ai_service"]:checked').value,
            gemini_api_key: document.getElementById('gemini_api_key').value,
            gemini_model: document.getElementById('gemini_model').value,
            openai_api_key: document.getElementById('openai_api_key').value,
            openai_model: document.getElementById('openai_model').value,
            ai_tone: document.getElementById('ai_tone').value,
            ai_role: document.getElementById('ai_role').value,
            language: document.getElementById('language').value,
            response_format: document.getElementById('response_format').value,
            temperature: document.getElementById('temperature').value,
            max_tokens: document.getElementById('max_tokens').value,
            kb_priority: document.getElementById('kb_priority').value,
            no_data_message: document.getElementById('no_data_message').value
        };

        // 顯示載入動畫
        loading.style.display = 'flex';

        try {
            // 在前端直接生成程式碼（不需要後端）
            const gasCode = generateGasCode(formData);

            // 隱藏載入動畫
            loading.style.display = 'none';

            // 顯示生成的程式碼
            generatedCode.value = gasCode;

            // 隱藏表單，顯示結果
            configForm.style.display = 'none';
            resultSection.style.display = 'block';

            // 滾動到結果區域
            resultSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            loading.style.display = 'none';
            alert('發生錯誤：' + error.message);
        }
    });

    // ===================================
    // 複製程式碼按鈕
    // ===================================
    const copyBtn = document.getElementById('copy-btn');

    copyBtn.addEventListener('click', function() {
        generatedCode.select();
        document.execCommand('copy');

        // 視覺回饋
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ 已複製！';
        copyBtn.style.background = '#4CAF50';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    });

    // ===================================
    // 下載 GS 檔案按鈕
    // ===================================
    const downloadBtn = document.getElementById('download-btn');

    downloadBtn.addEventListener('click', function() {
        // 取得生成的程式碼
        const code = generatedCode.value;

        // 建立 Blob 物件
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });

        // 建立下載連結
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // 設定檔案名稱（包含時間戳記）
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `LineBot_GAS_${timestamp}.gs`;

        // 觸發下載
        document.body.appendChild(link);
        link.click();

        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // 視覺回饋
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = '✅ 已下載！';
        downloadBtn.style.background = '#4CAF50';

        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.style.background = '';
        }, 2000);
    });

    // ===================================
    // 重新設定按鈕
    // ===================================
    const resetBtn = document.getElementById('reset-btn');

    resetBtn.addEventListener('click', function() {
        // 顯示表單，隱藏結果
        configForm.style.display = 'block';
        resultSection.style.display = 'none';

        // 滾動到頁面頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===================================
    // 表單欄位驗證提示
    // ===================================
    const requiredInputs = document.querySelectorAll('input[required], select[required]');

    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#E60023';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#06C755';
            }
        });
    });
});

// ===================================
// GAS 程式碼生成函式
// ===================================
function generateGasCode(config) {
    // 建立 AI 回應風格的 Prompt
    const tonePrompt = `請以${config.ai_tone}的語氣回答`;
    const rolePrompt = `你是${config.ai_role}`;
    const languagePrompt = `請用${config.language}回答`;

    let formatInstructions = "";
    if (config.response_format === '條列式') {
        formatInstructions = "請用條列清晰格式，每段不超過三行。";
    } else if (config.response_format === 'Markdown') {
        formatInstructions = "請使用 Markdown 格式排版。";
    } else if (config.response_format === '簡短扼要') {
        formatInstructions = "請用簡短扼要的方式回答，不超過 100 字。";
    } else {
        formatInstructions = "請用自然的段落形式回答。";
    }

    // 知識庫優先級
    let kbInstruction = "";
    if (config.kb_priority === 'high') {
        kbInstruction = "如果知識庫中有相關資訊，請優先使用知識庫內容回答";
    } else if (config.kb_priority === 'strict') {
        kbInstruction = "請務必只使用知識庫中的資訊回答，不要添加知識庫以外的內容";
    } else {
        kbInstruction = "可以參考知識庫內容，也可以加入你的一般知識來回答";
    }

    // 根據 AI 服務生成不同的程式碼
    if (config.ai_service === 'openai') {
        return generateOpenAIGAS(config, tonePrompt, rolePrompt, languagePrompt, formatInstructions, kbInstruction);
    } else {
        return generateGeminiGAS(config, tonePrompt, rolePrompt, languagePrompt, formatInstructions, kbInstruction);
    }
}

function generateGeminiGAS(config, tonePrompt, rolePrompt, languagePrompt, formatInstructions, kbInstruction) {
    return `// ===================================
// LINE Bot × Google Sheets × Gemini AI
// 由 LINE Bot GAS 生成器自動產生
//
// 作者：曾慶良 阿亮老師
// Facebook: https://www.facebook.com/iddmail
// YouTube: https://www.youtube.com/@Liang-yt02
// 3A科技實驗室：https://www.facebook.com/groups/2754139931432955
// ===================================

// --- LINE Bot 設定 ---
const CHANNEL_ACCESS_TOKEN = '${config.channel_access_token}';

// --- Gemini AI 設定 ---
const GEMINI_API_KEY = '${config.gemini_api_key}';
const GEMINI_MODEL = '${config.gemini_model}';

// --- Google 試算表設定 ---
const SPREADSHEET_ID = '${config.spreadsheet_id}';
const SHEET_NAME = '${config.sheet_name}';

// --- AI 回應風格設定 ---
const AI_TONE = '${config.ai_tone}';
const AI_ROLE = '${config.ai_role}';
const LANGUAGE = '${config.language}';
const TEMPERATURE = ${config.temperature};
const MAX_TOKENS = ${config.max_tokens};
const NO_DATA_MESSAGE = '${config.no_data_message}';

// ===================================
// 主要程式邏輯
// ===================================

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
    replyMessage(replyToken, '抱歉，處理您的請求時發生錯誤。請稍後再試。');
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

  let knowledgeText = "以下是知識庫資料。${kbInstruction}。如果知識庫中完全沒有相關資料，請先說明「${config.no_data_message}」，然後仍然要根據你的知識盡力回答使用者的問題。\\n\\n---\\n知識庫內容：\\n";
  data.forEach((row) => {
    if (row[0] && row[1]) {
      knowledgeText += \`問題範例: \${row[0]}\\n答案: \${row[1]}\\n\\n\`;
    }
  });
  knowledgeText += "---\\n";
  return knowledgeText;
}

/**
 * 呼叫 Gemini API
 */
function getAiResponse(userInput, context) {
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/\${GEMINI_MODEL}:generateContent?key=\${GEMINI_API_KEY}\`;

  const prompt = \`\${context}\\n---\\n\\n${tonePrompt}。${rolePrompt}。${languagePrompt}。${formatInstructions}\\n\\n【回答規則】\\n1. ${kbInstruction}\\n2. 如果知識庫中完全沒有相關內容,請先說「${config.no_data_message}」，然後根據你的一般知識盡力回答\\n3. 絕對不要說「我無法回答」或「這個問題我無法回答」\\n4. 請保持友善且樂於助人的態度\\n\\n使用者問題：「\${userInput}」\`;

  const payload = {
    "contents": [
      {
        "parts": [
          { "text": prompt }
        ]
      }
    ],
    "generationConfig": {
      "temperature": TEMPERATURE,
      "topK": 1,
      "topP": 1,
      "maxOutputTokens": MAX_TOKENS
    }
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.candidates && jsonResponse.candidates.length > 0 && jsonResponse.candidates[0].content && jsonResponse.candidates[0].content.parts) {
      return jsonResponse.candidates[0].content.parts[0].text.trim();
    } else {
      return "抱歉，我目前無法回答這個問題，請嘗試其他問法。";
    }
  } else {
    console.error(\`API 請求失敗，狀態碼: \${responseCode}, 回應: \${responseBody}\`);
    return \`抱歉，AI 服務暫時無法連線，請稍後再試。(錯誤碼: \${responseCode})\`;
  }
}

/**
 * 回覆訊息到 LINE
 */
function replyMessage(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';

  const payload = {
    'replyToken': replyToken,
    'messages': [
      {
        'type': 'text',
        'text': message,
      },
    ],
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    console.error(\`回覆 LINE 失敗: \${response.getContentText()}\`);
  }
}`;
}

function generateOpenAIGAS(config, tonePrompt, rolePrompt, languagePrompt, formatInstructions, kbInstruction) {
    return `// ===================================
// LINE Bot × Google Sheets × OpenAI
// 由 LINE Bot GAS 生成器自動產生
//
// 作者：曾慶良 阿亮老師
// Facebook: https://www.facebook.com/iddmail
// YouTube: https://www.youtube.com/@Liang-yt02
// 3A科技實驗室：https://www.facebook.com/groups/2754139931432955
// ===================================

// --- LINE Bot 設定 ---
const CHANNEL_ACCESS_TOKEN = '${config.channel_access_token}';

// --- OpenAI 設定 ---
const OPENAI_API_KEY = '${config.openai_api_key}';
const OPENAI_MODEL = '${config.openai_model}';

// --- Google 試算表設定 ---
const SPREADSHEET_ID = '${config.spreadsheet_id}';
const SHEET_NAME = '${config.sheet_name}';

// --- AI 回應風格設定 ---
const AI_TONE = '${config.ai_tone}';
const AI_ROLE = '${config.ai_role}';
const LANGUAGE = '${config.language}';
const TEMPERATURE = ${config.temperature};
const MAX_TOKENS = ${config.max_tokens};
const NO_DATA_MESSAGE = '${config.no_data_message}';

// ===================================
// 主要程式邏輯
// ===================================

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
    replyMessage(replyToken, '抱歉，處理您的請求時發生錯誤。請稍後再試。');
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

  let knowledgeText = "以下是知識庫資料。${kbInstruction}。如果知識庫中完全沒有相關資料，請先說明「${config.no_data_message}」，然後仍然要根據你的知識盡力回答使用者的問題。\\n\\n---\\n知識庫內容：\\n";
  data.forEach((row) => {
    if (row[0] && row[1]) {
      knowledgeText += \`問題範例: \${row[0]}\\n答案: \${row[1]}\\n\\n\`;
    }
  });
  knowledgeText += "---\\n";
  return knowledgeText;
}

/**
 * 呼叫 OpenAI API
 */
function getAiResponse(userInput, context) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const systemPrompt = \`\${context}\\n---\\n\\n${rolePrompt}。${languagePrompt}。${formatInstructions}\\n\\n【回答規則】\\n1. ${kbInstruction}\\n2. 如果知識庫中完全沒有相關內容，請先說「${config.no_data_message}」，然後根據你的一般知識盡力回答\\n3. 絕對不要說「我無法回答」或「這個問題我無法回答」\\n4. 請保持友善且樂於助人的態度\\n5. ${tonePrompt}\`;

  const payload = {
    "model": OPENAI_MODEL,
    "messages": [
      {
        "role": "system",
        "content": systemPrompt
      },
      {
        "role": "user",
        "content": userInput
      }
    ],
    "temperature": TEMPERATURE,
    "max_tokens": MAX_TOKENS
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + OPENAI_API_KEY
    },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.choices && jsonResponse.choices.length > 0) {
      return jsonResponse.choices[0].message.content.trim();
    } else {
      return "抱歉，我目前無法回答這個問題，請嘗試其他問法。";
    }
  } else {
    console.error(\`API 請求失敗，狀態碼: \${responseCode}, 回應: \${responseBody}\`);
    return \`抱歉，AI 服務暫時無法連線，請稍後再試。(錯誤碼: \${responseCode})\`;
  }
}

/**
 * 回覆訊息到 LINE
 */
function replyMessage(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';

  const payload = {
    'replyToken': replyToken,
    'messages': [
      {
        'type': 'text',
        'text': message,
      },
    ],
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    console.error(\`回覆 LINE 失敗: \${response.getContentText()}\`);
  }
}`;
}

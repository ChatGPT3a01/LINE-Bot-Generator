// --- 請修改以下設定 ---

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
  let knowledgeText = "以下是知識庫資料。請優先使用知識庫中的資訊來回答問題。如果知識庫中完全沒有相關資料，請先說明「目前知識庫無相關資料」，然後仍然要根據你的知識盡力回答使用者的問題。\n\n---\n知識庫內容：\n";
  data.forEach((row) => {
    // 確保儲存格內容不是空的
    if (row[0] && row[1]) {
      knowledgeText += `問題範例: ${row[0]}\n答案: ${row[1]}\n\n`;
    }
  });
  knowledgeText += "---\n";
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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // 建立提示 (Prompt)，結合知識庫和使用者問題
  const prompt = `${context}\n---\n\n請用友善、自然的語氣回答以下問題：\n\n【回答規則】\n1. 如果知識庫中有相關資訊，請優先使用知識庫內容回答\n2. 如果知識庫中完全沒有相關內容，請先說「目前知識庫無相關資料，不過...」，然後根據你的一般知識盡力回答\n3. 絕對不要說「我無法回答」或「這個問題我無法回答」\n4. 請保持友善且樂於助人的態度\n\n使用者問題：「${userInput}」`;

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
    console.error(`API 請求失敗，狀態碼: ${responseCode}, 回應: ${responseBody}`);
    return `抱歉，AI 服務暫時無法連線，請稍後再試。(錯誤碼: ${responseCode})`;
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
    console.error(`回覆 LINE 失敗: ${response.getContentText()}`);
  }
}
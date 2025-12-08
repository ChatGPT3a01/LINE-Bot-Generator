"""
LINE Bot GAS 程式碼生成器
作者：曾慶良 阿亮老師

Facebook: https://www.facebook.com/iddmail
YouTube: https://www.youtube.com/@Liang-yt02
3A科技實驗室：https://www.facebook.com/groups/2754139931432955
"""

from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

@app.route('/')
def index():
    """主頁面 - 顯示設定表單"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_gas():
    """接收表單資料，生成客製化的 GAS 程式碼"""
    try:
        data = request.json

        # 基本設定
        channel_access_token = data.get('channel_access_token', '')
        spreadsheet_id = data.get('spreadsheet_id', '')
        sheet_name = data.get('sheet_name', '工作表1')

        # AI 服務選擇
        ai_service = data.get('ai_service', 'gemini')  # 'gemini' or 'openai'

        # Gemini 設定
        gemini_api_key = data.get('gemini_api_key', '')
        gemini_model = data.get('gemini_model', 'gemini-2.5-flash')

        # OpenAI 設定
        openai_api_key = data.get('openai_api_key', '')
        openai_model = data.get('openai_model', 'gpt-4o')

        # AI 回應風格設定
        ai_tone = data.get('ai_tone', '友善、自然')
        ai_role = data.get('ai_role', 'AI 助理')
        language = data.get('language', '繁體中文')
        response_format = data.get('response_format', '自然段落')

        # 進階參數
        temperature = float(data.get('temperature', 0.3))
        max_tokens = int(data.get('max_tokens', 2048))

        # 知識庫設定
        kb_priority = data.get('kb_priority', 'high')
        no_data_message = data.get('no_data_message', '目前知識庫無相關資料，不過...')

        # 生成 GAS 程式碼
        gas_code = generate_gas_code(
            channel_access_token=channel_access_token,
            spreadsheet_id=spreadsheet_id,
            sheet_name=sheet_name,
            ai_service=ai_service,
            gemini_api_key=gemini_api_key,
            gemini_model=gemini_model,
            openai_api_key=openai_api_key,
            openai_model=openai_model,
            ai_tone=ai_tone,
            ai_role=ai_role,
            language=language,
            response_format=response_format,
            temperature=temperature,
            max_tokens=max_tokens,
            kb_priority=kb_priority,
            no_data_message=no_data_message
        )

        return jsonify({
            'success': True,
            'gas_code': gas_code
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


def generate_gas_code(**config):
    """根據設定生成 GAS 程式碼"""

    # 建立 AI 回應風格的 Prompt
    tone_prompt = f"請以{config['ai_tone']}的語氣回答"
    role_prompt = f"你是{config['ai_role']}"
    language_prompt = f"請用{config['language']}回答"

    format_instructions = ""
    if config['response_format'] == '條列式':
        format_instructions = "請用條列清晰格式，每段不超過三行。"
    elif config['response_format'] == 'Markdown':
        format_instructions = "請使用 Markdown 格式排版。"
    elif config['response_format'] == '簡短扼要':
        format_instructions = "請用簡短扼要的方式回答，不超過 100 字。"
    else:
        format_instructions = "請用自然的段落形式回答。"

    # 知識庫優先級
    if config['kb_priority'] == 'high':
        kb_instruction = "如果知識庫中有相關資訊，請優先使用知識庫內容回答"
    elif config['kb_priority'] == 'strict':
        kb_instruction = "請務必只使用知識庫中的資訊回答，不要添加知識庫以外的內容"
    else:
        kb_instruction = "可以參考知識庫內容，也可以加入你的一般知識來回答"

    # 根據 AI 服務生成不同的程式碼
    if config['ai_service'] == 'openai':
        gas_code = generate_openai_gas(config, tone_prompt, role_prompt, language_prompt, format_instructions, kb_instruction)
    else:
        gas_code = generate_gemini_gas(config, tone_prompt, role_prompt, language_prompt, format_instructions, kb_instruction)

    return gas_code


def generate_gemini_gas(config, tone_prompt, role_prompt, language_prompt, format_instructions, kb_instruction):
    """生成 Gemini 版本的 GAS 程式碼"""

    return f"""// ===================================
// LINE Bot × Google Sheets × Gemini AI
// 由 LINE Bot GAS 生成器自動產生
//
// 作者：曾慶良 阿亮老師
// Facebook: https://www.facebook.com/iddmail
// YouTube: https://www.youtube.com/@Liang-yt02
// 3A科技實驗室：https://www.facebook.com/groups/2754139931432955
// ===================================

// --- LINE Bot 設定 ---
const CHANNEL_ACCESS_TOKEN = '{config['channel_access_token']}';

// --- Gemini AI 設定 ---
const GEMINI_API_KEY = '{config['gemini_api_key']}';
const GEMINI_MODEL = '{config['gemini_model']}';

// --- Google 試算表設定 ---
const SPREADSHEET_ID = '{config['spreadsheet_id']}';
const SHEET_NAME = '{config['sheet_name']}';

// --- AI 回應風格設定 ---
const AI_TONE = '{config['ai_tone']}';
const AI_ROLE = '{config['ai_role']}';
const LANGUAGE = '{config['language']}';
const TEMPERATURE = {config['temperature']};
const MAX_TOKENS = {config['max_tokens']};
const NO_DATA_MESSAGE = '{config['no_data_message']}';

// ===================================
// 主要程式邏輯
// ===================================

/**
 * 當 LINE Bot 收到訊息時會觸發此函式
 */
function doPost(e) {{
  const event = JSON.parse(e.postData.contents).events[0];
  const replyToken = event.replyToken;

  if (typeof replyToken === 'undefined') {{
    return;
  }}

  if (!event.message || event.message.type !== 'text') {{
    return;
  }}

  const userMessage = event.message.text;

  try {{
    const knowledgeBase = getKnowledgeBase();
    const aiResponse = getAiResponse(userMessage, knowledgeBase);
    replyMessage(replyToken, aiResponse);
  }} catch (error) {{
    console.error("錯誤發生: " + error.toString());
    replyMessage(replyToken, '抱歉，處理您的請求時發生錯誤。請稍後再試。');
  }}
}}

/**
 * 從 Google 試算表讀取知識庫
 */
function getKnowledgeBase() {{
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {{
    return "知識庫目前沒有資料。";
  }}

  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();

  let knowledgeText = "以下是知識庫資料。{kb_instruction}。如果知識庫中完全沒有相關資料，請先說明「{config['no_data_message']}」，然後仍然要根據你的知識盡力回答使用者的問題。\\n\\n---\\n知識庫內容：\\n";
  data.forEach((row) => {{
    if (row[0] && row[1]) {{
      knowledgeText += `問題範例: ${{row[0]}}\\n答案: ${{row[1]}}\\n\\n`;
    }}
  }});
  knowledgeText += "---\\n";
  return knowledgeText;
}}

/**
 * 呼叫 Gemini API
 */
function getAiResponse(userInput, context) {{
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${{GEMINI_MODEL}}:generateContent?key=${{GEMINI_API_KEY}}`;

  const prompt = `${{context}}\\n---\\n\\n{tone_prompt}。{role_prompt}。{language_prompt}。{format_instructions}\\n\\n【回答規則】\\n1. {kb_instruction}\\n2. 如果知識庫中完全沒有相關內容,請先說「{config['no_data_message']}」，然後根據你的一般知識盡力回答\\n3. 絕對不要說「我無法回答」或「這個問題我無法回答」\\n4. 請保持友善且樂於助人的態度\\n\\n使用者問題：「${{userInput}}」`;

  const payload = {{
    "contents": [
      {{
        "parts": [
          {{ "text": prompt }}
        ]
      }}
    ],
    "generationConfig": {{
      "temperature": TEMPERATURE,
      "topK": 1,
      "topP": 1,
      "maxOutputTokens": MAX_TOKENS
    }}
  }};

  const options = {{
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  }};

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {{
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.candidates && jsonResponse.candidates.length > 0 && jsonResponse.candidates[0].content && jsonResponse.candidates[0].content.parts) {{
      return jsonResponse.candidates[0].content.parts[0].text.trim();
    }} else {{
      return "抱歉，我目前無法回答這個問題，請嘗試其他問法。";
    }}
  }} else {{
    console.error(`API 請求失敗，狀態碼: ${{responseCode}}, 回應: ${{responseBody}}`);
    return `抱歉，AI 服務暫時無法連線，請稍後再試。(錯誤碼: ${{responseCode}})`;
  }}
}}

/**
 * 回覆訊息到 LINE
 */
function replyMessage(replyToken, message) {{
  const url = 'https://api.line.me/v2/bot/message/reply';

  const payload = {{
    'replyToken': replyToken,
    'messages': [
      {{
        'type': 'text',
        'text': message,
      }},
    ],
  }};

  const options = {{
    'method': 'post',
    'contentType': 'application/json',
    'headers': {{
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    }},
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  }};

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {{
    console.error(`回覆 LINE 失敗: ${{response.getContentText()}}`);
  }}
}}
"""


def generate_openai_gas(config, tone_prompt, role_prompt, language_prompt, format_instructions, kb_instruction):
    """生成 OpenAI 版本的 GAS 程式碼"""

    return f"""// ===================================
// LINE Bot × Google Sheets × OpenAI
// 由 LINE Bot GAS 生成器自動產生
//
// 作者：曾慶良 阿亮老師
// Facebook: https://www.facebook.com/iddmail
// YouTube: https://www.youtube.com/@Liang-yt02
// 3A科技實驗室：https://www.facebook.com/groups/2754139931432955
// ===================================

// --- LINE Bot 設定 ---
const CHANNEL_ACCESS_TOKEN = '{config['channel_access_token']}';

// --- OpenAI 設定 ---
const OPENAI_API_KEY = '{config['openai_api_key']}';
const OPENAI_MODEL = '{config['openai_model']}';

// --- Google 試算表設定 ---
const SPREADSHEET_ID = '{config['spreadsheet_id']}';
const SHEET_NAME = '{config['sheet_name']}';

// --- AI 回應風格設定 ---
const AI_TONE = '{config['ai_tone']}';
const AI_ROLE = '{config['ai_role']}';
const LANGUAGE = '{config['language']}';
const TEMPERATURE = {config['temperature']};
const MAX_TOKENS = {config['max_tokens']};
const NO_DATA_MESSAGE = '{config['no_data_message']}';

// ===================================
// 主要程式邏輯
// ===================================

/**
 * 當 LINE Bot 收到訊息時會觸發此函式
 */
function doPost(e) {{
  const event = JSON.parse(e.postData.contents).events[0];
  const replyToken = event.replyToken;

  if (typeof replyToken === 'undefined') {{
    return;
  }}

  if (!event.message || event.message.type !== 'text') {{
    return;
  }}

  const userMessage = event.message.text;

  try {{
    const knowledgeBase = getKnowledgeBase();
    const aiResponse = getAiResponse(userMessage, knowledgeBase);
    replyMessage(replyToken, aiResponse);
  }} catch (error) {{
    console.error("錯誤發生: " + error.toString());
    replyMessage(replyToken, '抱歉，處理您的請求時發生錯誤。請稍後再試。');
  }}
}}

/**
 * 從 Google 試算表讀取知識庫
 */
function getKnowledgeBase() {{
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {{
    return "知識庫目前沒有資料。";
  }}

  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();

  let knowledgeText = "以下是知識庫資料。{kb_instruction}。如果知識庫中完全沒有相關資料，請先說明「{config['no_data_message']}」，然後仍然要根據你的知識盡力回答使用者的問題。\\n\\n---\\n知識庫內容：\\n";
  data.forEach((row) => {{
    if (row[0] && row[1]) {{
      knowledgeText += `問題範例: ${{row[0]}}\\n答案: ${{row[1]}}\\n\\n`;
    }}
  }});
  knowledgeText += "---\\n";
  return knowledgeText;
}}

/**
 * 呼叫 OpenAI API
 */
function getAiResponse(userInput, context) {{
  const url = 'https://api.openai.com/v1/chat/completions';

  const systemPrompt = `${{context}}\\n---\\n\\n{role_prompt}。{language_prompt}。{format_instructions}\\n\\n【回答規則】\\n1. {kb_instruction}\\n2. 如果知識庫中完全沒有相關內容，請先說「{config['no_data_message']}」，然後根據你的一般知識盡力回答\\n3. 絕對不要說「我無法回答」或「這個問題我無法回答」\\n4. 請保持友善且樂於助人的態度\\n5. {tone_prompt}`;

  const payload = {{
    "model": OPENAI_MODEL,
    "messages": [
      {{
        "role": "system",
        "content": systemPrompt
      }},
      {{
        "role": "user",
        "content": userInput
      }}
    ],
    "temperature": TEMPERATURE,
    "max_tokens": MAX_TOKENS
  }};

  const options = {{
    'method': 'post',
    'contentType': 'application/json',
    'headers': {{
      'Authorization': 'Bearer ' + OPENAI_API_KEY
    }},
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  }};

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {{
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.choices && jsonResponse.choices.length > 0) {{
      return jsonResponse.choices[0].message.content.trim();
    }} else {{
      return "抱歉，我目前無法回答這個問題，請嘗試其他問法。";
    }}
  }} else {{
    console.error(`API 請求失敗，狀態碼: ${{responseCode}}, 回應: ${{responseBody}}`);
    return `抱歉，AI 服務暫時無法連線，請稍後再試。(錯誤碼: ${{responseCode}})`;
  }}
}}

/**
 * 回覆訊息到 LINE
 */
function replyMessage(replyToken, message) {{
  const url = 'https://api.line.me/v2/bot/message/reply';

  const payload = {{
    'replyToken': replyToken,
    'messages': [
      {{
        'type': 'text',
        'text': message,
      }},
    ],
  }};

  const options = {{
    'method': 'post',
    'contentType': 'application/json',
    'headers': {{
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    }},
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  }};

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {{
    console.error(`回覆 LINE 失敗: ${{response.getContentText()}}`);
  }}
}}
"""


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8806, debug=True)

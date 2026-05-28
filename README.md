# LINE Bot 智慧客服生成器

> 一個簡單易用的本地端網頁工具，讓你輕鬆客製化 LINE Bot 的 Google Apps Script 程式碼

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📊 完整簡報連結

👉 **[點擊查看本章完整簡報](https://chatgpt3a01.github.io/LINE-Bot-Generator/slides/index.html)**

---

## 📖 本章節 Part 說明

本章節分為以下六個部分，循序漸進帶你建立專屬的 LINE Bot：

| Part | 主題 | 說明 |
|------|------|------|
| **Part 1** | LINE Bot 簡介與應用情境 | 了解 LINE Bot 的運作原理、應用價值與本工具的設計理念 |
| **Part 2** | 系統需求與環境建置 | 安裝 Python、Flask，啟動本地端生成器 |
| **Part 3** | 基本設定與 AI 服務選擇 | 設定 LINE Token、試算表 ID，選擇 Gemini 或 OpenAI |
| **Part 4** | AI 回應風格與知識庫設定 | 自訂語氣風格、角色定位、知識庫優先級 |
| **Part 5** | 程式碼生成與 GAS 部署 | 生成客製化程式碼，部署到 Google Apps Script |
| **Part 6** | 測試與進階應用 | LINE Webhook 設定、對話測試、實務應用案例 |

---

## ✨ 功能特色

- **雙 AI 服務支援**：支援 Google Gemini 和 OpenAI GPT
- **完整客製化**：語氣、角色、回答格式等多項設定
- **友善介面**：直覺的網頁表單，無需程式背景
- **即時生成**：按下按鈕立即產生可用的 GAS 程式碼
- **本地端執行**：資料不上傳，安全有保障

---

## 📥 專案下載方式

### 方法一：使用 Git Clone（推薦）

```bash
git clone https://github.com/ChatGPT3a01/LINE-Bot-Generator.git
cd LINE-Bot-Generator
```

### 方法二：下載 ZIP 檔案

1. 點擊本頁面右上方的 **Code** 按鈕
2. 選擇 **Download ZIP**
3. 解壓縮到你想要的資料夾

---

## 📋 系統需求

- Python 3.7 或以上版本
- pip（Python 套件管理工具）

---

## 🔧 安裝方式（Installation）

### 步驟 1：建立虛擬環境

#### Windows 使用者
```bash
# 雙擊執行 setup_venv.bat
# 或手動執行以下指令
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

#### macOS / Linux 使用者
```bash
# 執行 setup_venv.sh
# 或手動執行以下指令
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 步驟 2：啟動應用程式

#### Windows
```bash
# 雙擊執行 start.bat
# 或手動執行
venv\Scripts\activate
python app.py
```

#### macOS / Linux
```bash
# 執行 start.sh
# 或手動執行
source venv/bin/activate
python app.py
```

### 步驟 3：開啟瀏覽器

在瀏覽器中輸入以下網址：
```
http://localhost:8806
```

---

## 🚀 佈署流程（Deployment）

完成程式碼生成後，請依照以下步驟部署到 Google Apps Script：

### 1️⃣ 前往 Google Apps Script
- 開啟 [Google Apps Script](https://script.google.com)
- 點擊「新專案」建立空白腳本

### 2️⃣ 貼上生成的程式碼
- 刪除預設的範例程式碼
- 將生成器產生的程式碼貼上
- 按 `Ctrl+S` 儲存

### 3️⃣ 部署為網路應用程式
- 點擊右上角「部署」→「新增部署作業」
- 類型選擇「網路應用程式」
- 執行身分：「我」
- 具有存取權的使用者：「所有人」
- 點擊「部署」並複製網址

### 4️⃣ 設定 LINE Webhook
- 前往 [LINE Developers Console](https://developers.line.biz/)
- 選擇你的 Channel → Messaging API
- 在 Webhook URL 貼上 GAS 網址
- 開啟「Use webhook」
- 關閉「Auto-reply messages」

### 5️⃣ 測試對話
- 用 LINE 掃描 Bot 的 QR Code 加入好友
- 發送訊息測試 Bot 回應

---

## 📚 教學補充

### 技術架構

本系統採用三層式架構：

```
┌─────────────────────────────────────────┐
│          本地端生成器 (Flask)            │
│    - 視覺化設定介面                      │
│    - 客製化程式碼生成                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       雲端執行層 (Google Apps Script)    │
│    - 接收 LINE Webhook                   │
│    - 查詢知識庫                          │
│    - 呼叫 AI API                         │
│    - 回覆訊息                            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           資料與服務層                   │
│    - LINE Messaging API                  │
│    - Google Sheets (知識庫)              │
│    - Gemini / OpenAI API                 │
└─────────────────────────────────────────┘
```

### AI 模型選擇建議

| 模型 | 優勢 | 適用場景 |
|------|------|----------|
| **Gemini 2.5 Flash** | 快速、經濟、繁體中文佳 | 一般客服對話 |
| **Gemini 2.5 Pro** | 理解力強、推理佳 | 複雜問答 |
| **GPT-5.5** | 邏輯推理、英文佳 | 技術支援 |
| **GPT-5.5** | 進階理解力 | 專業諮詢 |
| **GPT-5.5** | 最新最強 | 高階應用 |

### Temperature 參數說明

- **0.1 - 0.3**：穩定保守，適合客服機器人
- **0.4 - 0.6**：平衡創意與穩定
- **0.7 - 0.9**：創意多變，適合聊天夥伴

### 知識庫優先級說明

- **高**：優先使用知識庫，找不到才補充 AI 知識
- **嚴格**：只使用知識庫內容，不添加額外資訊
- **平衡**：靈活參考知識庫，可加入 AI 知識

---

## 🗂️ 專案結構

```
LINE-Bot-Generator/
│
├── app.py                    # Flask 主程式
├── requirements.txt          # Python 套件需求
├── .gitignore               # Git 忽略檔案
├── README.md                # 專案說明文件
│
├── setup_venv.bat           # Windows 環境設定
├── start.bat                # Windows 啟動腳本
├── setup_venv.sh            # macOS/Linux 環境設定
├── start.sh                 # macOS/Linux 啟動腳本
│
├── templates/
│   └── index.html           # 主頁面 HTML
│
├── static/
│   ├── css/
│   │   └── style.css        # 樣式檔案
│   ├── js/
│   │   └── script.js        # JavaScript 互動邏輯
│   └── sample.gs            # GAS 範例檔案
│
├── slides/                  # 簡報檔案
│   ├── index.html           # 統整頁
│   └── part1~6.html         # 分段簡報
│
├── netlify/                 # Netlify 部署範例
│   └── ...
│
└── teach/                   # 教學網頁
    └── ...
```

---

## 🎯 支援的 AI 模型

### Google Gemini
- **Gemini 2.5 Flash**：快速、經濟，適合一般對話
- **Gemini 2.5 Pro**：進階、強大，適合複雜任務
- **Gemini 3.0 Flash**：新一代快速模型
- **Gemini 3.0 Pro**：新一代專業模型

### OpenAI GPT
- **GPT-5.5**：標準版，平衡效能與成本
- **GPT-5.5**：進階版，更佳理解力
- **GPT-5.5**：高速版本
- **GPT-5.5**：最新版，最強大的語言模型

---

## ❓ 常見問題

### Q: 我的 API Key 會被儲存嗎？
A: 不會。所有資料都在本地端處理，不會上傳到任何伺服器。

### Q: 部署後 LINE Bot 沒有回應？
A: 請檢查：
1. Webhook URL 是否正確設定（結尾要有 `/exec`）
2. LINE Bot 的「Use webhooks」是否已開啟
3. 「Auto-reply messages」是否已關閉
4. API Keys 是否有效

### Q: 如何取得各種 API Key？
- **LINE Token**：[LINE Developers Console](https://developers.line.biz/)
- **Gemini API**：[Google AI Studio](https://aistudio.google.com/apikey)
- **OpenAI API**：[OpenAI Platform](https://platform.openai.com/api-keys)

---

## 👨‍🏫 作者資訊

**曾慶良 阿亮老師**

### 📱 社群連結

- **Facebook**：[https://www.facebook.com/iddmail](https://www.facebook.com/iddmail)
- **YouTube**：[https://www.youtube.com/@Liang-yt02](https://www.youtube.com/@Liang-yt02)
- **3A科技實驗室**：[Facebook 社團](https://www.facebook.com/groups/2754139931432955)

歡迎訂閱 YouTube 頻道、追蹤 Facebook，並加入 3A科技實驗室社團，與更多 AI 開發者交流學習！

---

## 📄 授權

MIT License - 可自由使用、修改與分享

---

© 2026 自己架設 AI - 零基礎到大師 | Made with 曾慶良(阿亮老師) ❤️

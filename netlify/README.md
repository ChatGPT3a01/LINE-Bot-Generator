# LINE Bot GAS 生成器 - Netlify 部署指南

這個資料夾包含了可以直接部署到 Netlify 的靜態網站版本。

## 🚀 部署方式

### 方式一：透過 Netlify 網頁介面（最簡單）

1. 前往 [Netlify](https://app.netlify.com/)
2. 登入或註冊帳號
3. 點擊「Add new site」→「Deploy manually」
4. 將整個 `netlify` 資料夾拖放到上傳區域
5. 等待部署完成
6. 在 Site settings 中可以自訂網站名稱為 `line-ai-prompt`

### 方式二：使用 Netlify CLI

```bash
# 進入 netlify 資料夾
cd netlify

# 登入 Netlify（首次使用）
netlify login

# 部署網站
netlify deploy --prod

# 按照提示選擇：
# 1. Create & configure a new project
# 2. 輸入網站名稱：line-ai-prompt
# 3. 確認部署目錄：. (當前目錄)
```

### 方式三：連接 GitHub 自動部署

1. 將這個專案推送到 GitHub
2. 在 Netlify 選擇「Import from Git」
3. 選擇您的 GitHub 儲存庫
4. 設定：
   - Base directory: `netlify`
   - Build command: (留空)
   - Publish directory: `.`
5. 點擊「Deploy site」

## 📁 檔案結構

```
netlify/
├── index.html          # 主頁面
├── static/
│   ├── css/
│   │   └── style.css   # 樣式表
│   └── js/
│       └── script.js   # JavaScript 邏輯
├── netlify.toml        # Netlify 配置檔
└── README.md           # 本說明文件
```

## ✨ 功能特色

- ✅ 完全靜態網站，無需後端伺服器
- ✅ 支援 Gemini 和 OpenAI 雙 AI 服務
- ✅ 可下載生成的 .gs 檔案
- ✅ 響應式設計，支援手機和桌面
- ✅ 即時預覽和複製功能

## 🌐 部署後的網址

部署完成後，您的網站將可以在以下網址訪問：
- `https://line-ai-prompt.netlify.app`

或 Netlify 自動生成的網址：
- `https://[random-name].netlify.app`

## 📝 注意事項

1. 所有程式碼生成都在瀏覽器端完成，無需後端伺服器
2. 使用者輸入的 API Keys 不會被儲存或傳送到任何伺服器
3. 生成的 GAS 程式碼可以直接複製或下載使用

## 👨‍💻 作者資訊

- 作者：曾慶良 阿亮老師
- Facebook: https://www.facebook.com/iddmail
- YouTube: https://www.youtube.com/@Liang-yt02
- 3A科技實驗室：https://www.facebook.com/groups/2754139931432955

---

祝您部署順利！ 🎉

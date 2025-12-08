# 🚀 Netlify 部署指南

## 方法一：拖放部署（最快！30秒完成）

### 步驟 1：開啟 Netlify Drop
**已為您開啟瀏覽器！** 如果沒有自動開啟，請訪問：
👉 https://app.netlify.com/drop

### 步驟 2：拖放資料夾
1. 打開檔案總管
2. 找到 `netlify` 資料夾
3. **將整個 `netlify` 資料夾拖放到瀏覽器頁面上**

### 步驟 3：等待上傳
- 上傳時間：約 10-20 秒
- 會顯示上傳進度

### 步驟 4：自訂網域名稱
1. 上傳完成後，點擊 **"Site settings"**
2. 找到 **"Site information"** 區塊
3. 點擊 **"Change site name"**
4. 輸入：**line-ai-prompt**
5. 點擊 **"Save"**

### 步驟 5：完成！🎉
您的網站網址：
```
https://line-ai-prompt.netlify.app
```

---

## 方法二：使用命令列（進階）

### 前置準備
```bash
# 確認已登入 Netlify
netlify login
```

### 部署指令
```bash
cd netlify

# 建立新站點並部署
netlify init

# 選擇選項：
# 1. Create & configure a new site
# 2. 選擇你的團隊
# 3. 輸入網站名稱：line-ai-prompt
# 4. Build command: (留空，直接 Enter)
# 5. Directory to deploy: . (輸入一個點)

# 部署到生產環境
netlify deploy --prod
```

---

## 方法三：連接 GitHub（自動部署）

### 步驟 1：推送到 GitHub
```bash
cd netlify
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的帳號/line-ai-prompt.git
git push -u origin main
```

### 步驟 2：在 Netlify 連接
1. 前往 https://app.netlify.com
2. 點擊 **"Add new site"** → **"Import an existing project"**
3. 選擇 **"GitHub"**
4. 選擇您的儲存庫
5. 設定：
   - Base directory: `netlify`
   - Build command: (留空)
   - Publish directory: `.`
6. 點擊 **"Deploy site"**

---

## 🎯 快速部署（推薦！）

### 使用提供的批次檔
雙擊執行：
```
netlify/立即部署.bat
```

會自動：
1. 開啟 Netlify Drop 頁面
2. 顯示部署步驟提示

---

## ✅ 部署檢查清單

部署前確認：
- [ ] `netlify` 資料夾包含所有檔案
- [ ] `index.html` 在根目錄
- [ ] `static/css/style.css` 存在
- [ ] `static/js/script.js` 存在
- [ ] `netlify.toml` 配置正確

部署後測試：
- [ ] 網站可以正常開啟
- [ ] 表單可以填寫
- [ ] 生成程式碼功能正常
- [ ] 下載原版按鈕可用
- [ ] 下載客製化檔案可用
- [ ] 複製功能正常
- [ ] CSS 樣式正確載入
- [ ] JavaScript 功能運作

---

## 🔧 常見問題

### Q: 拖放後沒反應？
A: 確認：
1. 是否拖放整個資料夾（不是單個檔案）
2. 瀏覽器是否為 Chrome/Firefox/Edge
3. 重新整理頁面後再試

### Q: 網址顯示 404 錯誤？
A: 檢查：
1. `netlify.toml` 檔案是否存在
2. Publish directory 是否設為 `.`
3. 重新部署一次

### Q: 樣式跑掉了？
A: 確認：
1. `static/css/style.css` 檔案路徑正確
2. HTML 中的 CSS 引用路徑：`static/css/style.css`
3. 檢查瀏覽器 Console 是否有 404 錯誤

### Q: 按鈕點擊沒反應？
A: 檢查：
1. `static/js/script.js` 是否載入
2. 瀏覽器 Console 是否有 JavaScript 錯誤
3. 確認 HTML 中的 JS 引用路徑正確

### Q: 如何更新網站？
A:
1. 修改 `netlify` 資料夾中的檔案
2. 重新拖放整個資料夾到 Netlify Drop
3. 或使用 `netlify deploy --prod` 指令

---

## 📱 部署完成後

### 分享您的網站
```
https://line-ai-prompt.netlify.app
```

### 測試功能
1. 開啟網站
2. 點擊「下載原版 GAS 檔案」
3. 填寫表單並生成程式碼
4. 測試複製和下載功能

### 監控流量
1. 登入 Netlify Dashboard
2. 查看網站訪問統計
3. 監控錯誤日誌

---

## 🎉 恭喜！

您的 LINE Bot GAS 生成器已經上線了！

現在任何人都可以訪問：
👉 **https://line-ai-prompt.netlify.app**

快分享給朋友使用吧！ 🚀

---

## 📞 需要協助？

- **Facebook**: https://www.facebook.com/iddmail
- **YouTube**: https://www.youtube.com/@Liang-yt02
- **社群**: https://www.facebook.com/groups/2754139931432955

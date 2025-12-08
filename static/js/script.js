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
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // 隱藏載入動畫
            loading.style.display = 'none';

            if (result.success) {
                // 顯示生成的程式碼
                generatedCode.value = result.gas_code;

                // 隱藏表單，顯示結果
                configForm.style.display = 'none';
                resultSection.style.display = 'block';

                // 滾動到結果區域
                resultSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('生成失敗：' + result.error);
            }
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

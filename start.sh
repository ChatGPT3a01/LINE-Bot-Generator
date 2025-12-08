#!/bin/bash

echo "========================================"
echo "  LINE Bot GAS 程式碼生成器"
echo "  正在啟動伺服器..."
echo "========================================"
echo ""

# 檢查虛擬環境是否存在
if [ ! -f "venv/bin/activate" ]; then
    echo "[錯誤] 找不到虛擬環境！"
    echo ""
    echo "請先執行 ./setup_venv.sh 建立虛擬環境"
    echo ""
    exit 1
fi

# 啟動虛擬環境
source venv/bin/activate
echo "✓ 虛擬環境已啟動"
echo ""

# 啟動 Flask 應用
python app.py

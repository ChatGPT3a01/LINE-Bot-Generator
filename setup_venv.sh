#!/bin/bash

echo "========================================"
echo "  LINE Bot GAS 生成器 - 環境設定"
echo "========================================"
echo ""

echo "正在建立虛擬環境..."
python3 -m venv venv
echo ""
echo "✓ 虛擬環境建立完成！"
echo ""

echo "正在啟動虛擬環境..."
source venv/bin/activate
echo ""
echo "✓ 虛擬環境已啟動！"
echo ""

echo "正在安裝必要套件..."
pip install -r requirements.txt
echo ""

echo "========================================"
echo "  ✓ 安裝完成！"
echo "========================================"
echo ""
echo "下次啟動請執行：./start.sh"
echo ""

@echo off
chcp 65001 >nul
echo ========================================
echo   LINE Bot GAS 程式碼生成器
echo   正在啟動伺服器...
echo ========================================
echo.

REM 檢查虛擬環境是否存在
if not exist "venv\Scripts\activate.bat" (
    echo [錯誤] 找不到虛擬環境！
    echo.
    echo 請先執行 setup_venv.bat 建立虛擬環境
    echo.
    pause
    exit /b 1
)

REM 啟動虛擬環境
call venv\Scripts\activate.bat
echo ✓ 虛擬環境已啟動
echo.

REM 啟動 Flask 應用
python app.py

pause

#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
環境檢查腳本
檢查 Python 版本、必要套件是否已安裝
"""

import sys
import platform

def check_python_version():
    """檢查 Python 版本"""
    print("=" * 50)
    print("正在檢查 Python 環境...")
    print("=" * 50)
    print()

    version = sys.version_info
    print(f"✓ Python 版本: {version.major}.{version.minor}.{version.micro}")

    if version.major >= 3 and version.minor >= 7:
        print("  ✓ Python 版本符合需求（3.7+）")
    else:
        print("  ✗ Python 版本過舊，需要 3.7 或以上版本")
        return False

    print(f"✓ 作業系統: {platform.system()} {platform.release()}")
    print()
    return True

def check_packages():
    """檢查必要套件"""
    print("正在檢查必要套件...")
    print("-" * 50)

    required_packages = {
        'flask': 'Flask',
    }

    all_installed = True

    for module_name, package_name in required_packages.items():
        try:
            __import__(module_name)
            print(f"✓ {package_name:20s} 已安裝")
        except ImportError:
            print(f"✗ {package_name:20s} 未安裝")
            all_installed = False

    print()

    if all_installed:
        print("✓ 所有必要套件已安裝完成！")
    else:
        print("✗ 部分套件尚未安裝")
        print()
        print("請執行以下指令安裝：")
        print("  pip install -r requirements.txt")

    return all_installed

def check_files():
    """檢查必要檔案"""
    import os

    print()
    print("正在檢查專案檔案...")
    print("-" * 50)

    required_files = [
        'app.py',
        'requirements.txt',
        'templates/index.html',
        'static/css/style.css',
        'static/js/script.js'
    ]

    all_exists = True

    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✓ {file_path:30s} 存在")
        else:
            print(f"✗ {file_path:30s} 不存在")
            all_exists = False

    print()

    if all_exists:
        print("✓ 所有必要檔案完整！")
    else:
        print("✗ 部分檔案遺失")

    return all_exists

def main():
    """主程式"""
    print()
    print("╔" + "═" * 48 + "╗")
    print("║" + " " * 10 + "LINE Bot GAS 生成器" + " " * 18 + "║")
    print("║" + " " * 15 + "環境檢查工具" + " " * 20 + "║")
    print("╚" + "═" * 48 + "╝")
    print()

    # 檢查 Python 版本
    python_ok = check_python_version()

    # 檢查套件
    packages_ok = check_packages()

    # 檢查檔案
    files_ok = check_files()

    # 總結
    print()
    print("=" * 50)
    print("檢查結果總結")
    print("=" * 50)

    if python_ok and packages_ok and files_ok:
        print()
        print("🎉 恭喜！環境設定完成，可以開始使用了！")
        print()
        print("下一步：")
        print("  1. 執行 start.bat (Windows) 或 ./start.sh (Mac/Linux)")
        print("  2. 開啟瀏覽器，前往 http://localhost:8806")
        print()
    else:
        print()
        print("⚠️  環境設定尚未完成")
        print()
        if not python_ok:
            print("  • 請安裝 Python 3.7 或以上版本")
        if not packages_ok:
            print("  • 請執行: pip install -r requirements.txt")
        if not files_ok:
            print("  • 請確認所有專案檔案完整")
        print()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n程式已中斷")
    except Exception as e:
        print(f"\n發生錯誤: {e}")

    input("\n按 Enter 鍵關閉...")

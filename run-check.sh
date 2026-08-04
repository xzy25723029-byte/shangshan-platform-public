#!/bin/bash
# ============================================================
#  上善若水 · 一键全量检查（Git Bash / macOS / Linux）
#  自动定位项目目录、自动启动/复用 dev server，然后执行
#  full-check（lint + build + qa + matrix + audit）
#  用法：bash run-check.sh   或   ./run-check.sh
# ============================================================
cd "$(dirname "$0")"

echo "[1/3] 检查 dev server（127.0.0.1:4173）..."
if curl -s -o /dev/null http://127.0.0.1:4173/; then
  echo "      dev server 已在运行，直接使用。"
else
  echo "      dev server 未运行，正在后台启动..."
  (npm run dev > qa/dev-server.log 2>&1 &)
  sleep 7
  if curl -s -o /dev/null http://127.0.0.1:4173/; then
    echo "      dev server 已就绪。"
  else
    echo "[错误] dev server 启动失败，请查看 qa/dev-server.log"
    exit 1
  fi
fi

echo "[2/3] 执行全量检查（lint + build + qa + matrix + audit）..."
npm run full-check
CODE=$?

echo "[3/3] 收尾..."
echo
if [ "$CODE" = "0" ]; then
  echo "============================================"
  echo " 全部检查通过：lint / build / qa / matrix / audit"
  echo " 报告：qa/matrix-report.md  和  qa/audit/ISSUES.md"
  echo "============================================"
else
  echo "============================================"
  echo " 检查未通过（退出码 $CODE），请查看上方失败项。"
  echo " 报告：qa/matrix-report.md  和  qa/audit/ISSUES.md"
  echo "============================================"
fi
exit $CODE

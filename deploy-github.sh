#!/bin/bash
# ============================================================
#  推送到 GitHub 私有仓库（Aaron927-dev/shangshan-platform）
#  用法：
#    export GH_TOKEN=ghp_xxx          # 你的 Personal Access Token（repo 权限）
#    bash deploy-github.sh
#  token 仅存于本次 shell 环境变量，不写入任何文件
# ============================================================
set -e
cd "$(dirname "$0")"

REPO_OWNER="Aaron927-dev"
REPO_NAME="shangshan-platform"
REPO_FULL="${REPO_OWNER}/${REPO_NAME}"

if [ -z "$GH_TOKEN" ]; then
  echo "[错误] 未设置 GH_TOKEN 环境变量"
  echo "获取方法：GitHub → Settings → Developer settings → Personal access tokens"
  echo "        → Tokens (classic) → Generate new token → 勾选 repo → 生成并复制"
  echo "然后：export GH_TOKEN=你的token && bash deploy-github.sh"
  exit 1
fi

echo "[1/4] 创建私有仓库 ${REPO_FULL} ..."
if curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $GH_TOKEN" "https://api.github.com/repos/${REPO_FULL}" | grep -q 200; then
  echo "      仓库已存在，跳过创建。"
else
  curl -s -X POST "https://api.github.com/user/repos" \
    -H "Authorization: Bearer $GH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -d "{\"name\":\"${REPO_NAME}\",\"private\":true,\"description\":\"上善若水·本科生科研素养实训平台（Vue3 + Vite + Pinia + Element Plus + Supabase 就绪）\",\"homepage\":\"\"}" \
    | grep -o '"full_name": *"[^"]*"' || echo "（创建响应异常，请检查 token 权限）"
fi

echo "[2/4] 设置远程并推送 main 分支 ..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${REPO_FULL}.git"
git push "https://x-access-token:${GH_TOKEN}@github.com/${REPO_FULL}.git" main:main 2>&1 | tail -3

echo "[3/4] 验证远程仓库 ..."
curl -s -H "Authorization: Bearer $GH_TOKEN" "https://api.github.com/repos/${REPO_FULL}" \
  | grep -o '"private": *[a-z]*\|"default_branch": *"[^"]*"\|"html_url": *"[^"]*"' | head -3

echo "[4/4] 完成。"
echo "仓库地址：https://github.com/${REPO_FULL}"
echo
echo "下一步（EdgeOne Pages 部署）："
echo "1. 腾讯云控制台 → EdgeOne → Pages 服务 → 创建项目"
echo "2. 关联 GitHub 仓库 ${REPO_FULL}"
echo "3. 构建配置：构建命令 npm run build，输出目录 dist"
echo "4. 推送 main 分支即自动构建部署（纯静态，无常驻后端）"

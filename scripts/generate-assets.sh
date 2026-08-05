#!/bin/bash
# ============================================================
#  AI 生图：为平台生成水科技风格视觉素材
#  依赖 generate-image skill（OpenRouter），需先设置：
#    export OPENROUTER_API_KEY=sk-or-...
#  用法：bash scripts/generate-assets.sh
#  产出：public/assets/ai/*.png（理念插画 / 水科技背景）
#  说明：AI 生图为插画示意，非真实照片；科学家真实照片见
#        docs/assets-guide.md 的放置方法
# ============================================================
set -e
cd "$(dirname "$0")/.."
SKILL_DIR="C:/Users/ydx15/.zcode/skills/generate-image"
mkdir -p public/assets/ai

echo "[1/3] 生成：汇流线理念插画（尚为水·纳百川母题）"
python "$SKILL_DIR/scripts/generate_image.py" \
  "A network of blue river lines converging into a delta, stylised modern scientific illustration, translucent teal and ice-blue lines on white background, soft glow, wide composition with empty space on the left for title, no text, no watermark" \
  -m google/gemini-3.1-flash-image --aspect-ratio 21:9 --resolution 1K \
  -o public/assets/ai/flow-lines.png

echo "[2/3] 生成：水科技背景（浸润渐变母题）"
python "$SKILL_DIR/scripts/generate_image.py" \
  "Abstract water science background, gentle ice-blue gradient diffusing from top-left, faint water ripple textures and thin circuit-like stream lines, bright and calm, white base, very low contrast, no text, no watermark" \
  -m google/gemini-3.1-flash-image --aspect-ratio 16:9 --resolution 1K \
  -o public/assets/ai/infusion-gradient.png

echo "[3/3] 生成：科研实训主题插画（实验室与水环境）"
python "$SKILL_DIR/scripts/generate_image.py" \
  "Undergraduate research training illustration: young student with microscope near a river monitoring station, flat modern illustration style, teal and ice-blue palette, white background, calm and positive mood, no text, no watermark" \
  -m google/gemini-3.1-flash-image --aspect-ratio 16:9 --resolution 1K \
  -o public/assets/ai/research-training.png

echo "完成：public/assets/ai/ 下已生成 3 张素材"
echo "（生成后请人工查看图片质量，AI 生图可能出现构图/文字问题）"

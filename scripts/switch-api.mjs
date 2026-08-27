/* 机械替换：页面 import 从 mockApi 切到统一 api 出口（纯文本替换，无逻辑变更）
   用途：VITE_USE_MOCK=false 时业务页面走 Supabase 实现 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "src");
const targets = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".vue") || p.endsWith(".js")) targets.push(p);
  }
}
walk(root);

let changed = 0;
for (const file of targets) {
  let s = readFileSync(file, "utf8");
  if (!s.includes("mockApi")) continue;
  const before = s;
  // import { mockApi } from "X";  → import { api } from "X";
  s = s.replace(/import \{\s*mockApi\s*\} from ("[^"]+"|'[^']+');/g, 'import { api } from $1;');
  // 引用替换
  s = s.replace(/\bmockApi\./g, "api.");
  if (s !== before) {
    writeFileSync(file, s);
    changed++;
  }
}
console.log(`switched ${changed} files from mockApi to unified api`);

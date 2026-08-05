/* ============================================================
   死按钮检测 · 共享模块（matrix-check 与 ui-audit 复用，避免逻辑漂移）
   注意：page.evaluate 在浏览器上下文执行，DOM 工具函数必须内联进
   代码字符串，不能从 Node 模块作用域引用
   ============================================================ */

/* DOM 工具（内联进 evaluate 的代码片段） */
const DOM_UTILS = `
  /* 只统计可见弹层（EP 预渲染 display:none 的 overlay 不计） */
  function visibleOverlays() {
    return [...document.querySelectorAll(".el-overlay")].filter((o) => getComputedStyle(o).display !== "none").length;
  }
  /* 点击元素并统计 550ms 窗口内的 DOM 变化量
     计数 = 节点增删数 + 记录数（EP 预渲染弹层靠 attribute 显隐；
     Chrome 把片段插入合并为一条记录——两者都要计入） */
  function countMutations(el) {
    let mutations = 0;
    const obs = new MutationObserver((m) => {
      for (const rec of m) mutations += rec.addedNodes.length + rec.removedNodes.length + 1;
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    el.scrollIntoView({ block: "center" });
    el.click();
    return new Promise((resolve) => {
      setTimeout(() => {
        obs.disconnect();
        resolve(mutations);
      }, 550);
    });
  }
`;

export async function scanButtonsOnPage(page) {
  const buttons = await page.evaluate(() =>
    [...document.querySelectorAll("button")]
      .filter((b) => {
        const r = b.getBoundingClientRect();
        const cs = getComputedStyle(b);
        return r.width > 20 && r.height > 20 && cs.visibility !== "hidden" && cs.display !== "none" && !b.disabled;
      })
      .map((b) => ({ text: b.textContent.trim().slice(0, 30), aria: b.getAttribute("aria-label") || "" }))
      .filter((b) => b.text || b.aria),
  );

  const dead = [];
  for (const b of buttons) {
    const btnTextArg = JSON.stringify(b.text || b.aria);
    const fb = await page.evaluate(`(async () => {
      const btnText = ${btnTextArg};
      ${DOM_UTILS}
      const cands = [...document.querySelectorAll("button")].filter(
        (x) => x.textContent.trim().slice(0, 30) === btnText && x.getBoundingClientRect().width > 20,
      );
      if (!cands.length) return "not-found";

      // 同文本多实例：任一实例有响应即判定可用
      for (const el of cands) {
        const beforeHash = location.hash;
        const beforeMsgs = document.querySelectorAll(".el-message").length;
        const beforeDialogs = visibleOverlays();
        const beforeInputs = [...document.querySelectorAll("input, textarea")].map((i) => i.value);
        const mutations = await countMutations(el);
        const inputChanged = [...document.querySelectorAll("input, textarea")].some((i, idx) => i.value !== (beforeInputs[idx] || ""));
        const changed =
          mutations > 2 || location.hash !== beforeHash ||
          document.querySelectorAll(".el-message").length > beforeMsgs ||
          visibleOverlays() > beforeDialogs || inputChanged;
        const opened = visibleOverlays() > beforeDialogs;
        if (changed) return { changed: true, opened };
      }

      // 选择器类按钮：点击同容器兄弟验证页面可响应
      const el0 = cands[0];
      const sibs = [...el0.parentElement.querySelectorAll("button")].filter(
        (s) => s !== el0 && s.textContent.trim().slice(0, 30) !== btnText && s.getBoundingClientRect().width > 20,
      );
      for (const s of sibs) {
        const m = await countMutations(s);
        if (m > 2) return { changed: true, opened: false, selectorOk: true };
      }
      return { changed: false, opened: false };
    })()`);

    if (fb === "not-found") continue;
    if (fb.opened) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(450);
    }
    if (!fb.changed) dead.push(b.text || b.aria);
  }
  return dead;
}

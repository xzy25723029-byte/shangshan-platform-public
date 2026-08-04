/* ============================================================
   ESLint 扁平配置（eslint 9 + eslint-plugin-vue）
   语法/规范检查：npm run lint
   ============================================================ */
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "outputs/**",
      "scripts/**",
      "supabase/**",
      "public/**",
      "qa/**",
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["src/**/*.{js,vue,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        location: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        console: "readonly",
        fetch: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": "off",
      // Vue 规范：组件名允许中文语义名（平台约定）
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/attributes-order": "off",
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/require-default-prop": "off",
      "vue/require-explicit-emits": "off",
      // 平台排版惯例：全角空格（U+3000）用作中文分隔（原型同款），不视为错误
      "no-irregular-whitespace": "off",
      // 平台模板保持原型的高密度单行风格
      "vue/multiline-html-element-content-newline": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];

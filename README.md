# 🧭 学术罗盘浏览器扩展 (Academic Compass Extension)

这是一个基于 Chromium 内核浏览器（Chrome, Edge）的侧边栏扩展工具。它可以在您访问特定的教育和求职网站时自动激活，提供即时、深入的 AI 职业生涯分析。

This is a sidebar extension built for Chromium-based browsers (Chrome, Edge). It automatically activates when you visit specific education and job search websites, providing instant, in-depth AI career path analysis.

## 核心功能 / Core Features

* **情境式激活 / Contextual Activation:** 仅在识别到教育平台、加拿大大学域名或相关求职网站时，自动显示浮动指南针按钮。/ The floating compass button automatically appears only when educational and career-related websites (like major Canadian universities) are detected, minimizing interference on other sites.
* **侧边栏集成 / Sidebar Integration:** 提供一个可调整大小的侧边栏面板，用于输入信息、查看详细的分析报告、引用来源和切换明暗模式。/ Provides a resizable sidebar panel for inputting information, viewing detailed analysis reports, checking sources, and switching between light/dark themes.
* **多语言支持 / Multilingual Support:** 界面支持简体中文、繁体中文和英文，方便全球用户使用。/ The interface supports Simplified Chinese, Traditional Chinese, and English for a global user base.
* **后端连接 / Backend Connection:** 通过 `background.js` 服务工作线程与外部 Academic Compass API 进行安全通信，获取分析结果。/ Communicates securely with the external Academic Compass API via the `background.js` service worker to fetch analysis results.

## 浏览器兼容性 / Browser Compatibility

本项目基于通用的 **Chromium** 扩展架构开发，兼容性优秀。/ This project is based on the general **Chromium** extension architecture and has excellent compatibility.

| 浏览器 / Browser | 兼容性 / Compatibility | 备注 / Notes |
| :--- | :--- | :--- |
| **Google Chrome** | ✅ Fully Supported | 标准开发平台。/ Standard development platform. |
| **Microsoft Edge** | ✅ Fully Supported | 基于 Chromium 内核，完全兼容。/ Fully compatible due to the Chromium engine. |

## 工作原理简述 / How It Works Briefly

1.  **注入 / Injection:** `content.js` 脚本检查当前网页 URL，并在目标网站的右下角注入一个浮动的指南针按钮。
2.  **触发 / Trigger:** 用户点击浮动按钮，`content.js` 将侧边栏 (`sidebar.html` 作为一个 iframe) 动画滑入视图。
3.  **分析请求 / Analysis Request:** 用户在侧边栏输入信息并点击“分析”，`sidebar.js` 将数据发送给 `background.js`。
4.  **API 调用 / API Call:** `background.js` 使用 `fetch` 请求调用部署在 Cloud Run 上的 Academic Compass 后端 API。
5.  **结果展示 / Result Display:** 后端结果通过 `background.js` 转发回 `sidebar.js`，最终以格式化的 Markdown 报告形式展示给用户。

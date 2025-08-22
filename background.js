// background.js - The messenger for Academic Compass

// 【修改】API URL已更新为 Academic Compass 的后端服务地址
const API_URL = 'https://academic-compass-backend-885033581194.us-central1.run.app/analyze';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 【修改】消息类型改为 ANALYZE_PROFILE
    if (message.type === "ANALYZE_PROFILE") {
        console.log("Background script received analysis request:", message.data);
        
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message.data),
        })
        .then(response => response.json().then(data => ({ ok: response.ok, status: response.status, data: data })))
        .then(result => {
            console.log("Sending result to sidebar:", result);
            chrome.runtime.sendMessage({ type: "ANALYSIS_RESULT", result: result });
        })
        .catch(error => {
            console.error("Error calling API:", error);
            const errorResult = { ok: false, data: { error: "connection_error", message: error.message } };
            chrome.runtime.sendMessage({ type: "ANALYSIS_RESULT", result: errorResult });
        });
        
        return true; // Indicate that the response will be sent asynchronously.
    }

    // 当收到打开新标签页的请求时 (功能保留)
    if (message.type === "OPEN_NEW_TAB") {
        chrome.tabs.create({ url: message.url });
    }
});

// 当用户点击浏览器右上角的插件图标时，通知 content script 打开侧边栏 (功能保留)
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_SIDEBAR" });
});

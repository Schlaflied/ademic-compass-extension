// content.js - Injects the compass on the right pages! (v1.1)

console.log("Academic Compass content script loaded!");

// --- 全局变量定义 ---
let sidebar = null;
let isSidebarOpen = false;

// 【核心修改】大大扩展了加拿大大学的域名列表，提高了识别率
const targetSites = [
    // 常见教育域名后缀
    '.edu', '.ac.ca', '.ac.uk', 
    
    // 加拿大主要大学 (安省及其他省份)
    'yorku.ca', 'uwo.ca', 'utoronto.ca', 'uwaterloo.ca', 'mcmaster.ca', 
    'queensu.ca', 'ryerson.ca', 'torontomu.ca', 'carleton.ca', 'uoguelph.ca',
    'uottawa.ca', 'brocku.ca', 'laurentian.ca', 'ontariotechu.ca', 'trentu.ca',
    'ubc.ca', 'sfu.ca', 'uvic.ca', 'mcgill.ca', 'concordia.ca', 'ualberta.ca',
    'ucalgary.ca', 'dal.ca', 'usask.ca',

    // 线上课程平台
    'coursera.org', 'edx.org', 'udemy.com',
    
    // 大学排名和信息网站
    'macleans.ca/education/university-rankings', 
    'topuniversities.com'
];

// --- 核心功能函数 ---

function toggleSidebar(forceState) {
    if (!sidebar) return;
    const sidebarWidth = 455;
    isSidebarOpen = (typeof forceState === 'boolean') ? forceState : !isSidebarOpen;
    sidebar.style.right = isSidebarOpen ? '0px' : `-${sidebarWidth + 50}px`;
}

function injectSidebar() {
    if (document.getElementById('academic-compass-sidebar')) return;

    sidebar = document.createElement('iframe');
    sidebar.id = 'academic-compass-sidebar';
    sidebar.src = chrome.runtime.getURL('sidebar.html');
    sidebar.style.cssText = `
        position: fixed; top: 0; right: -505px; width: 455px; height: 100%;
        border: none; z-index: 2147483647; box-shadow: -5px 0 15px rgba(0,0,0,0.15);
        transition: right 0.3s ease-in-out; background-color: transparent;
    `;
    document.body.appendChild(sidebar);

    window.addEventListener('message', (event) => {
        if (event.source !== sidebar.contentWindow) return;
        if (event.data.type && event.data.type === 'ACADEMIC_COMPASS_CLOSE_SIDEBAR') {
            toggleSidebar(false);
        }
    });
}

function injectFloatingButton() {
    if (document.getElementById('academic-compass-trigger-button')) return;

    const compassButton = document.createElement('div');
    compassButton.id = 'academic-compass-trigger-button';
    compassButton.innerHTML = `
      <div class="ac-main-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
      </div>
      <div class="ac-close-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
    `;
    document.body.appendChild(compassButton);
    addEventListenersToButton(compassButton);
}

function addEventListenersToButton(button) {
    let isDragging = false;
    let clickTimeout = null;

    const closeIcon = button.querySelector('.ac-close-icon');
    closeIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        button.style.display = 'none';
    });

    button.addEventListener('mousedown', (e) => {
        isDragging = false;
        let startX = e.clientX;
        let startY = e.clientY;

        function onMouseMove(e) {
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                isDragging = true;
                button.style.cursor = 'grabbing';
                let newX = e.clientX - (button.offsetWidth / 2);
                let newY = e.clientY - (button.offsetHeight / 2);
                button.style.left = `${newX}px`;
                button.style.top = `${newY}px`;
                button.style.bottom = 'auto';
                button.style.right = 'auto';
            }
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            button.style.cursor = 'pointer';
            if (!isDragging) {
                if (!sidebar) injectSidebar();
                setTimeout(() => toggleSidebar(), 50);
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    button.ondragstart = () => false;
}


function main() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "TOGGLE_SIDEBAR") {
            if (!sidebar) injectSidebar();
            setTimeout(() => toggleSidebar(), 50);
        }
    });

    const currentUrl = window.location.href;
    const isOnTargetSite = targetSites.some(site => currentUrl.includes(site));

    if (isOnTargetSite) {
        injectFloatingButton();
        const observer = new MutationObserver(() => {
            if (!document.getElementById('academic-compass-trigger-button')) {
                console.log("Academic Compass button was removed. Re-injecting...");
                injectFloatingButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

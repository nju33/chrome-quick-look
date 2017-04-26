let currentWin = null;
// let currentTab = null;

// function getCurrentTab() {
//   return new Promise(resolve => {
//     chrome.tabs.query({
//       active: true,
//       currentWindow: true
//     }, tabs => {
//       resolve(tabs[0]);
//     });
//   });
// }

function createWindow(url) {
  return new Promise(resolve => {
    chrome.windows.create({
      url,
      type: 'popup',
      width: 517,
      height: 320
    }, win => resolve(win));
  });
}

async function quickLook(url) {
  currentWin = await createWindow(url);
  // const popupFilename = chrome.runtime.getURL('popup.html');
  // currentWin = await createWindow(`${popupFilename}#${encodeURI(url)}`);
  // currentTab = await getCurrentTab();
}

chrome.windows.onFocusChanged.addListener(wid => {
  if (currentWin === null) {
    return;
  }
  if (currentWin.id !== wid) {
    chrome.windows.remove(currentWin.id, () => {
      currentWin = null;
    });
  }
});

// chrome.webRequest.onHeadersReceived.addListener(async details => {
//   if (details.tabId !== currentTab.id) {
//     return;
//   }
//
//   for (var i = 0; i < details.responseHeaders.length; ++i) {
//     if (details.responseHeaders[i].name.toLowerCase() == 'x-frame-options') {
//       console.log(details.responseHeaders[i]);
//       details.responseHeaders.splice(i, 1);
//       console.log(details.responseHeaders[i]);
//       return {responseHeaders: details.responseHeaders};
//     }
//   }
// }, {
//     urls: ["<all_urls>"]
// }, ["blocking", "responseHeaders"]);

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: chrome.i18n.getMessage('name'),
    title: chrome.i18n.getMessage('contextTitle'),
    contexts: ['page', 'link', 'image']
  });
});

chrome.contextMenus.onClicked.addListener(({menuItemId, linkUrl, pageUrl}) => {
  if (menuItemId === chrome.i18n.getMessage('name')) {
    const url = linkUrl || pageUrl;
    quickLook(url);
  }
});

let currentWin = null;

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
  const popupFilename = chrome.runtime.getURL('popup.html');
  const win = await createWindow(`${popupFilename}#${encodeURI(url)}`);
  currentWin = win;
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

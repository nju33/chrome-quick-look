import { QuickLook } from './popup-window'

export function init(quickLook: QuickLook): void {
  // chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: chrome.i18n.getMessage('name'),
    title: chrome.i18n.getMessage('contextTitle'),
    contexts: ['page', 'link', 'image']
  })
  // })

  function onContextMenuClick({
    linkUrl,
    menuItemId,
    pageUrl
  }: chrome.contextMenus.OnClickData): void {
    if (menuItemId !== chrome.i18n.getMessage('name')) {
      return
    }

    const url = linkUrl ?? pageUrl
    // eslint-disable-next-line no-void
    void quickLook(url)
  }

  chrome.contextMenus.onClicked.addListener(onContextMenuClick)
}

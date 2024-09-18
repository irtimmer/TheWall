// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

const REMOVE_HEADERS = ['x-frame-options', 'frame-options', 'content-security-policy']

let trustedOrigin = null

const onHeadersReceived = req => {
  let responseHeaders = req.responseHeaders.filter(header => !REMOVE_HEADERS.includes(header.name.toLowerCase()))
  return { responseHeaders }
}

browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action == 'rendererInit') {
    trustedOrigin = (await browser.storage.local.get("domain")).domain || "http://localhost:3000"
    if (sender.origin != trustedOrigin) {
      browser.runtime.openOptionsPage()
      sendResponse({ message: 'untrusted' })
    }

    browser.webRequest.onHeadersReceived.removeListener(onHeadersReceived)
    browser.webRequest.onHeadersReceived.addListener(
      onHeadersReceived, {
        urls: [ '<all_urls>' ],
        types: [ 'sub_frame' ],
        tabId: message.tabId
      },
      ['blocking', 'responseHeaders']
    )
    sendResponse({ message: 'activated' })
  } else if (sender.origin != trustedOrigin) {
    sendResponse({ message: 'untrusted' })
  } else if (message.action == 'injectCss') {
    if (message.oldCss)
      browser.tabs.removeCSS(sender.tab.id, { code: message.oldCss, frameId: message.frameId })

    browser.tabs.insertCSS(sender.tab.id, { code: message.css, frameId: message.frameId })
    sendResponse({ message: 'ok' })
  }
})
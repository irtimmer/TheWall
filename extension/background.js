// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

const REMOVE_HEADERS = ['x-frame-options', 'frame-options', 'content-security-policy']

let trustedOrigin = null

const onHeadersReceived = req => {
  let responseHeaders = req.responseHeaders.filter(header => !REMOVE_HEADERS.includes(header.name.toLowerCase()))
  for (let header of responseHeaders) {
    // Replace SameSite=Lax and SameSite=Strict with SameSite=None to allow cross-origin cookies
    if (header.name.toLowerCase() === 'set-cookie') {
      header.value = header.value.replace(/SameSite=Lax|SameSite=Strict/i, 'SameSite=None')
    }
  }
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
  } else if (message.action == 'injectScript') {
    console.log('injectScript', message.script, { tabId: sender.tab.id, frameIds: message.frameId })
    browser.tabs.executeScript(sender.tab.id, { code: message.script, frameId: message.frameId })
    sendResponse({ message: 'ok' })
  }
})
// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

const REMOVE_HEADERS = ['x-frame-options', 'frame-options']

let trustedOrigin = null
let scriptEnabled = false

const onHeadersReceived = req => {
  // Only modify headers for sub-frames
  if (req.parentFrameId == 0 && req.type != 'sub_frame')
    return {}

  let wallOrigin = req.frameAncestors && req.frameAncestors.length > 0 ? new URL(req.frameAncestors[req.frameAncestors.length - 1].url).origin : null
  let frameOrigin = req.originUrl ? new URL(req.originUrl).origin : null
  let reqOrigin = new URL(req.url).origin
  let sameOrigin = req.parentFrameId == 0 || frameOrigin == reqOrigin

  let responseHeaders = req.responseHeaders
  if (req.type == 'sub_frame' && sameOrigin)
    responseHeaders = req.responseHeaders.filter(header => !REMOVE_HEADERS.includes(header.name.toLowerCase()))

  for (let header of responseHeaders) {
    const headerName = header.name.toLowerCase()
    switch (headerName) {
      case 'set-cookie':
        // Keep SameSite if request is not same origin
        if (!sameOrigin)
          break

        // Replace SameSite=Lax and SameSite=Strict with SameSite=None to allow cookies in iframes
        header.value = header.value.replace(/SameSite=Lax|SameSite=Strict/i, 'SameSite=None')
        break
      case 'content-security-policy':
      case 'content-security-policy-report-only':
        if (req.type != 'sub_frame' && !wallOrigin)
          break

        // Add the wall origin to the frame-ancestors directive
        header.value = header.value.replace(/frame-ancestors ([^;]+);?/i, `frame-ancestors $1 ${wallOrigin};`)

        // Remove frame-ancestors 'none' directive
        header.value = header.value.replace(/frame-ancestors 'none'/i, `frame-ancestors `)
        break
    }
  }
  return { responseHeaders }
}

browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action == 'rendererInit') {
    trustedOrigin = (await browser.storage.local.get("domain")).domain || "http://localhost:3000"
    scriptEnabled = (await browser.storage.local.get("script")).script || false
    if (sender.origin != trustedOrigin) {
      browser.runtime.openOptionsPage()
      sendResponse({ message: 'untrusted' })
    }

    browser.webRequest.onHeadersReceived.removeListener(onHeadersReceived)
    browser.webRequest.onHeadersReceived.addListener(
      onHeadersReceived, {
        urls: [ '<all_urls>' ],
        tabId: sender.tab.id
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
    if (!scriptEnabled)
      return sendResponse({ message: 'unallowed' })

    browser.tabs.executeScript(sender.tab.id, { code: message.script, frameId: message.frameId })
    sendResponse({ message: 'ok' })
  }
})
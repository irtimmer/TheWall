// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

exportFunction(function () {
  browser.runtime.sendMessage({
    action: "rendererInit"
  })
}, window, { defineAs: "wallRendererInit" })

exportFunction(function (iframe, css, oldCss) {
  const frameId = browser.runtime.getFrameId(iframe)
  browser.runtime.sendMessage({
    action: "injectCss",
    frameId,
    css,
    oldCss
  })
}, window, { defineAs: "wallInjectCss" })

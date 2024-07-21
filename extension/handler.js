exportFunction(function () {
  browser.runtime.sendMessage({})
}, window, { defineAs: "wallRendererInit" })

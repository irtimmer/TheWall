console.log("Register wallRenderer")

exportFunction(function () {
  browser.runtime.sendMessage({})
}, window, { defineAs: "wallRenderer" })

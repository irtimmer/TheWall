// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    browser.storage.local.set({
      domain: document.querySelector("#domain").value,
      script: document.querySelector("#script").checked
    })
  })

  browser.storage.local.get(["domain", "script"]).then((res) => {
    document.querySelector("#domain").value = res.domain || "http://localhost:3000"
    document.querySelector("#script").checked = res.script || false
  }, (err) => {
    console.error(`Error: ${err}`)
  })
})

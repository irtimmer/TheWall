// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", (e) => {
    console.log("Trust set", document.querySelector("#domain").value)
    browser.storage.local.set({
      domain: document.querySelector("#domain").value
    })
  })

  browser.storage.local.get("domain").then((res) => {
    console.log("Trust get", res.domain)
    document.querySelector("#domain").value = res.domain || "http://localhost:3000"
  }, (err) => {
    console.error(`Error: ${err}`)
  })
})
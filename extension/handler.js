// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

exportFunction(function () {
  browser.runtime.sendMessage({})
}, window, { defineAs: "wallRendererInit" })

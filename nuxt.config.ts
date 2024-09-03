// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

import path from 'path';
import fs from 'fs';

const usersFile = path.resolve(__dirname, 'users.json');

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-primevue', '@kgierke/nuxt-basic-auth'],
  primevue: {
    importPT: { from: path.resolve(__dirname, './presets/aura/') },
    options: {
      unstyled: true
    }
  },
  basicAuth: fs.existsSync(usersFile) ? {
    enabled: true,
    users: JSON.parse(fs.readFileSync(usersFile, 'utf-8'))
  } : {
    enabled: false
  }
})

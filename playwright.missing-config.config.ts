import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/fixtures',testMatch:'missing-config.spec.ts',use:{baseURL:'http://localhost:3100',browserName:'chromium'},reporter:'list'});

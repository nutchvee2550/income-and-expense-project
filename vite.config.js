import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/income-and-expense-project/",   // ต้องตรงกับชื่อ repo
  plugins: [react()],
})

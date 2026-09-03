import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/income-and-expense-project/",   // ต้องตรงกับชื่อ repo
  plugins: [react()],
})

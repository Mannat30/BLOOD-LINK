import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from 'tailwindcss'

export default defineConfig({
  plugins: [
    react(),
    tailwind({
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
      ],
      theme: 'tailwindcss',
      plugins: [
        require('tailwindcss/forms')
      ]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
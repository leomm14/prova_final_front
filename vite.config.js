import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Em dev, /api/* é redirecionado para o back (igual o rewrite do vercel.json em produção).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

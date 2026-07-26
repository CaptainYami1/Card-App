import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = env.VITE_BASE_URL;
  const { origin } = new URL(apiBaseUrl);
  return{
  plugins: [react(), tailwindcss()],
  server: {
      proxy: {
        "/api": {
          target: origin,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, "/api/v1.2"),
        },
      },
    },
}})

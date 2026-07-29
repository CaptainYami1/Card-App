import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = env.VITE_BASE_URL;
  const { origin, pathname } = new URL(apiBaseUrl);
  // Full API path prefix from VITE_BASE_URL, e.g. "/api/v1.2/web/card-control"
  const basePath = pathname.replace(/\/$/, "");
  return{
  plugins: [react(), tailwindcss()],
  server: {
      proxy: {
        "/api": {
          target: origin,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, basePath),
        },
      },
    },
}})

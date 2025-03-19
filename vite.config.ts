import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Assign env variables to process.env
  for (const key in env) {
    process.env[key] = env[key];
  }

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: process.env.API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": JSON.stringify(process.env),
    },
  };
});

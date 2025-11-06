import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Adicionado para resolver conflitos de múltiplas instâncias do React
      'react': path.resolve(__dirname, './node_modules/react'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

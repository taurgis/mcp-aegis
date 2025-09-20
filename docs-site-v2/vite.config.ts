import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProd = mode === 'production';
    
    return {
      base: '/',
      build: {
        rollupOptions: {
          output: {
            manualChunks: undefined,
            // Ensure consistent asset naming
            assetFileNames: (assetInfo) => {
              // Prevent undefined in asset names
              const name = assetInfo.name || 'asset';
              const extType = name.split('.').at(-1);
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
                return `assets/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
            chunkFileNames: (chunkInfo) => {
              // Ensure chunk names don't have undefined
              const name = chunkInfo.name || 'chunk';
              return `assets/${name}-[hash].js`;
            },
            entryFileNames: `assets/[name]-[hash].js`
          },
        },
        // Ensure consistent builds
        minify: isProd,
        sourcemap: !isProd,
      },
      css: {
        postcss: './postcss.config.js',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // SSG specific configuration
      ssgOptions: {
        script: 'async',
        formatting: 'prettify',
        // Improve SSG stability
        mock: true,
        onBeforePageGenerate: (route: string, indexHTML: string, data: any) => {
          // Ensure proper data structure
          return indexHTML;
        },
        onPageGenerated: (route: string, indexHTML: string, data: any) => {
          // Post-process generated pages
          return indexHTML;
        },
        onFinished: () => {
          console.log('SSG generation completed');
        },
      }
    };
});

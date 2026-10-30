import { readFileSync } from 'node:fs';
import typescript from '@rollup/plugin-typescript';
import ts from 'typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/hive-scheduler-card.js',
    banner: '/*! Hive Scheduler Card — derived from Sonoff TRVZB Scheduler Card.\n' + readFileSync(new URL('./LICENSE', import.meta.url), 'utf8') + '*/',
    format: 'es',
    sourcemap: !production  // Only enable sourcemaps in development
  },
  plugins: [
    resolve(),
    typescript({
      // The inherited compiler plugin can leave FS watchers alive after a one-shot
      // build on Node 24. Production needs the initial compilation only; dev -w
      // retains the real TypeScript watchers.
      typescript: production ? {
        ...ts,
        sys: {
          ...ts.sys,
          watchFile: () => ({ close() {} }),
          watchDirectory: () => ({ close() {} })
        }
      } : ts,
      sourceMap: !production,  // Only enable sourcemaps in development
      inlineSources: !production
    }),
    production && terser({
      format: {
        comments: /@license|@preserve|^!/
      },
      compress: {
        drop_console: false
      }
    })
  ].filter(Boolean)
};

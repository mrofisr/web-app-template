import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'

export default {
  input: './back/index.ts',
  output: {
    dir: './back/build/',
    format: 'es',
  },
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: './back/package.json', dest: './back/build' },
        { src: './back/package-lock.json', dest: './back/build' },
        { src: './.env', dest: './back/build' },
      ],
    }),
  ],
  external: [
    '@google-cloud/storage',
    '@sendgrid/mail',
    'bcryptjs',
    'cookie-parser',
    'cors',
    'dotenv',
    'express',
    'express-validator',
    'jsonwebtoken',
    'mongoose',
    'morgan',
    'multer',
    'nanoid',
  ],
}

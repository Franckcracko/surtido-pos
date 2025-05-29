import 'dotenv/config';

export const {
  PORT = 3000,
  SECRET_JWT_KEY
} = process.env;

if (!SECRET_JWT_KEY) {
  throw new Error('SECRET_JWT_KEY is not defined in the environment variables');
}

if (!PORT) {
  throw new Error('PORT is not defined in the environment variables');
}

export const SALT_ROUNDS = +process.env.SALT_ROUNDS || 10;

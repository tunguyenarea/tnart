'use server';

import { neon } from "@neondatabase/serverless";
import { genSaltSync, hashSync } from 'bcrypt-ts';

const sql = neon(process.env.DATABASE_URL!);

export async function getUser(email: string) {
  try {
    const data = await sql`
      SELECT * FROM "User"
      WHERE "email" = ${`${email}`};
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    await sql`
      INSERT INTO "User" (email, password)
      VALUES(${email}, ${hash});
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create user.');
  }
}

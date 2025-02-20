'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ADMIN_EMAIL = 'nifemiabioye59@gmail.com'
export const ADMIN_PASSWORD = 'jojoh$28crude$'


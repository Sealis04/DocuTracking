import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD!,
  ttl: 10,
  cookieName: "EngineeringTrackerCookie",
  cookieOptions: {
    //secure:true when used in deployment
    maxAge: undefined,
    secure: false,
  },
}


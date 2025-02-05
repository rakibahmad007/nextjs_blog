import "server-only"


import { SignJWT } from "jose"
import { cookies } from "next/headers"

const secretkey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretkey)

export async function encrypt(payload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(encodedKey)
  }

  export async function decrypt(session) {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ['HS256'],
      })
      return payload
    } catch (error) {
      console.log('Failed to verify session')
    }
  }

  export async function  createSession(userId){
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({userId, expiresAt})
    const cookieStore = await cookies()

    //returns a promise
//session is the json web token signature
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    })
  }
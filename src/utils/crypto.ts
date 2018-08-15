import { createCipher, createDecipher } from 'crypto'

export function cipher (key, password) {
  const cipher = createCipher('aes192', key)
  let encrypted = cipher.update(`${password}`, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

export function decipher (key, encrypted) {
  const decipher = createDecipher('aes192', key)
  let password = decipher.update(`${encrypted}`, 'base64', 'utf8')
  password += decipher.final('utf8')
  return password
}

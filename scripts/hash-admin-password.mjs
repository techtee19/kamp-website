import { randomBytes, scryptSync } from 'node:crypto'
import { stdin, stdout } from 'node:process'

if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
  console.error('Run this command in an interactive terminal so the password is not echoed.')
  process.exit(1)
}

function readHidden(prompt) {
  return new Promise((resolve, reject) => {
    stdout.write(prompt)
    stdin.setRawMode(true)
    stdin.resume()

    let password = ''
    const cleanup = () => {
      stdin.setRawMode(false)
      stdin.pause()
      stdin.removeListener('data', onData)
      stdout.write('\n')
    }
    const onData = (chunk) => {
      for (const byte of chunk) {
        if (byte === 3) {
          cleanup()
          reject(new Error('Cancelled.'))
          return
        }
        if (byte === 10 || byte === 13) {
          cleanup()
          resolve(password)
          return
        }
        if (byte === 8 || byte === 127) {
          password = password.slice(0, -1)
          continue
        }
        if (byte >= 32 && byte <= 126) password += String.fromCharCode(byte)
      }
    }
    stdin.on('data', onData)
  })
}

try {
  const password = await readHidden('Enter a new admin password (input hidden): ')
  const confirmation = await readHidden('Confirm the new admin password (input hidden): ')
  if (password !== confirmation) throw new Error('The passwords do not match.')
  if (password.length < 16 || password.length > 256) {
    throw new Error('Choose a password between 16 and 256 characters.')
  }

  const salt = randomBytes(16).toString('hex')
  const digest = scryptSync(password, salt, 64).toString('hex')
  console.log(`ADMIN_PASSWORD_HASH=scrypt$${salt}$${digest}`)
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Could not create password hash.')
  process.exitCode = 1
}

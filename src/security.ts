import { verify } from 'jsonwebtoken'

export const isAuthenticated = (user) => {
  if (!user) {
    throw new Error('Access Denied')
  }
}

export function verifyToken (token, secret) {
  return new Promise((resolve, reject) => {
    verify(token, secret, (err, decodedToken) => {
      if (err) {
        reject(err)
      }
      resolve(decodedToken)
    })
  })
}

export async function tokenGraphQLResolver (_, args, context) {
  const { user, jwtOptions: { key } } = context
  if (args.token) {
    context.user = await verifyToken(args.token, key)
  } else if (user) {
    context.user = user
  } else {
    throw new Error('Access Denied')
  }
  return context.user
}

const parseAuthorization = (authorization) => {
  const [ type, token ] = authorization.split(' ')
  if (type !== 'Bearer') {
    throw new Error('Unsupported authorization method')
  }
  return token
}

export function tokenExpressResolver (req, res, next) {
  const {
    headers: { authorization },
    jwtOptions: { key },
    logger
  } = req
  if (authorization) {
    try {
      const token = parseAuthorization(authorization)
      verifyToken(token, key).then((user) => {
        req.user = user
        next()
      }).catch(next)
    } catch (err) {
      next(err)
    }
  } else {
    next()
  }
}

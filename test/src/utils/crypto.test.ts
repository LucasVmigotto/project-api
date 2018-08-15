import { app, createToken, handlerGQLError, request} from '../../config'
import { cipher, decipher } from '../../../src/utils/crypto'

describe('Crypto', () => {
  test('Should decipher a encrypted password', () => {
    const encrypted = cipher('key', 'password')
    expect(typeof encrypted).toEqual('string')
    expect(decipher('key', encrypted)).toEqual('password')
  })
})

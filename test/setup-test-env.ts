import { installGlobals } from '@remix-run/node/globals'
import '@testing-library/jest-dom/extend-expect'
import { server } from 'mocks'

installGlobals()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

import { ServerClient } from 'postmark'

import { requireEnv } from '~/lib/utils'

export const mailer = new ServerClient(requireEnv('POSTMARK_API_KEY'))

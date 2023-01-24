import { requireEnv } from '~/lib/utils'

import { mailer } from './mailer.server'

const From = requireEnv('POSTMARK_API_KEY')

export const sendResetPassword = async (
  To: string,
  resetPasswordUrl: string | URL
) =>
  mailer.sendEmail({
    From,
    To,
    Subject: 'Reset your password.',
    HtmlBody: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
			</head>
			<body>
				<h1>Click here to reset your password:</h1>
				<a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
			</body>
		</html>`,
  })

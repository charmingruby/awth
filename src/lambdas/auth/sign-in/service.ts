import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { SignInPayload } from '.'
import { InvalidCredentialsError } from '@/helpers/errors/invalid-credentials-error'

export class SignInService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async execute(payload: SignInPayload) {
    console.log(payload.email)
    console.log(payload.password)

    const cmd = new InitiateAuthCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: payload.email,
        PASSWORD: payload.password,
      },
    })

    const { AuthenticationResult } = await this.cognitoClient.send(cmd)

    if (!AuthenticationResult) {
      throw new InvalidCredentialsError()
    }

    const { AccessToken, RefreshToken } = AuthenticationResult

    return {
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    }
  }
}

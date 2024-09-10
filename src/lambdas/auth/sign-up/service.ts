import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { SignUpPayload } from '../sign-up'

export class SignUpService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async execute(payload: SignUpPayload) {
    const cmd = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: payload.email,
      Password: payload.password,
      UserAttributes: [
        { Name: 'given_name', Value: payload.firstName },
        { Name: 'family_name', Value: payload.lastName },
      ],
    })

    const res = await this.cognitoClient.send(cmd)

    const { UserSub } = res

    return {
      id: UserSub,
    }
  }
}

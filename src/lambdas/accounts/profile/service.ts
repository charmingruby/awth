import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'

export class ProfileService {
  constructor(private readonly cognitoClient: CognitoIdentityProviderClient) {}

  async execute(userId: string) {
    const cmd = new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: userId,
    })

    const { UserAttributes } = await this.cognitoClient.send(cmd)

    return {
      user: UserAttributes,
    }
  }
}

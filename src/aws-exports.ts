import type { ResourcesConfig } from "aws-amplify";

// Amplify v6 configuration.
//
// This file replaces the legacy CLI-generated `aws-exports.js`. Values are read
// from Vite environment variables so that no credentials are committed to the
// repository. Define them in a `.env` (or `.env.local`) file, e.g.:
//
//   VITE_COGNITO_IDENTITY_POOL_ID=eu-west-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
//   VITE_COGNITO_USER_POOL_ID=eu-west-1_xxxxxxxxx
//   VITE_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
//
// The Cognito Identity Pool is required for the Face Liveness feature
// (`@aws-amplify/ui-react-liveness`). In Amplify v6 the AWS region is inferred
// from the pool IDs, so it does not need to be set explicitly.

const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID ?? "";
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "";
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ?? "";

const awsexports: ResourcesConfig = {
  Auth: {
    Cognito: {
      identityPoolId,
      userPoolId,
      userPoolClientId,
      allowGuestAccess: true,
    },
  },
};

export default awsexports;

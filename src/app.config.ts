export interface MongoDbConfig {
  username: string;
  password: string;
  dbName: string;
  useTls: boolean;
  uri: string;
  replicaSet: string;
  tlsCAFilePath: string;
}

export interface JwtConfig {
  secret: string;
  expiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  messagingServiceSid: string;
  apiSid: string;
  apiSecret: string;
}

export interface StripeConfig {
  secretKey: string;
  customerWebhookSecret: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export interface GoogleConfig {
  clientId: string;
  secret: string;
  callbackUrl: string;
}

export interface AppleConfig {
  clientID: string;
  teamID: string;
  callbackURL: string;
  keyID: string;
  privateKeyLocation: string;
  passReqToCallback: boolean;
}

export interface ServiceUrlsConfig {
  messagingApiUrl: string;
}

export default () => ({
  mongodb: {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DB_NAME,
    useTls: process.env.MONGO_USE_TLS,
    uri: process.env.MONGO_URI,
    replicaSet: process.env.MONGO_REPLICA_SET,
    tlsCAFilePath: process.env.MONGO_TLS_CA_FILE_PATH,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '60m',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '15d',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    customerWebhookSecret: process.env.STRIPE_CUSTOMER_WEBHOOK_SECRET,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_IS_SECURE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  apple: {
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    callbackURL: process.env.APPLE_CALLBACK_URL,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
    passReqToCallback: process.env.APPLE_PASS_REQ_TO_CALLBACK,
  },
  serviceUrls: {
    messagingApiUrl: process.env.MESSAGING_API_URL,
  },
});

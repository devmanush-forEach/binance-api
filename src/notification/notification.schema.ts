import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [String], required: true, unique: true })
  fcmToken: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// {
//   "type": "service_account",
//   "project_id": "binance-2ac0a",
//   "private_key_id": "8e06c5498283b95c802f314e277bcc952ae8f24a",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuYc++Z8rv6Ot5\n3+nRbBN9Z0JUjTFIpCdjulzRUtMTTr5bBp1LwIPm6rjecSxhYRXfgDodDZZMYiow\nJ38DfzMFV7v/yNDHNeYZWjc3dBqC3MonslFpOiaaPjuS9YYenLaoyuBxMrHIVtBz\nYmaVREFiemJqcII984VqL3JXqI5sV4hOuNz420MZpTrPblWsT29PRBHWbi25mZ/7\nrb+D78b6d3CMuSmLFAUspzQfaraCFMZY8E8XHztlt0t1dCEDB9d/ONes5RwEW3Bb\nrT5E7TZsShhqG8XWU6PT1sEjLGpt1pQuM0HgFjBOGFFR6O/iJAoO5PLFYFXsQYOh\nB69A6o1xAgMBAAECggEAQL3gvpzTW9HahvOKYC2jaMYK+tA20XTciOqaZj69TehI\nxQvGH2c4sWVIwJE8/GRqlgGJ0dqHCBHT/u/S+K3jd+LUUgkw9hz9MkFryaNJ6nbl\neOp7zjkANvjO7mdIZZoiOLWlsXE0TyBoIMaSNm3SZqjwW/ssZ6q/SCaYaZITWoZh\ndWWkTt4DdmgxLVSXj8n2DrbQyufYuRbXPiQAjWPL/+Ns/x1KB40JN247ynJesUJO\nX9IPK17baFcowifvZHFOuzxarn0INl9btJEiVYGm3uwW6YQTiXQs3ASv1NgdZc1n\nmqjDjoFOacHVEzLx+n5DWUzvoqox8to3SKSXW6yGdwKBgQDnTtBzRKhnbI6TAyx9\nilchJbjea97jA0LNjnAu85BWZ8x8QNpzJ1Tjp4acIvQQ0W/cNGAlubLr/S945rMA\nfjJ83pSpZGlJqIWcYHMmx90Z35qDu9b4gJWyYgLrEoIgsjl+eRp8z0HmDNde/66f\nzyOkRQc2Amlv4dMKdWClweX7IwKBgQDA/1QAgZUWTqBTiZiu6/7HDk+DYaGDcapq\nccsstlnmwzAPm/4DDhjROg2FfN6WCcU+y9Or/6a/gCfQcITwbrBsGl35BpjHk0rh\n5YiaYLac73idINX0NgHi/Hzc9MzLpAbfYpLyU2IpIg+DiVKUEaxe3r4lz5N4ggE9\nRMzANlUYWwKBgE455V1WVu3DVOR7Kky6wITBUShHqvVzYOBLz7zROns+V3WeKULQ\nhnEHcwrS91/ItN/wBqQ7jTsqQSfOPbNo+oIodHZlMwZqK+Wa6NawuSHK8WKj4Cvi\nsL3HT91YQRH1tGQFaOPU5CB9L0k9hz0cvJ0Ni0bEwgvIf6sFz02/qZupAoGBALtq\nt45OSBMDg5nb8tNbBW0ULo7tDkVw6ga4Po9K/X6kaVWfLEqXM+5qK5tHqXeWQV87\n3HAYsTsiHofB3LcHJne0GzGrAE4+cOdxWPhhlrRLsJsVue+PSsG8YxzG9OGEhdAE\nD6MW6in7k4kun2x+xR7Tu19IdnL9/GodF6BIotYlAoGBAJedg5bnzpQ4Yr3LCgAs\nR0qvba/6Uwd4puXhoHwhLWKuyqrbYjReqdKyXtm7Gs18ByqPtb9nmt0Kt0qEa4wa\nYNP/JKFKEqZ3Td/iFhnEYnUU7hm8omG6f/lHKYbtAPfdrXZpoF4c3LnCVmgoAaWo\nM9pKfKP8mEfeoyzibAFPw874\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-p23f9@binance-2ac0a.iam.gserviceaccount.com",
//   "client_id": "117933532813208469324",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-p23f9%40binance-2ac0a.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }

import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { Decimal } from 'decimal.js';
import rate from './rate';

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

export const webApi = functions.https.onRequest(main);

app.get('/currency/exchange', (req, res) => {
  const amount = new Decimal(req.query.amount);
  const CNY = amount.valueOf();
  const USD = amount.div(rate.USDCNY.Exrate).valueOf();
  const VND = new Decimal(USD).mul(rate.USDVND.Exrate).valueOf();
  const THB = new Decimal(USD).mul(rate.USDTHB.Exrate).valueOf()
  const result = {
    USD,
    CNY,
    VND,
    THB
  }

  res.status(200).send(result);
});

app.post('/version/check', (req, res) => {
  const _version = '1.0.0';
  const _android_apk = 'https://test1.4q.sk/flutter_hello_world.apk';
  const _ios_apk = '';
  const { version, os } = req.body;
  const isLatest = _version == version;
  const platform = os ? os.toLowerCase() : 'android';
  var result = {
    link: '',
    message: ''
  };

  switch (platform) {
    case 'android':
      result.link = isLatest ? '' : _android_apk;
      result.message = isLatest ? 'It\'s latest version.' : '';
      break;
    case 'ios':
      result.link = isLatest ? '' : _ios_apk;
      result.message = isLatest ? 'It\'s latest version.' : '';
      break;
    default:
      result.message = `${platform} is not supported.`;
      break;
  }
  
  res.status(200).send(result);
});
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
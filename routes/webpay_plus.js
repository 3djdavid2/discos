import express from 'express';
import pkg from 'transbank-sdk';
const { WebpayPlus } = pkg;

import 'dotenv/config'
import * as  webpayPlusController  from '../controllers/webpay_plus.js';

export const router = express.Router();


router.use((req, res, next) => {

  if (process.env.WPP_CC && process.env.WPP_KEY) {
    WebpayPlus.configureForProduction(process.env.WPP_CC, process.env.WPP_KEY);
  } else {
    WebpayPlus.configureForTesting();
  }
  next();
});


router
  .post("/create", webpayPlusController.create)
  .get("/commit", webpayPlusController.commit)
  .post("/commit", webpayPlusController.commit)
  .post("/status", webpayPlusController.status)
  .post("/refund", webpayPlusController.refund)



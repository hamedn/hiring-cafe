import Image from 'next/image';
import amazon from './amazon.png';
import amex from './amex.png';
import cartes_bancaires from './cartes_bancaires.png';
import cirrus from './cirrus.png';
import diners from './diners.png';
import directDebit from './directDebit.png';
import discover from './discover.png';
import ebay from './ebay.png';
import eway from './eway.png';
import google from './google.png';
import jcb from './jcb.png';
import maestro from './maestro.png';
import mastercard from './mastercard.png';
import paypal from './paypal.png';
import sage from './sage.png';
import shopify from './shopify.png';
import skrill from './skrill.png';
import unionpay from './unionpay.png';
import visa from './visa.png';
import western from './western.png';
import worldpay from './worldpay.png';
import stripe from './stripe.png';


const iconMap = {
  amazon: amazon,
  amex: amex,
  cartes_bancaires: cartes_bancaires,
  cirrus: cirrus,
  diners: diners,
  discover: discover,
  ebay: ebay,
  eway: eway,
  jcb: jcb,
  maestro: maestro,
  mastercard: mastercard,
  paypal: paypal,
  visa: visa,
  unionpay: unionpay,
  worldpay: worldpay,
  stripe: stripe,
};

export default function CardIcons({brand}) {
  const iconSrc = iconMap[brand] || iconMap.stripe;
  return <Image src={iconSrc} alt={brand} width={50} height={31} />;
};


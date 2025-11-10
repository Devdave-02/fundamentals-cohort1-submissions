const CryptoJS = require('crypto-js');
import dotenv, { decrypt } from "dotenv";
dotenv.config()

var firstKey = (process.env.ENC_KEY || "").padEnd(32, "0").slice(0, 32);
const key = CryptoJS.enc.Utf8.parse(firstKey);
const iv = CryptoJS.enc.Utf8.parse(process.env.IV);

// Encryption function
export const encryptData = (data: string) => {
  const ciphertext =  CryptoJS.AES.encrypt(data, key, {iv}).toString();
  return ciphertext;
}

// Decryption function
export const decryptData =  (ciphertext: string) => {
  const bytes =  CryptoJS.AES.decrypt(ciphertext, key, {iv});
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}


import { NextResponse } from "next/server";
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

// 生成RSA密钥对（只在首次加载时生成）
let publicKey, privateKey;

if (!publicKey || !privateKey) {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  publicKey = keyPair.publicKey;
  privateKey = keyPair.privateKey;
}

export async function GET() {
  return NextResponse.json({ publicKey: publicKey });
}

export async function POST(request) {
  try {
    const { encryptedData, encryptedKey } = await request.json();

    if (!encryptedData || !encryptedKey) {
      return NextResponse.json({ error: "Missing encryptedData or encryptedKey" }, { status: 400 });
    }
    console.log("encryptedData:", encryptedData);
    console.log("encryptedKey:", encryptedKey);

    // Decrypt AES key
    const decryptedKeyBuffer = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptedKey, 'base64')
    );  
    console.log("Decrypted AES key:", decryptedKeyBuffer.toString());
    
    const decryptedKey = decryptedKeyBuffer.toString();
    console.log("Decrypted AES key hex:", decryptedKey);
    
    const decipher = CryptoJS.AES.decrypt(encryptedData, decryptedKey).toString(CryptoJS.enc.Utf8);
    console.log("Decipher:", decipher);
    
    return NextResponse.json({ message: "Data received and processed successfully" , decipher:decipher});
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
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
    const { encryptedKey, fileName } = await request.json();

    if (!encryptedKey || !fileName) {
      return NextResponse.json({ error: "Missing encryptedKey or fileName" }, { status: 400 });
    }

    // Server only stores metadata
    return NextResponse.json({ 
      message: "File metadata received successfully",
      fileName: fileName 
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
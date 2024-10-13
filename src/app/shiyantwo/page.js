'use client';
import { useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import forge from 'node-forge';

export default function ShiyanTwo() {
  const [plaintext, setPlaintext] = useState('我喜欢上《网络空间安全理论与技术（乙）》课，我愿意接受这1次challenge！');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [file, setFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const fileInputRef = useRef(null);

  const encrypt = async () => {
      try {
        // Generate AES key
        const aesKey = CryptoJS.lib.WordArray.random(256/8);
        console.log('AES Key:', aesKey.toString());
        
        // const aesKeyBase64 = CryptoJS.enc.Base64.stringify(aesKey);
        // console.log('AES Key base64:', aesKeyBase64);
        const aeskeyhex = CryptoJS.enc.Hex.stringify(aesKey);
        console.log('AES Key hex:', aeskeyhex);
  
        // Encrypt plaintext with AES
        const encrypted = CryptoJS.AES.encrypt(plaintext, aeskeyhex).toString();
        console.log('Encrypted text:', encrypted);
  
        // Get server's RSA public key
        const response = await fetch('/api/shiyantwo', { method: 'GET' });
        const { publicKey } = await response.json();
        console.log('Received public key:', publicKey);
  
        // Encrypt AES key with RSA public key using forge with OAEP padding
        const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
        const buffer = forge.util.createBuffer(aesKey.toString(), 'raw');
        
        const encryptedAesKey = publicKeyObj.encrypt(buffer.getBytes(), 'RSA-OAEP', {
          md: forge.md.sha256.create(),
          mgf1: { md: forge.md.sha256.create() }
        });
  
        const encryptedAesKeyBase64 = forge.util.encode64(encryptedAesKey);
        console.log('Encrypted AES Key:', encryptedAesKeyBase64);
  
        // Send encrypted data to server
        const sendResponse = await fetch('/api/shiyantwo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encryptedData: encrypted, encryptedKey: encryptedAesKeyBase64 })
        });
  
        if (!sendResponse.ok) {
          throw new Error(`HTTP error! status: ${sendResponse.status}`);
        }
  
        const result = await sendResponse.json();
        setCiphertext(result.decipher);
      } catch (error) {
        console.error("Encryption error:", error);
        setCiphertext(`Error: ${error.message}`);
      }
    };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">加密传输系统</h1>

      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded text-black"
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)}
          rows="4"
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={encrypt}
      >
        加密并发送文本
      </button>

      {ciphertext && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">加密后的文本:</h2>
          <p className="mt-2 p-2 bg-gray-100 rounded text-black">{ciphertext}</p>
        </div>
      )}
    </div>
  );
}
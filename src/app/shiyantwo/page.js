"use client";
import { useState, useRef } from "react";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import forge from "node-forge";

export default function ShiyanTwo() {
  const [plaintext, setPlaintext] = useState(
    "我喜欢上《网络空间安全理论与技术（乙）》课，我愿意接受这1次challenge！",
  );
  const [ciphertext, setCiphertext] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [file, setFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [decryptedFile, setDecryptedFile] = useState(null);
  const fileInputRef = useRef(null);

  const encrypt = async () => {
    try {
      // Generate AES key
      const aesKey = CryptoJS.lib.WordArray.random(256 / 8);
      console.log("AES Key:", aesKey.toString());

      // const aesKeyBase64 = CryptoJS.enc.Base64.stringify(aesKey);
      // console.log('AES Key base64:', aesKeyBase64);
      const aeskeyhex = CryptoJS.enc.Hex.stringify(aesKey);
      console.log("AES Key hex:", aeskeyhex);

      // Encrypt plaintext with AES
      const encrypted = CryptoJS.AES.encrypt(plaintext, aeskeyhex).toString();
      console.log("Encrypted text:", encrypted);

      // Get server's RSA public key
      const response = await fetch("/api/shiyantwo", { method: "GET" });
      const { publicKey } = await response.json();
      console.log("Received public key:", publicKey);

      // Encrypt AES key with RSA public key using forge with OAEP padding
      const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
      const buffer = forge.util.createBuffer(aesKey.toString(), "raw");

      const encryptedAesKey = publicKeyObj.encrypt(
        buffer.getBytes(),
        "RSA-OAEP",
        {
          md: forge.md.sha256.create(),
          mgf1: { md: forge.md.sha256.create() },
        },
      );

      const encryptedAesKeyBase64 = forge.util.encode64(encryptedAesKey);
      console.log("Encrypted AES Key:", encryptedAesKeyBase64);

      // Send encrypted data to server
      const sendResponse = await fetch("/api/shiyantwo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encryptedData: encrypted,
          encryptedKey: encryptedAesKeyBase64,
        }),
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

  const encryptFile = async () => {
    if (!file) {
      alert("请先选择文件");
      return;
    }
  
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = new Uint8Array(e.target.result);
        
        // Generate AES key
        const aesKey = CryptoJS.lib.WordArray.random(256 / 8);
        const aesKeyHex = CryptoJS.enc.Hex.stringify(aesKey);
  
        // Encrypt file content
        const wordArray = CryptoJS.lib.WordArray.create(fileContent);
        const encrypted = CryptoJS.AES.encrypt(wordArray, aesKeyHex);
        const encryptedBase64 = encrypted.toString();
  
        // Get server's RSA public key
        const response = await fetch("/api/file", { method: "GET" });
        const { publicKey } = await response.json();
  
        // Encrypt AES key with RSA public key
        const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
        const encryptedAesKey = publicKeyObj.encrypt(aesKeyHex, 'RSA-OAEP', {
          md: forge.md.sha256.create(),
          mgf1: { md: forge.md.sha256.create() }
        });
        const encryptedAesKeyBase64 = forge.util.encode64(encryptedAesKey);
  
        // Create encrypted file blob
        const encryptedBlob = new Blob([encryptedBase64], { type: "text/plain" });
        const encryptedFileUrl = URL.createObjectURL(encryptedBlob);
        setEncryptedFile({
          url: encryptedFileUrl,
          name: `${file.name}.encrypted`,
        });
  
        // Send only metadata to server
        const sendResponse = await fetch("/api/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            encryptedKey: encryptedAesKeyBase64,
            fileName: file.name,
          }),
        });
  
        if (!sendResponse.ok) {
          throw new Error(`HTTP error! status: ${sendResponse.status}`);
        }
  
        // No need to handle server response for decryption
        // Decrypt file locally
        const decrypted = CryptoJS.AES.decrypt(encryptedBase64, aesKeyHex);
        const decryptedArray = convertWordArrayToUint8Array(decrypted);
        const decryptedBlob = new Blob([decryptedArray], { type: "application/octet-stream" });
        const decryptedFileUrl = URL.createObjectURL(decryptedBlob);
        setDecryptedFile({ url: decryptedFileUrl, name: file.name });
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("文件加密错误:", error);
      alert(`文件加密错误: ${error.message}`);
    }
  };
  
  // Convert WordArray to Uint8Array
  function convertWordArrayToUint8Array(wordArray) {
    const arrayBuffer = new ArrayBuffer(wordArray.sigBytes);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < wordArray.sigBytes; i++) {
      uint8Array[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return uint8Array;
  }

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
          <p className="mt-2 p-2 bg-gray-100 rounded text-black">
            {ciphertext}
          </p>
        </div>
      )}

      <div className="mt-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => fileInputRef.current.click()}
        >
          选择文件
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={encryptFile}
        >
          加密并发送文件
        </button>
      </div>

      {file && <p className="mt-2">已选择文件: {file.name}</p>}

      {encryptedFile && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">加密后的文件:</h2>
          <a href={encryptedFile.url} download={encryptedFile.name} className="text-blue-500 underline">
            下载加密文件
          </a>
        </div>
      )}
      {decryptedFile && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">解密后的文件:</h2>
          <a
            href={decryptedFile.url}
            download={decryptedFile.name}
            className="text-blue-500 underline"
          >
            下载解密文件
          </a>
        </div>
      )}
    </div>
  );
}

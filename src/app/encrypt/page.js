"use client";
import { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function EncryptPage() {
  const [text, setText] = useState('');
  const [textEncryptKey, setTextEncryptKey] = useState('');
  const [textDecryptKey, setTextDecryptKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [file, setFile] = useState(null);
  const [fileEncryptKey, setFileEncryptKey] = useState('');
  const [fileDecryptKey, setFileDecryptKey] = useState('');
  const [encryptedFile, setEncryptedFile] = useState(null);

  // RC4 加密文本
  const encryptText = () => {
    const encrypted = CryptoJS.RC4.encrypt(text, textEncryptKey).toString();
    setEncryptedText(encrypted);
  };

  // RC4 解密文本
  const decryptText = () => {
    const decrypted = CryptoJS.RC4.decrypt(encryptedText, textDecryptKey).toString(CryptoJS.enc.Utf8);
    setDecryptedText(decrypted);
  };

  // RC4 加密文件
  const encryptFile = () => {
    if (!file || !fileEncryptKey) {
      alert('请选择文件并输入加密密钥');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const wordArray = CryptoJS.lib.WordArray.create(event.target.result);
      const encrypted = CryptoJS.RC4.encrypt(wordArray, fileEncryptKey);
      const encryptedFile = new Blob([encrypted], { type: 'application/octet-stream' });
      setEncryptedFile(encryptedFile);

      // 下载加密后的文件
      const url = URL.createObjectURL(encryptedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'encrypted_' + file.name;
      a.click();
    };
    reader.readAsArrayBuffer(file);
  };

  // RC4 解密文件
  const decryptFile = () => {
    if (!file || !fileDecryptKey) {
      alert('请选择文件并输入解密密钥');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const decrypted = CryptoJS.RC4.decrypt(event.target.result, fileDecryptKey);
        const typedArray = convertWordArrayToUint8Array(decrypted);
        const decryptedFile = new Blob([typedArray], { type: file.type });
        const url = URL.createObjectURL(decryptedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'decrypted_' + file.name;
        a.click();
      } catch (error) {
        alert('解密失败，请检查密钥是否正确');
      }
    };
    reader.readAsText(file);
  };

  // 辅助函数：将 WordArray 转换为 Uint8Array
  function convertWordArrayToUint8Array(wordArray) {
    const len = wordArray.words.length;
    const u8Array = new Uint8Array(len << 2);
    let offset = 0;
    for (let i = 0; i < len; i++) {
      const word = wordArray.words[i];
      u8Array[offset++] = word >> 24;
      u8Array[offset++] = (word >> 16) & 0xff;
      u8Array[offset++] = (word >> 8) & 0xff;
      u8Array[offset++] = word & 0xff;
    }
    return u8Array;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">RC4 加解密系统</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">文本加解密</h2>
        <input
          type="text"
          placeholder="输入明文"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 mr-2 text-black"
        />
        <input
          type="text"
          placeholder="输入加密密钥"
          value={textEncryptKey}
          onChange={(e) => setTextEncryptKey(e.target.value)}
          className="border p-2 mr-2 text-black"
        />
        <button onClick={encryptText} className="bg-blue-500 text-white p-2 mr-2">加密</button>
        <br />
        <input
          type="text"
          placeholder="输入解密密钥"
          value={textDecryptKey}
          onChange={(e) => setTextDecryptKey(e.target.value)}
          className="border p-2 mr-2 mt-2 text-black"
        />
        <button onClick={decryptText} className="bg-green-500 text-white p-2 mt-2">解密</button>
      </div>

      <div className="mb-4">
        <p>加密结果: {encryptedText}</p>
        <p>解密结果: {decryptedText}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">文件加密</h2>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          className="mb-2" 
        />
        <input
          type="text"
          placeholder="输入文件加密密钥"
          value={fileEncryptKey}
          onChange={(e) => setFileEncryptKey(e.target.value)}
          className="border p-2 mr-2 text-black"
        />
        <button onClick={encryptFile} className="bg-blue-500 text-white p-2 mr-2">加密文件</button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">文件解密</h2>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          className="mb-2" 
        />
        <input
          type="text"
          placeholder="输入文件解密密钥"
          value={fileDecryptKey}
          onChange={(e) => setFileDecryptKey(e.target.value)}
          className="border p-2 mr-2 text-black"
        />
        <button onClick={decryptFile} className="bg-green-500 text-white p-2">解密文件</button>
      </div>
    </div>
  );
}
"use client";
import { useState } from 'react';

// RC4 加密函数 (修改为处理 Uint8Array)
function rc4Encrypt(key, data) {
  const S = new Array(256);
  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }

  let i = 0;
  j = 0;
  const output = new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    const t = (S[i] + S[j]) % 256;
    output[k] = data[k] ^ S[t];
  }

  return output;
}

// RC4 解密函数 (与加密相同)
const rc4Decrypt = rc4Encrypt;

export default function ShiyanOne() {
  const [text, setText] = useState('');
  const [textEncryptKey, setTextEncryptKey] = useState('');
  const [textDecryptKey, setTextDecryptKey] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [file, setFile] = useState(null);
  const [fileEncryptKey, setFileEncryptKey] = useState('');
  const [fileDecryptKey, setFileDecryptKey] = useState('');

  // RC4 加密文本
  const encryptText = () => {
    const textEncoder = new TextEncoder();
    const textData = textEncoder.encode(text);
    const encrypted = rc4Encrypt(textEncryptKey, textData);
    setEncryptedText(btoa(String.fromCharCode.apply(null, encrypted)));
  };

  // RC4 解密文本
  const decryptText = () => {
    try {
      const encryptedData = new Uint8Array(atob(encryptedText).split('').map(char => char.charCodeAt(0)));
      const decrypted = rc4Decrypt(textDecryptKey, encryptedData);
      const textDecoder = new TextDecoder();
      setDecryptedText(textDecoder.decode(decrypted));
    } catch (error) {
      alert('解密失败,请检查密钥是否正确');
    }
  };

  // RC4 加密文件
  const encryptFile = () => {
    if (!file || !fileEncryptKey) {
      alert('请选择文件并输入加密密钥');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = new Uint8Array(event.target.result);
      const encrypted = rc4Encrypt(fileEncryptKey, content);
      const blob = new Blob([encrypted], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
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
        const content = new Uint8Array(event.target.result);
        const decrypted = rc4Decrypt(fileDecryptKey, content);
        const blob = new Blob([decrypted], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'decrypted_' + file.name;
        a.click();
      } catch (error) {
        alert('解密失败，请检查密钥是否正确');
      }
    };
    reader.readAsArrayBuffer(file);
  };

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
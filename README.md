# **Secure JSON Signing Test (TypeScript + Node Crypto)**

A minimal, modern TypeScript project demonstrating how to **sign**, **verify**, and **tamper‑check** JSON data using **RSA‑PSS (SHA‑256)**. This pattern is ideal for offline‑first apps that need **data integrity without a backend**, such as mobile apps storing user progress locally.

This repo was created to validate a backup strategy for a mobile app. The approach is fully generic and can be reused in any project that needs portable, tamper‑resistant JSON backups.

---

## **✨ What this project demonstrates**

- Generating RSA keypairs using Node’s `crypto` module  
- Canonicalizing JSON for deterministic signing  
- Signing payloads using **RSA‑PSS + SHA‑256**  
- Embedding the public key inside the backup file  
- Verifying signatures across environments  
- Detecting tampering with absolute certainty  
- A clean, portable JSON backup format

This mirrors the exact flow you’d use with:

- Android Keystore  
- iOS Keychain  
- Capacitor plugins  
- Offline‑first mobile apps  

---

## **📦 Project Structure**

```
.
├── canonicalize.ts      # Deterministic JSON serializer
├── test-signing.ts      # Signing + verification test script
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## **🚀 Getting Started**

### **Install dependencies**

```bash
npm install
```

### **Run the signing test**

```bash
npm start
```

You should see:

- A generated backup JSON  
- `Signature valid: true`  
- `Tampered valid: false`  

This confirms the signing pipeline works end‑to‑end.

---

## **🔐 Why canonical JSON?**

Cryptographic signatures require **byte‑for‑byte identical** input.  
`JSON.stringify` is *not* stable across platforms or runtimes.

Canonicalization ensures:

- Sorted keys  
- Stable formatting  
- Cross‑platform consistency  
- Reliable verification on any device  

This makes the backup format portable and future‑proof.

---

## **🧩 Backup File Structure**

The generated backup file looks like this:

```json
{
  "version": 1,
  "timestamp": "2026-01-11T17:40:43.786Z",
  "payload": {
    id: 12450,
    data: [
        { id: "test1", created: "2026-01-05T10:12:00Z" },
        { id: "test2", created: "2026-01-07T18:45:00Z" }
    ]
  },
  "signature": {
    "algorithm": "RSA-PSS-SHA256",
    "publicKey": "-----BEGIN PUBLIC KEY----- ...",
    "value": "BASE64_SIGNATURE"
  }
}
```

### **Key points**

- Only the `payload` is signed  
- The public key is embedded for portability  
- The private key never leaves the device  
- Any modification to the payload invalidates the signature  

---

## **🛠 How to Use This in a Real App**

This pattern is ideal for:

- Offline‑first apps  
- Local‑only save files  
- User‑controlled backups  
- Apps without a backend  
- Secure import/export flows  

On mobile, you’d replace Node’s keypair generation with:

- **Android Keystore** (RSA or EC)  
- **iOS Keychain** (EC recommended)  

The rest of the flow stays identical.

---

## **📄 License**

MIT — feel free to use, modify, and adapt this for your own projects.

---

## **💬 Contributing**

If you want to extend this with:

- AES‑GCM encryption  
- EC keys (P‑256)  
- Capacitor plugins  
- CLI tools  
- RFC‑8785 canonical JSON  

Pull requests are welcome.

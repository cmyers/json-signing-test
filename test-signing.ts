// test-signing.ts
import {
    generateKeyPairSync,
    createSign,
    createVerify,
    constants
} from "crypto";
import { canonicalize } from "./canonicalize.js";

// 1. Generate a test RSA keypair (Android/iOS would generate this in secure storage)
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
});

// 2. Example payload
const payload = {
    id: 12450,
    data: [
        { id: "test1", created: "2026-01-05T10:12:00Z" },
        { id: "test2", created: "2026-01-07T18:45:00Z" }
    ]
};

// 3. Canonical JSON we can't trust Json.stringify for this
const canonical = canonicalize(payload);
const canonicalBytes = Buffer.from(canonical, "utf8");

// 4. Sign the payload
const signer = createSign("RSA-SHA256");
signer.update(canonicalBytes);
signer.end();

const signature = signer.sign({
    key: privateKey,
    padding: constants.RSA_PKCS1_PSS_PADDING,
    saltLength: 32
}).toString("base64");

// 5. Build the backup object
const backup = {
    version: 1,
    timestamp: new Date().toISOString(),
    payload,
    signature: {
        algorithm: "RSA-PSS-SHA256",
        publicKey: publicKey.export({ type: "spki", format: "pem" }),
        value: signature
    }
};

console.log("Backup JSON:", JSON.stringify(backup, null, 2));

// 6. Verification
const verifier = createVerify("RSA-SHA256");
verifier.update(Buffer.from(canonicalize(backup.payload), "utf8"));
verifier.end();

const isValid = verifier.verify(
    {
        key: backup.signature.publicKey,
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32
    },
    Buffer.from(backup.signature.value, "base64")
);


console.log("Signature valid:", isValid);

// 7. Tamper test
backup.payload.data = [
    { id: "test1", created: "2026-01-10T12:00:00Z" },
];

const tamperedCanonical = canonicalize(backup.payload);
const tamperedVerifier = createVerify("RSA-SHA256");
tamperedVerifier.update(Buffer.from(tamperedCanonical, "utf8"));
tamperedVerifier.end();

const tamperedValid = tamperedVerifier.verify(
    {
        key: backup.signature.publicKey,
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32
    },
    Buffer.from(backup.signature.value, "base64")
);

console.log("Tampered valid:", tamperedValid);
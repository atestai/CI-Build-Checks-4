
import { createHash, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import jsonwebtoken from "jsonwebtoken"

const jwt_key = '7413ebea73f2459e162308026425907a48581676523c9b4bd45ae0338359a0083375acfc155a039e6d584708fe81daa486339e62abbd5bdf50e6d49870e3e0a2627ef42bd43ba7decf1bdfb8d2bd21cacde5070140cfb2d2c0b9e0c28d85c176b90b449e9eb653163550e8976a79a3b2ff9a6d299da209f69909c27dd957b807c324141b056f619658d010b67028d2d0b43c319d71352ff624c4577771925e5fd32ed0fd8251d0cbe3cbf2f8cab684ac81918d4809479068f2d2c563b2b99d8d9527329283d301ac90c09da2ecb83a0ca2ab8601d156616707be1ae14e14297ad9eb5dee399233b0155a7d511d1098f939ec91084ef7717cf084bf22fe082fee'
const secondExpiredTimeShort = 1800;


const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = {
    "type": "Buffer",
    "data": [179,113,2,163,229,245,114,197,193,59,14,160,99,235,64,78,116,248,204,100,226,147,22,29,74,214,57,215,189,65,1,237]
};

const iv = randomBytes(16);

//Encrypting text
function encrypt(text) {
   let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
    
   let iv = Buffer.from(text.iv, 'hex');
   let encryptedText = Buffer.from(text.encryptedData, 'hex');

   let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);

   decrypted = Buffer.concat([decrypted, decipher.final()]);

   return decrypted.toString();
}


function verify(token) {
    return jsonwebtoken.verify(token, jwt_key)
}

function verifyToken(request, ws = null) {
    
    const url = new URL(request.url, `http://${request.headers.host}`);
  
    const token = url.searchParams.get('token'); // Ottieni il token dalla query string

    if (!token) {
        if (ws) ws.close(4001, 'Token missing');
        throw new Error('Token missing');
    }
   
    try {
        const { data: decodedData } = this.verify(token);
        const auth = JSON.parse(this.decrypt(decodedData));

        if (!auth || auth.grant_type !== 'password') {
            if (ws) ws.close(4002, 'Invalid token');
            throw new Error('Invalid token');
        }

        // Token valido, restituisci l'utente
        return auth.data;
    } catch (error) {
        if (ws) ws.close(4003, 'Unauthorized: Invalid or expired token');
        throw new Error('Unauthorized: Invalid or expired token');
    }
}


export default {
    decrypt,
    encrypt,
    md5 : data => createHash("md5").update(data).digest("hex"),
    sha1 : data => createHash("sha1").update(data, "binary").digest("hex"),
    sing : platform => jsonwebtoken.sign({
            exp : new Date ((new Date).getTime() + (secondExpiredTimeShort * 1000)).getTime()/1000,
            data :  encrypt( JSON.stringify(platform) )
        }, jwt_key),

    verify,
    verifyToken,
    randomBytes : number => randomBytes(number)
};
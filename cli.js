const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')
const readline = require('readline')
const prisma = new PrismaClient()

async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve({ salt, hash: derivedKey.toString('hex') });
        });
    });
}

function askText(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}


async function main() {
    if (process.argv[2] == 'createadmin') {
        const username = process.argv[3]
        if (!username) {
            console.log('Please provide a username')
            return
        }

        const email = await askText('Email: ')
        const password = await askText('Password: ')

        const { salt, hash } = await hashPassword(password)
        await prisma.user.create({
            data: {
                username: username,
                passwordHash: hash,
                passwordSalt: salt,
                email: email,
                isAdmin: true,
            }
        })

    } else {
        console.log('Unknown command')
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
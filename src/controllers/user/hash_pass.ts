import bcrypt from 'bcrypt';

async function hashPass(password: string) {
    var hashedPassword;

    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    } else {
        hashedPassword = null;
    }

    return hashedPassword;
}

export default hashPass;
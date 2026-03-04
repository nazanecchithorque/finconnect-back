const bcrypt = require("bcrypt");

async function main() {
    let password = process.argv[2];

    if (!password) {
        password = stdinData; // ✅
    }

    password = (password || "").replace(/\r?\n+$/g, "");

    if (!password) {
        console.error(
            "Por favor provee la contraseña como argumento o por stdin."
        );
        process.exit(1);
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        console.log(hash);
    } catch (err) {
        console.error(
            "Error al hashear:",
            err && err.message ? err.message : err
        );
        process.exit(1);
    }
}

main();
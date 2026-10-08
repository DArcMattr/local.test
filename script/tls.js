import { execSync } from "node:child_process"
import { mkdirSync } from "node:fs"

const host = process.env.DEV_HOST || "local.localhost"
const ip = process.env.DEV_IP || "127.0.0.1"
const certFile = `./tls/${host}.pem`;
const keyFile = `./tls/${host}-key.pem`;
// TODO: check if mkcert exists
const command = `mkcert -cert-file ${certFile} -key-file ${keyFile} ${host} localhost ${ip}`;

mkdirSync("./tls", { recursive: true });
try {
	execSync(command, { stdio: "inherit" });
} catch (error) {
	process.exit(1);
}

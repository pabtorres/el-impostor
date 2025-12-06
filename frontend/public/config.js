// Detect local dev (localhost, 127.0.0.1, or private LAN IPs like 192.168.x.x / 10.x.x.x / 172.16-31.x.x)
const host = window.location.hostname;
const isLocalhost = host === 'localhost' || host === '127.0.0.1';
const isPrivateIp = /^((10\.)|(192\.168\.)|(172\.(1[6-9]|2[0-9]|3[0-1])\.))/.test(host);

window.APP_CONFIG = {
  backendUrl: (isLocalhost || isPrivateIp)
    ? 'http://localhost:4000'
    : 'https://impostor-backend-production-941e.up.railway.app'
};

import type { NextConfig } from "next";
import os from "os";

// Detectar automáticamente todas las IPs de red local del equipo
const getLocalIPs = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Solo IPv4 que no sean loopback
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
};

const nextConfig: NextConfig = {
  // Permitir automáticamente todos los dispositivos en cualquier red local
  allowedDevOrigins: getLocalIPs(),
};

export default nextConfig;

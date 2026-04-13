module.exports = {
  apps: [{
    name: 'enakko-stock',
    script: 'server.js',
    cwd: '/root/enakko-stock-dashboard/.next/standalone/enakko-stock-dashboard',
    env: {
      PORT: 3001,
      HOSTNAME: '0.0.0.0',
    },
  }]
}

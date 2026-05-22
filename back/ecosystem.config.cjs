module.exports = {
  apps: [
    {
      name: 'SoundHubBackend',
      cwd: '/var/www/apps/soundhub/back',
      script: './dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
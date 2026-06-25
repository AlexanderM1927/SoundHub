module.exports = {
  apps: [
    {
      name: 'SoundHubYoutubeService',
      cwd: '/var/www/apps/soundhub-youtube',
      script: './youtube-microservice.mjs',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '350M',
      env: {
        NODE_ENV: 'production',
        PORT: 9000
      }
    }
  ]
}

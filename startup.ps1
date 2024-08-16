pm2 stop all
pm2 start index.js --name crumbl --watch --ignore-watch="node_modules" --restart-delay 3600000
pm2 restart crumbl
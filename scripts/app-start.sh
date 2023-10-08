# restart nginx
echo "restart nginx"
sudo service nginx restart

# restart pm2
echo "restart pm2"
pm2 restart my-ml
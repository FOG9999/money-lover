# MOST IMPORTANT LINE - INCUDE ALL PATHs (ENVIRONMENTs) FOR USER
source /home/ec2-user/.bash_profile
echo "Source environment loaded"

# backup current html folder nginx
echo "backup current html folder nginx"
cd /home/ec2-user/money-lover/cicd/backup
zip -r "cicd-fe-bk-$(date +"%Y-%m-%d").zip" /usr/share/nginx/html

# backup backend scripts
echo "backup backend scripts"
zip -r "cicd-be-bk-$(date +"%Y-%m-%d").zip" ../../backend -x ../../backend/node_modules/**\* -x ../../backend/database/**\*

# upload backups to s3
echo "upload backups to s3"
aws s3 cp ./ s3://my-ml-cicd/backup/ --recursive

# backup database
echo "backup database"

# delete all files in html folder nginx
echo "delete all files in html folder nginx"

# copy new files from frontend built folder to html folder nginx
echo "copy new files from frontend built folder to html folder nginx"

# overwrite backend scripts
echo "overwrite backend scripts"

# restart nginx
echo "restart nginx"

# restart pm2
echo "restart pm2"

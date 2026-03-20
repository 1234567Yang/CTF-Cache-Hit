index.ts 404 里面图片的路径 127.0.0.1 是hint，不要动

index.html 里面的 about us 故意 404，不要动

服务器内存小：
```
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```
cnpmjs.org
=======

# 制作镜像
```shell
cd /home/git/cnpm/cnpmjs.org
docker build -t registry.ispacesys.cn:5000/cnpm/cnpmjs.org:3.0.0-alpha.8 . \
&& docker push registry.ispacesys.cn:5000/cnpm/cnpmjs.org:3.0.0-alpha.8
```

# 修改内容

## registryProtocol
增加registryProtocol参数，强制设置返回的gaz文件为https
config/index.js
lib/common.js

## config by env
将部分参数设置成环境变量进行设置
config/config.js

## upgrade package.json
去掉sqlite3，不适用sqllite3，这个引用在编译时容易失败
package.json


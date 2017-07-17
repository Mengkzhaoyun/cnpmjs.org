FROM registry.ispacesys.cn:5000/public/node:8.0.0-slim
MAINTAINER Mengkzhaoyun <mengkzhaoyun@gmail.com>

# Working enviroment
ENV \
    CNPM_DIR="/var/app/cnpmjs.org" \
    CNPM_DATA_DIR="/var/data/cnpm_data" 

RUN mkdir  -p ${CNPM_DIR}

WORKDIR ${CNPM_DIR}

COPY package.json ${CNPM_DIR}

RUN npm set registry https://registry.npm.taobao.org \
&& npm install \
&& rm -rf /tmp/* /var/cache/yum/* /root/.npm /root/.node-gyp

COPY .  ${CNPM_DIR}
COPY config/config.js  ${CNPM_DIR}/config/

EXPOSE 7001/tcp 7002/tcp

VOLUME ["/var/data/cnpm_data"]

# Entrypoint
CMD ["node", "dispatch.js"]


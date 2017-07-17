'use strict';

var crypto = require('crypto');
var path = require('path');
var config = require('../config');
var util = require('util');

exports.getTarballFilepath = function (filename) {
  // ensure download file path unique
  // TODO: not only .tgz, and also other extname
  var name = filename.replace(/\.tgz$/, '.' + crypto.randomBytes(16).toString('hex') + '.tgz');
  return path.join(config.uploadDir, name);
};

exports.getCDNKey = function (name, filename) {
  // if name is scope package name, need to auto fix filename as a scope package file name
  // e.g.: @scope/foo, filename: foo-1.0.0.tgz => filename: @scope/foo-1.0.0.tgz
  if (name[0] === '@' && filename[0] !== '@') {
    filename = name.split('/')[0] + '/' + filename;
  }
  return '/' + name + '/-/' + filename;
};

// edit by mengkzhaoyun@gmail.com
// 2017.07.17
// 修改protocol，由于使用反向代理来访问registry，反向代理是http，但是客户端请求的是https，
// 这里增加一个全局配置registryProtocol，设置为https，在此生效
exports.setDownloadURL = function (pkg, ctx, host) {
  if (pkg.dist) {
    host = host || config.registryHost || ctx.host;
    pkg.dist.tarball = util.format('%s://%s/%s/download/%s-%s.tgz',
      config.registryProtocol,
      host, pkg.name, pkg.name, pkg.version);
  }
};
// end by mengkzhaoyun@gmail.com

exports.isAdmin = function (username) {
  return typeof config.admins[username] === 'string';
};

exports.isMaintainer = function (user, maintainers) {
  if (user.isAdmin) {
    return true;
  }

  var username = user.name;
  maintainers = maintainers || [];
  var match = maintainers.filter(function (item) {
    return item.name === username;
  });

  return match.length > 0;
};

exports.isLocalModule = function (mods) {
  for (var i = 0; i < mods.length; i++) {
    var r = mods[i];
    if (r.package && r.package._publish_on_cnpm) {
      return true;
    }
  }
  return false;
};

exports.isPrivateScopedPackage = function (name) {
  if (name[0] !== '@') {
    return false;
  }
  return config.scopes.indexOf(name.split('/')[0]) >= 0;
};

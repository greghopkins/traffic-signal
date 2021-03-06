# Traffic Signal ![Build Status](http://img.shields.io/travis/greghopkins/traffic-signal/master.png?style=flat-square)

This application helps us at [Rivers Agile Solutions](http://www.riversagile.com/) interact with a full-size traffic light that we have wired up with a [Beaglebone](http://beagleboard.org/bone) and some relays. The application runs directly on the Beaglebone.

<img src="http://i.imgur.com/sHSuIWT.jpg" width="200">
<img src="http://i.imgur.com/zSyXIq0.jpg" width="200">
<img src="http://i.imgur.com/sLxEzAD.jpg" width="200">

## Quick Start

To ease the pain of understanding the Beaglebone environment (and getting some native things to compile), a Vagrantfile has been provided. It closely approximates what is running on the Beaglebone, although it is not exact.

After installing and configuring Vagrant, the following will get you up and running:
`vagrant up`

The Vagrant shell provisioning does not currently setup any applications. (running `npm install` etc.) You will have to perform those steps manually.

## Running the Tests

To run the tests, execute either `npm test` or `mocha` in the Vagrant shell (accessed with `vagrant ssh`).

## Known Issues

- During provisioning, you might see some weird errors from `node-gyp` regarding filesystem permissions - please ignore.

```
==> default: gyp
==> default:
==> default: WARN
==> default:
==> default: EACCES
==> default:  user "root" does not have permission to access the dev dir "/root/.node-gyp/0.10.40"
==> default: gyp
==> default:
==> default: WARN
==> default:
==> default: EACCES
==> default:  attempting to reinstall using temporary dev dir "/usr/lib/node_modules/bonescript/node_modules/i2c/.node-gyp"
```

- During project `npm install`, you might get error messages during binary symlinking. Since we aren't interested in this (or any other binary) at present, `npm install --no-bin-links` should resolve.

```
vagrant@debian-wheezy:/vagrant$ npm install
npm ERR! Error: UNKNOWN, symlink '../mime/cli.js'
npm ERR! If you need help, you may report this *entire* log,
npm ERR! including the npm and node versions, at:
npm ERR!     <http://github.com/npm/npm/issues>

npm ERR! System Linux 3.2.0-4-amd64
npm ERR! command "/usr/bin/node" "/usr/bin/npm" "install"
npm ERR! cwd /vagrant
npm ERR! node -v v0.10.40
npm ERR! npm -v 1.4.28
npm ERR! path ../mime/cli.js
npm ERR! code UNKNOWN
npm ERR! errno -1
npm ERR! not ok code 0
```

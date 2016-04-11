Etcher CLI
==========

[![dependencies](https://david-dm.org/resin-io/etcher-cli.png)](https://david-dm.org/resin-io/etcher-cli.png)

Join our online chat at [![Gitter chat](https://badges.gitter.im/resin-io/chat.png)](https://gitter.im/resin-io/chat)

The easy way to burn images in all operating systems
----------------------------------------------------

An image burner with support for Windows, OS X and GNU/Linux.

- [**Installing**](https://github.com/resin-io/etcher-cli#installation)
- [**Support**](https://github.com/resin-io/etcher-cli/issues/new)

See the [Etcher GUI](https://github.com/resin-io/etcher).

**Notice:** Etcher is in a very early state and things might break or not work at all in certain setups.

Installation
------------

```sh
npm install -g etcher-cli
```

Usage
-----

```sh
etcher path/to/image.img
```

Troubleshooting
---------------

Set the `DEBUG` environment variable to get stacktraces:

```sh
DEBUG=true etcher path/to/image.img
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/resin-io/etcher-cli/issues/new) on GitHub and the Resin.io team will be happy to help.

License
-------

Etcher is free software, and may be redistributed under the terms specified in the [license](https://github.com/resin-io/etcher-cli/blob/master/LICENSE).

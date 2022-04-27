My happy funtime scratch website
================================

Assumptions
-----------

* You're on a Unix-like environment
* You have nginx
* current NodeJS
* `mkcert`_
* You're developing for current evergreen browsers that are available on a Unix-like environment
* zsh is your shell with the `autoenv`_ module

Setup
-----

Pick a domain name ``<domain>`` to replace ``local.test``, or stick with what you
get here. You'll need to create an ``/etc/hosts`` entry.

Create TLS certificates by running `npm run tls`

Copy and modify the various ``*.template`` files.

Run ``npm install``


.. _autoenv: https://github.com/zpm-zsh/autoenv
.. _mkcert: https://mkcert.org/

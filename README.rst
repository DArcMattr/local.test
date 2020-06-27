My happy funtime scratch website
================================

Assumptions
-----------

You have nginx, current NodeJS, `mkcert`_, zsh is your shell, and you
have the `autoenv`_ module running.

Setup
-----

Pick a domain name `<domain>` to replace `local.test`, or stick with it.

Create TLS certificats via

.. code-block:: sh

	mkdir tls
	cd tls
	mkcert <domain>

Copy and modify the various ``*.template`` files.

Run ``npm install``


.. _autoenv: https://github.com/zpm-zsh/autoenv
.. _mkcert: https://mkcert.org/

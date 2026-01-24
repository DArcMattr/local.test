My happy funtime scratch website
================================

Assumptions
-----------

* You're on a Unix-like environment
* You have nginx
* current NodeJS configured to use `pnpm`
* `mkcert`_
* You're developing for current evergreen browsers that are available on a Unix-like environment
* zsh is your shell with the `autoenv`_ module active

Setup
-----

Copy and modify the ``.in.template`` file to suit. Note that the environment variable `BROWSERSYNC_HOST` drives much of the functionality of this project, so it must be actively loaded.
Using the localhost TLD does not require a `/etc/hosts` change.

Once the `.in` file is created and edited from `.in.template` and all its environment variables are loaded, run the following commands to get started:

.. code-block:: sh
	pnpm install
	pnpm run tls
	docker compose up -d

Browsersync is part of the installed tools here, and is run through `pnpm run bsync`.

.. _autoenv: https://github.com/zpm-zsh/autoenv
.. _mkcert: https://mkcert.org/

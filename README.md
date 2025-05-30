# BAID Speaker

A streamlined platform for BAID Speaker. Built with Next.js.

## Get Started

To run in production:

* Using `pm2` allows for proper deployment in production.

To run in development:

* Ensure that you have node.js and npm available.
* Run `npm install`.
* Copy `.env.example` to `.env` and fill the following environment variables:

| Name                     | Description                                                                                                     |
|--------------------------|-----------------------------------------------------------------------------------------------------------------|
| `DATABASE_URL`           | The database URL to use. PostgreSQL is required.                                                                |
| `JWT_SECRET`             | The JWT secret key to use. You can generate one with `openssl rand -hex 32`.                                    |
| `HOST`                   | The location where this service is hosted. No trailing slashes.                                                 |
| `UPLOAD_PATH`            | The directory where uploaded files are stored. In development, this is `public/uploads`.                        |
| `UPLOAD_SERVE_PATH`      | The path where uploaded files are served. In development, this is `uploads`.                                    |
| `BOTTOM_TEXT`            | In case you need this.                                                                                          |
| `ONELOGIN_HOST`          | The location where [OneLogin](https://github.com/WebArtistryBAID/baid-onelogin) is hosted. No trailing slashes. |
| `ONELOGIN_CLIENT_ID`     | OneLogin client ID. `basic` and `phone` scopes are required.                                                    |
| `ONELOGIN_CLIENT_SECRET` | OneLogin client secret.                                                                                         |

* Run `npm run dev`.

## Contribution

To contribute, simply open a pull request.

## License

```
    A streamlined platform for BAID Speaker.
    Copyright (C) 2024  Team WebArtistry

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

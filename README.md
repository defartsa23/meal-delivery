# meal-delivery

[![GitHub](https://img.shields.io/github/license/defartsa23/shuffle-dice-sicbo)](https://opensource.org/licenses/MIT)

## Installation Database
Pertama buka file .env dan Dockerfile, lalu sesuaikan variabel DATABASE_URL agar terlihat sebagai berikut:
```
DATABASE_URL="mysql://{username}:{password}@{host}:{port}/{database}"
```
Lalu run perintah berikut:

```bash
$ npx prisma migrate dev --name init
$ npx prisma db seed
```

## Create docker container
```bash
$ sh deploy_script.sh
```

## Stay in touch

- Author - [Deza Farras Tsany](https://kamilmysliwiec.com)

## License

This software is licensed under the [MIT licensed](./LICENSE).
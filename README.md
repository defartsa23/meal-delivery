# meal-delivery

[![GitHub](https://img.shields.io/github/license/defartsa23/shuffle-dice-sicbo)](https://opensource.org/licenses/MIT)

## Installation Database
Pertama buka file .env dan Dockerfile, lalu sesuaikan variabel DATABASE_URL agar terlihat sebagai berikut:
```
DATABASE_URL="mysql://{username}:{password}@{host}:{port}/{database}"
```
Kedua run perintah berikut:

```bash
$ npx prisma migrate dev --name init
$ npx prisma db seed
```
Terakhir execute query yang ada di file [sql-stored-function-distance](./sql-stored-function-distance.sql)
## Create docker container
```bash
$ sh deploy_script.sh
```

## API Documentation
Jalankan service terlebih dahulu, lalu buka {baseUrl}/documentation

## Import collection insomnia
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Meal%20Delivery&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fdefartsa23%2Fmeal-delivery%2Fmain%2Fmeal-delivery.json%3Ftoken%3DGHSAT0AAAAAABW7CF67XBU47X4WPQBNZFAIYXW4YWA)

## Stay in touch

- Author - [Deza Farras Tsany](https://kamilmysliwiec.com)

## License

This software is licensed under the [MIT licensed](./LICENSE).
import * as bcrypt from 'bcrypt';
import { users as dataUsers } from '../data';

async function mapPurchases(argsPurchases) {
    return argsPurchases.map(obj => {
        obj.amount = parseFloat(obj.amount);
        return obj;
    });
}

export async function users() {
    let data = [];
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const myPlaintextPassword = 'hungry12345678';
    const password = bcrypt.hashSync(myPlaintextPassword, salt);

    for (const user of dataUsers) {
        const balance = parseFloat(user.balance);
        const location = user.location.split(",");
        const latitude = parseFloat(location[0]);
        const longitude = parseFloat(location[1]);
        const purchases = await mapPurchases(user.purchases);

        data.push( await {
            name : user.name,
            password,
            latitude,
            longitude,
            balance,
            purchases
        });
    }

    return data;
}
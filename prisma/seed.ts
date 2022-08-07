import { restaurants, users } from "./seeders"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let tempListRestaurant = [];

async function main() {
    const listRestaurant = await restaurants();
    const listUser = await users();
    
    for (const restaurant of listRestaurant) {        
        let menus = [];

        let tempResto = await prisma.restaurants.create({
            data: {
                name : restaurant.name,
                password : restaurant.password,
                latitude : restaurant.latitude,
                longitude : restaurant.longitude,
                balance : restaurant.balance
            }
        });

        restaurant.menus = await restaurant.menus.map(obj => {
            obj.restaurantId = tempResto.id;
            return obj;
        });

        restaurant.hours = await restaurant.hours.map(obj => {
            obj.restaurantId = tempResto.id;
            return obj;
        });

        for (const menu of restaurant.menus) {
            const tempMenu = await prisma.menus.create({
                data: menu
            });

            menus.push(tempMenu);
        }


        await prisma.hours.createMany({
            data: restaurant.hours
        })

        tempResto['menus'] = menus;

        await tempListRestaurant.push(
            tempResto
        )
    }
    
    for (const user of listUser) {
        let tempUser = await prisma.users.create({
            data: {
                name : user.name,
                password : user.password,
                latitude : user.latitude,
                longitude : user.longitude,
                balance : user.balance
            }
        });
        
        for (const purchases of user.purchases) {
            const menu = await tempListRestaurant.filter(
                (resto) => resto.name == purchases.restaurant_name
            ).map((category) => category.menus)
            .flat()
            .find((menu) => menu.name == purchases.dish);

            if (menu) {
                await prisma.orders.create({
                    data: {
                        userId: tempUser.id,
                        menuId : menu.id,
                        amount: purchases.amount, 
                        createdAt: new Date( purchases.date )
                    }
                })
            }
        }
    }
}

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    console.log("FINISH");
    prisma.$disconnect();
})
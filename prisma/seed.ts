import { restaurants } from "./seeders"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let tempListRestaurant = [];

async function main() {
    const listRestaurant = await restaurants();
    console.log(listRestaurant[0]);
    
    // for (const restaurant of listRestaurant) {        
    //     let tempResto = await prisma.restaurants.create({
    //         data: {
    //             name : restaurant.name,
    //             password : restaurant.password,
    //             latitude : restaurant.latitude,
    //             longitude : restaurant.longitude,
    //             balance : restaurant.balance
    //         }
    //     });

    //     restaurant.menus = await restaurant.menus.map(obj => {
    //         obj.restaurantId = tempResto.id;
    //         return obj;
    //     });

    //     restaurant.hours = await restaurant.hours.map(obj => {
    //         obj.restaurantId = tempResto.id;
    //         return obj;
    //     });

    //     const tempMenu = await prisma.menus.createMany({
    //         data: restaurant.menus
    //     })

    //     const tempHour = await prisma.hours.createMany({
    //         data: restaurant.hours
    //     })

    //     tempResto['menus'] = tempMenu;
    //     tempResto['hours'] = tempHour;

    //     tempListRestaurant.push(
    //         tempResto
    //     )
    // }

    // console.log(tempListRestaurant[0]);
    
}

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    console.log("FINISH");
    prisma.$disconnect();
})
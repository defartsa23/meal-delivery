import { restaurants, users } from './data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function convertTime12to24(times) {
    const [time, modifier] = times.split(' ');

    let tempTime = time.split(':');
    let hours = tempTime[0];
    let minutes = tempTime[1] == undefined ? '00' : tempTime[1];

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}

async function mapDays(days) {
    switch (days.toLowerCase()) {
        case "weds":
            return "Wednesday"
            break;
    
        default:
            if (days.length < 6) return `${days}day`
            return days
            break;
    }
}

async function mappingDataBusinessHour(days, open, close) {
    return {
        day: days,
        open,
        close
    }
                            
}

async function addRestaurant() {
    for (const restaurant of restaurants) {
        const balance = parseFloat(restaurant.balance);
        const location = restaurant.location.split(",");
        const latitude = parseFloat(location[0]);
        const longitude = parseFloat(location[1]);

        let tempBusiness_hours = [];
        
        let condiontsBreak = false;
        if (restaurant.business_hours) {            
            const business_hours = restaurant.business_hours.split(" | ");
            for (const key in business_hours) {
                const temp = business_hours[key].split(": ");
                const days = temp[0].split(", ");
                const [hourOpen, hourClose] = temp[1].split(" - ")
                const open = await convertTime12to24(hourOpen);
                const close = await convertTime12to24(hourClose);
                
                for (const key in days) {
                    if (days[key].includes("-")) {
                        const tempDays = days[key].split('-');
    
                        for (const index in tempDays) {
                            const day = await mapDays(tempDays[index]);                        
                            tempBusiness_hours.push(await mappingDataBusinessHour(day, open, close));
                        }
                    } else {
                        const day = await mapDays(days[key]);
                        tempBusiness_hours.push(await mappingDataBusinessHour(day, open, close));
                    }
                }                
            }
        }
        
        const data = {
            name : restaurant.name,
            latitude,
            longitude,
            balance
        }
        
        // const tempResto = await prisma.restaurants.create({
        //     data: data
        // });
        // console.log(tempResto.id);
        // for (const menus of restaurant.menu) {
        //     console.log(menus.name)
        // }
    }
}

async function main() {
    await addRestaurant()
}

main().catch(e => {
    console.log(e);
    process.exit(1);
}).finally(() => {
    console.log("FINISH");
    prisma.$disconnect();
})
import * as bcrypt from 'bcrypt';
import { restaurants as dataRestaurants } from '../data';

const listDay = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

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

    return parseInt(`${hours}${minutes}`);
}

async function mapDays(days) {
    switch (days.toLowerCase()) {
        case "weds":
            return ["Wednesday", listDay.indexOf("Wednesday")];
    
        default:
            if (days.length < 6) return [`${days}day`, listDay.indexOf(`${days}day`)];
            return [days, listDay.indexOf(days)];
    }
}

async function mappingDataBusinessHour(day, indexOfDay, open, close) {
    return {
        day,
        indexOfDay,
        open,
        close
    }
}

async function mapHours(businessHours) {
    let hours = [];

    if (businessHours) {            
        const business_hours = businessHours.split(" | ");
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
                        const [day, indexOfDay] = await mapDays(tempDays[index]);                        
                        hours.push(await mappingDataBusinessHour(day, indexOfDay, open, close));
                    }
                } else {
                    const [day, indexOfDay] = await mapDays(days[key]);
                    hours.push(await mappingDataBusinessHour(day, indexOfDay, open, close));
                }
            }                
        }
    }

    return hours;
}

async function mapMenus(argMenus) {
    return argMenus.map(obj => {
        obj.price = parseFloat(obj.price);
        return obj;
    });
}

export async function restaurants() {
    let data = [];
    for (const restaurant of dataRestaurants) {
        const saltRounds = 10;
        const myPlaintextPassword = 'hungry12345678';
        const password = bcrypt.hashSync(myPlaintextPassword, saltRounds);
        const balance = parseFloat(restaurant.balance);
        const location = restaurant.location.split(",");
        const latitude = parseFloat(location[0]);
        const longitude = parseFloat(location[1]);
        const hours = await mapHours(restaurant.business_hours);
        const menus = await mapMenus(restaurant.menu);

        data.push( await {
            name : restaurant.name,
            password,
            latitude,
            longitude,
            balance,
            hours,
            menus
        })
    }

    return data;
}
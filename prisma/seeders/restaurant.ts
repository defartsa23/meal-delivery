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

async function convertTime12to24(times, isClose = false, timeOpen = 0) {
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

    tempTime = parseInt(`${hours}${minutes}`);

    if (isClose === true && tempTime < timeOpen ) {
        tempTime += 2400;
    }

    return tempTime;
}

async function mapDays(days) {
    const wordDay = days.slice(0, 3);
    const day = listDay.filter(data => data.includes(wordDay))[0];
    const indexOfDay = listDay.indexOf(day);
    return [day, indexOfDay];
}

async function mappingDataBusinessHour(day, indexOfDay, open, parClose) {
    return {
        day,
        indexOfDay,
        open,
        close : parClose > 2400 ? parClose - 2400 : parClose,
        closeFilter: parClose
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
            let open = await convertTime12to24(hourOpen);
            let close = await convertTime12to24(hourClose, true, open);
            
            for (const key in days) {
                if (days[key].includes("-")) {
                    
                    const tempDays = days[key].split('-');
                    let idx = 0;
                    const tempClose = close;
                    for (const index in tempDays) {
                        const [day, indexOfDay] = await mapDays(tempDays[index]); 

                        if (idx === 0) {
                            close = 2400;
                        } else {
                            open = 0;
                            close = tempClose > 2400 ? tempClose - 2400 : tempClose;
                        }              

                        hours.push(await mappingDataBusinessHour(day, indexOfDay, open, close));
                        idx += 1;
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
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const myPlaintextPassword = 'hungry12345678';
    const password = bcrypt.hashSync(myPlaintextPassword, salt);
    
    for (const restaurant of dataRestaurants) {
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
        });
    }

    return data;
}
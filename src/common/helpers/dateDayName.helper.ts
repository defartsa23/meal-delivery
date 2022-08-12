export function getDayName(date:Date)
{
    return date.toLocaleDateString("en-US", { weekday: 'long' });        
}
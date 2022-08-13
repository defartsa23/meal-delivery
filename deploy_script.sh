docker build -t meal-delivery .
docker run -p33331:3001 --name MealDelivery --network mealDelivery meal-delivery
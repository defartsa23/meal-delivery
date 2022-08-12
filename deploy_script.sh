docker build --no-cache -t meal-delivery .
docker run -p3001:30001 --name MealDelivery meal-delivery
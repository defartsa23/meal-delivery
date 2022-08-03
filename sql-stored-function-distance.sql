CREATE DEFINER=`root`@`%` FUNCTION `meal-delivery`.`Distance`(latitude_user DECIMAL(11, 7), 
	longitude_user DECIMAL(11, 7), 
	latitude_resto DECIMAL(11, 7), 
	longitude_resto DECIMAL(11, 7)
) RETURNS decimal(11,1)
    DETERMINISTIC
BEGIN
    DECLARE distance DECIMAL(11, 1);
	
	SET distance = 6371 * acos( 
                cos( radians(latitude_resto) ) 
              * cos( radians( latitude_user ) ) 
              * cos( radians( longitude_user ) - radians(longitude_resto) ) 
              + sin( radians(latitude_resto) ) 
              * sin( radians( latitude_user ) )
                );
               
	RETURN (distance);
END;

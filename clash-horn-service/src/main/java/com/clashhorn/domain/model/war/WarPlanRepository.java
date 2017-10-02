package com.clashhorn.domain.model.war;

import java.util.Date;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * War entity repository interface
 * @author morgade
 */
public interface WarPlanRepository extends MongoRepository<WarPlan, String> {
    @Query("{ 'clanAccountId':?0, 'preparationStartTime': ?1 }")
    WarPlan findByAccountAndPreparationTime(String clanAccount, Date preparationStartTime);
    
    @Query("{ 'id':?0, 'clanAccountId': ?1 }")
    WarPlan findByIdAndClanAccountId(String id, String clanAccountId);
    
    @Query("{ 'id':?0, result: ?1 }")
    WarPlan findClanAccountIdAndResult(String id, int resultIdAsValue);
    
    @Query("{ $or: [{'clanAccountId':?0, result: ?1}, {'clanAccountId':?0, result: ?2}] }")
    WarPlan findClanAccountIdAndResult(String clanAccountId, int resultIdAsValue1, int resultIdAsValue2);

}

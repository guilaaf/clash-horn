/*
 * Clash Horn - MIT License
 */
package com.clashhorn.infrastructure.mock;

import com.clashhorn.domain.model.clan.ClanRef;
import com.clashhorn.domain.model.war.WarPlan;
import com.clashhorn.domain.model.war.WarPlanBuilder;
import com.clashhorn.domain.model.war.WarPlanRepository;
import java.util.Date;
import java.util.List;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

/**
 *
 * @author morgade
 */
@Primary
@Repository
@Profile("!live-mongo-db")
public class WarPlanMockRepository implements WarPlanRepository {
    
    @Override
    public <S extends WarPlan> S save(S entity) {
        return entity;
    }

    @Override
    public WarPlan findOne(String id) {
        return 
            WarPlanBuilder.builder(id)
                    .clanAccountId("32FCAF80-59B1-E363-3877-A9C63E7D3558")
                    .clan(new ClanRef("#FHGFDDA", "TJF", "https://api-assets.clashofclans.com/badges/70/26BXjsDi6Gga0Vz0Khhtrp97GaDGtz4GNLurTDp8Rt0.png"))
                    .enemy(new ClanRef("#KJHGEKJ", "OS OUTROS", "https://api-assets.clashofclans.com/badges/70/1yXDINaahr6k39r8Tt6JcWWAeZGxDfQpBjt-WaiYiLQ.png"))
                    .build();
    }
    
    @Override
    public <S extends WarPlan> S findOne(Example<S> example) {
        return (S)
            WarPlanBuilder.builder("XXXX")
                    .clanAccountId("32FCAF80-59B1-E363-3877-A9C63E7D3558")
                    .clan(new ClanRef("#FHGFDDA", "TJF", "https://api-assets.clashofclans.com/badges/70/26BXjsDi6Gga0Vz0Khhtrp97GaDGtz4GNLurTDp8Rt0.png"))
                    .enemy(new ClanRef("#KJHGEKJ", "OS OUTROS", "https://api-assets.clashofclans.com/badges/70/1yXDINaahr6k39r8Tt6JcWWAeZGxDfQpBjt-WaiYiLQ.png"))
                    .build();
    }
    
    @Override
    public boolean exists(String id) {
        return true; 
    }
    
    @Override
    public WarPlan findByAccountAndPreparationTime(String clanAccount, Date preparationStartTime) {
        return 
            WarPlanBuilder.builder("TYDHGENDMDA")
                    .clanAccountId(clanAccount)
                    .clan(new ClanRef("#FHGFDDA", "TJF", "https://api-assets.clashofclans.com/badges/70/26BXjsDi6Gga0Vz0Khhtrp97GaDGtz4GNLurTDp8Rt0.png"))
                    .enemy(new ClanRef("#KJHGEKJ", "OS OUTROS", "https://api-assets.clashofclans.com/badges/70/1yXDINaahr6k39r8Tt6JcWWAeZGxDfQpBjt-WaiYiLQ.png"))
                    .preparationStartTime(preparationStartTime)
                    .build();
    }
    
    @Override
    public WarPlan findByIdAndClanAccountId(String id, String clanAccountId) {
        return 
            WarPlanBuilder.builder(id)
                    .clanAccountId(clanAccountId)
                    .clan(new ClanRef("#FHGFDDA", "TJF", "https://api-assets.clashofclans.com/badges/70/26BXjsDi6Gga0Vz0Khhtrp97GaDGtz4GNLurTDp8Rt0.png"))
                    .enemy(new ClanRef("#KJHGEKJ", "OS OUTROS", "https://api-assets.clashofclans.com/badges/70/1yXDINaahr6k39r8Tt6JcWWAeZGxDfQpBjt-WaiYiLQ.png"))
                    .build();
    }
    
    @Override
    public List<WarPlan> findAll() {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public List<WarPlan> findAll(Sort sort) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> S insert(S entity) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> List<S> insert(Iterable<S> entities) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public Page<WarPlan> findAll(Pageable pageable) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> List<S> save(Iterable<S> entites) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public Iterable<WarPlan> findAll(Iterable<String> ids) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public long count() {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public void delete(String id) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public void delete(WarPlan entity) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public void delete(Iterable<? extends WarPlan> entities) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public void deleteAll() {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> List<S> findAll(Example<S> arg0) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> List<S> findAll(Example<S> arg0, Sort arg1) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> Page<S> findAll(Example<S> example, Pageable pageable) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> long count(Example<S> example) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public <S extends WarPlan> boolean exists(Example<S> example) {
        throw new UnsupportedOperationException("Not supported yet."); 
    }

    @Override
    public WarPlan findClanAccountIdAndResult(String id, int resultIdAsValue) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public WarPlan findClanAccountIdAndResult(String id, int resultIdAsValue1, int resultIdAsValue2) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

        
}

/*
 * Clash Horn - MIT License
 */
package com.clashhorn.application.service;

import com.clashhorn.application.dto.ClanAccountDTO;
import com.clashhorn.application.dto.ClanFullDTO;
import com.clashhorn.application.dto.WarPlanFullDTO;
import com.clashhorn.domain.model.account.ClanAccount;
import com.clashhorn.domain.model.account.ClanAccountRepository;
import com.clashhorn.domain.model.war.WarPlan;
import com.clashhorn.domain.model.war.WarPlanRepository;
import com.clashhorn.application.clashapi.Clan;
import com.clashhorn.application.clashapi.War;
import com.clashhorn.application.clashapi.WarClan;
import com.clashhorn.application.clashapi.WarClanMember;
import com.clashhorn.domain.model.clan.ClanRef;
import com.clashhorn.domain.model.war.WarPlanAttack;
import com.clashhorn.domain.model.war.WarPlanBuilder;
import com.clashhorn.domain.model.war.WarPlayer;
import com.clashhorn.domain.model.war.WarPosition;
import com.clashhorn.domain.model.war.WarResult;
import com.clashhorn.domain.model.war.WarScore;
import com.googlecode.jsonrpc4j.spring.AutoJsonRpcServiceImpl;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import com.clashhorn.domain.service.ClanAccountService;
import com.clashhorn.domain.service.WarPlanService;
import java.util.Comparator;
import static java.util.Comparator.comparing;
import java.util.UUID;
import static java.util.stream.Collectors.toList;
import java.util.stream.Stream;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

/**
 *
 * @author morgade
 * @author guilaaf
 */
@Service
@AutoJsonRpcServiceImpl
public class ClashHornServiceImpl implements ClashHornService {
    
    @Autowired
    @Qualifier("dtoConversionService")
    private ConversionService converter;
    
    @Autowired
    private ClashOfClansService clashOfClansService;
    
    @Autowired
    private ClanAccountService clanAccountService;
    
    @Autowired
    private WarPlanRepository warPlanRepository;
    
    @Autowired
    private WarPlanService warPlanService;
    
    @Autowired
    private ClanAccountRepository clanAccountRepository;
    
    /**
     * {@inheritDoc}
     */
    @Override
    public ClanFullDTO fetchClanData(String tag) {
        Clan clan = clashOfClansService.clans(tag);
        return converter.convert(clan, ClanFullDTO.class);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public ClanAccountDTO fetchClanAccount(String clanAccountId) {
        ClanAccount clanAccount = clanAccountRepository.findOne(clanAccountId);
        Assert.notNull(clanAccount, "Clan account not found");
        return converter.convert(clanAccount, ClanAccountDTO.class);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public ClanAccountDTO registerClanAccount(String tag, String clanAccountId) {
        ClanAccount clanAccount = clanAccountService.registerNewClanAccount(clanAccountId, tag);
        return converter.convert(clanAccount, ClanAccountDTO.class);
    }
        
    /**
     * {@inheritDoc}
     */
    @Override
    public WarPlanFullDTO fetchWarPlan(String clanAccountId, String warPlanId) {
        // TODO: Apply concurrenty control with @Version
        WarPlan warPlan;
        if (warPlanId!=null) {
            // warPlanId provided. Just get a warPlan from the repository assuring it belongs to provided clanAccountId
            warPlan = warPlanRepository.findByIdAndClanAccountId(warPlanId, clanAccountId);
        } else {
            // warPlanId not provided. Assumes a request for the current war
            ClanAccount clanAccount = clanAccountRepository.findOne(clanAccountId);
            
            // Fetch current war on CoC API to verify matches and updates for a possible repository warplan
            if (clanAccount.checkFetchSpam(System.currentTimeMillis())) {
                // Too many update requests. Fetch latest no finished war
                warPlan = warPlanRepository.findClanAccountIdAndResult(clanAccountId, WarResult.PREPARATION.toValue(), WarResult.IN_PROGRESS.toValue());
            } else {
                War war = clashOfClansService.currentWar(clanAccount.getClan().getTag());
                warPlan = warPlanService.createOrUpdateCurrentWarPlan(createWarPlanFromCoCWar(war, clanAccountId));
            }
            clanAccountRepository.save(clanAccount);
        }
        return converter.convert(warPlan, WarPlanFullDTO.class);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public WarPlanFullDTO pushToAttackQueue(String warPlanId, int enemyPosition, int memberPosition) {
        WarPlan warPlan = warPlanRepository.findOne(warPlanId);
        warPlan.addPlannedAttack(WarPosition.fromValue(enemyPosition), WarPosition.fromValue(memberPosition));
        warPlanRepository.save(warPlan);
        return converter.convert(warPlan, WarPlanFullDTO.class);
    }
        
    /**
     * {@inheritDoc}
     */
    @Override
    public WarPlanFullDTO removeFromAttackQueue(String warPlanId, int enemyPosition, int memberPosition) {
        WarPlan warPlan = warPlanRepository.findOne(warPlanId);
        warPlan.removePlannedAttack(WarPosition.fromValue(enemyPosition), WarPosition.fromValue(memberPosition));
        warPlanRepository.save(warPlan);
        return converter.convert(warPlan, WarPlanFullDTO.class);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public Map status() {
        return new HashMap() {{
            put("freeHeap", Runtime.getRuntime().freeMemory());
        }};
    }
    
    /**
     * Creates a WarPlan based on CoC API war data
     * @param war
     * @param clanAccountId
     * @return 
     */
    public static WarPlan createWarPlanFromCoCWar(War war, String clanAccountId) {
        String id = UUID.randomUUID().toString();
        WarResult result = null;
        switch (war.getState()) {
            case IN_WAR: result = WarResult.IN_PROGRESS; break;
            case PREPARATION: result = WarResult.PREPARATION; break;
            case WAR_ENDED: 
                int r = comparing(WarClan::getStars).thenComparing(WarClan::getDestructionPercentage).compare(war.getClan(), war.getOpponent());
                if (r==1) {
                    result = WarResult.VICTORY;
                } else if (r==0) {
                    result = WarResult.DRAW;
                } else {
                    result = WarResult.DEFEAT;
                }
            break;
        }
        
        LoggerFactory.getLogger(ClashHornServiceImpl.class).debug("Created war with id {} and result {}", id, result.name());
        
        return
            WarPlanBuilder.builder(id)
                .clanAccountId(clanAccountId)
                .result( result )
                .clan(new ClanRef(war.getClan().getTag(), war.getClan().getName(), war.getClan().getBadgeUrls().getLarge()))
                .enemy(new ClanRef(war.getOpponent().getTag(), war.getOpponent().getName(), war.getOpponent().getBadgeUrls().getLarge()))
                .preparationStartTime(war.getPreparationStartTime())
                .startTime(war.getStartTime())
                .endTime(war.getEndTime())
                .clanScore(new WarScore(war.getClan().getStars(), war.getClan().getDestructionPercentage()))
                .enemyScore(new WarScore(war.getOpponent().getStars(), war.getOpponent().getDestructionPercentage()))
                .members( Stream.of(war.getClan().getMembers())
                            .sorted(comparing(WarClanMember::getMapPosition))
                            .map(m -> new WarPlayer(m.getTag(), m.getName(), m.getMapPosition(), m.getTownhallLevel()))
                            .collect(toList()))
                
                .enemies( Stream.of(war.getOpponent().getMembers())
                            .sorted(comparing(WarClanMember::getMapPosition))
                            .map(m -> new WarPlayer(m.getTag(), m.getName(), m.getMapPosition(), m.getTownhallLevel()))
                            .collect(toList()))
                
                .performedAttacks( 
                        Stream.of(war.getClan().getMembers())
                                .flatMap(
                                        m -> Stream.of(m.getAttacks())                                                    
                                                .map( a -> new WarPlanAttack(WarPosition.fromValue(m.getMapPosition()), 
                                                                WarPosition.fromValue(war.getOpponent(a.getDefenderTag()).getMapPosition()), 
                                                                a.getStars(), a.getOrder(), 
                                                                a.getDestructionPercentage()))
                                )
                                .sorted(comparing(WarPlanAttack::getOrder))
                                .collect(toList())
                )
                
                .sufferedAttacks( 
                        Stream.of(war.getOpponent().getMembers())
                                .flatMap(
                                        m -> Stream.of(m.getAttacks())                                                 
                                                .map( a -> new WarPlanAttack( WarPosition.fromValue(m.getMapPosition()), 
                                                                WarPosition.fromValue(war.getMember(a.getDefenderTag()).getMapPosition()), 
                                                                a.getStars(), a.getOrder(), 
                                                                a.getDestructionPercentage()))
                                )
                                .sorted(comparing(WarPlanAttack::getOrder))
                                .collect(toList())
                )
                
                .build();
    }

    
}

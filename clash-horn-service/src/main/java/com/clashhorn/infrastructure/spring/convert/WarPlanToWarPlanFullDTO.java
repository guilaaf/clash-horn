/*
 * Clash Horn - MIT License
 */
package com.clashhorn.infrastructure.spring.convert;

import com.clashhorn.application.dto.ClanRefDTO;
import com.clashhorn.application.dto.WarPlanFullDTO;
import com.clashhorn.domain.model.war.WarPlan;
import static java.util.stream.Collectors.toList;
import org.springframework.beans.BeanUtils;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 *
 * @author morgade
 */
@Component
public class WarPlanToWarPlanFullDTO extends ConverterDepedentConverter implements Converter<WarPlan, WarPlanFullDTO> {

    @Override
    public WarPlanFullDTO convert(WarPlan source) {
        
        WarPlanFullDTO target = new WarPlanFullDTO();
        BeanUtils.copyProperties(source, target, "positions", "clan", "enemy");
        target.setClan(getConverter().convert(source.getClan(), ClanRefDTO.class) );
        target.setEnemy(getConverter().convert(source.getEnemy(), ClanRefDTO.class));
        target.setPositions(
                source.positions()
                        .map( warPosition -> {
                            WarPlanFullDTO.Position pos = new WarPlanFullDTO.Position();
                            pos.setNumber(warPosition.asValue());
                            pos.setEnemy(source.getEnemy(warPosition));
                            pos.setMember(source.getMember(warPosition));
                            pos.setPerformedAttacks(source.getPerformedAttacksAgainst(warPosition));
                            pos.setSufferedAttacks(source.getSufferedAttacksAgainst(warPosition));
                            pos.setAttackQueue(source.getAttackQueue(warPosition));
                            return pos;
                        })
                        .collect(toList())
        );
        return target;
    }
    
}

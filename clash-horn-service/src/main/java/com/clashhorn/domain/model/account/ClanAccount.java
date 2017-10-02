/*
 * Clash Horn - MIT License
 */
package com.clashhorn.domain.model.account;

import com.clashhorn.domain.model.clan.ClanRef;
import com.clashhorn.domain.shared.AggregateRoot;
import static java.lang.String.format;
import java.util.Date;
import org.springframework.data.annotation.Id;

/**
 *
 * @author morgade
 */
@AggregateRoot
public class ClanAccount {
    public static final int FETCH_PER_MINUTE_SPAM_THRESHOLD=7;
    
    @Id
    private String id;
    private ClanRef clan;
    private Date creation;
    private long spamFetchControl;

    public ClanAccount(String id, ClanRef clan) {
        this.id = id;
        this.clan = clan;
        this.creation = new Date();
        this.spamFetchControl = 0;
    }

    /**
     * Check and register fetch spam control for COC API requests
     * @param newTimeStamp
     * @return 
     */
    public boolean checkFetchSpam(long newTimeStamp) {
        // generate a "global" minute time stamp
        long minute = newTimeStamp / 1000 / 60;
        // Extracts current fetchControl data 
        // (56 bits: minuteStamp)(8 bits: fetch count)
        long currentFetchCount = this.spamFetchControl & 0x00000000000000ffL;
        long currentMinuteStamp = this.spamFetchControl >> 8;
        
        if (currentMinuteStamp==minute) {
            if (currentFetchCount>FETCH_PER_MINUTE_SPAM_THRESHOLD) {
                return true;
            } else {
                currentFetchCount++;
            }
        } else {
            currentFetchCount = 0;
        }
        
        // Rebuild updated spamFetchControl
        this.spamFetchControl = (minute << 8) + currentFetchCount;
        return false;
    }
    
    public String getId() {
        return id;
    }
    
    public Date getCreation() {
        return creation;
    }

    public ClanRef getClan() {
        return clan;
    }

    public long getSpamFetchControl() {
        return spamFetchControl;
    }
    
    @Override
    public String toString() {
        return format("ClanAccount[=%s]", this.id);
    }
    
}

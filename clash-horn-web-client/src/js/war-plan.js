/**
 *    WAR PLAN FULL DATA STRUCTURE (BASED ON WarPlanFullDTO)
 *    
 *   { 
 *      id: <number>,
 *      size: <number>,
 *      startTime: <date>,
 *      preparationStartTime: <date>,
 *      endTime: <date>,
 *      mapSize: <number>,
 *      result: <number>,    [ 0:PREPARATION, 1:IN_PROGRESS, 2:DRAW, 3:VICTORY, 4:DEFEAT ]
 *      clan: {
 *          tag: <string>,
 *          name: <string>
 *          badge: <string>
 *      }
 *      enemy: {
 *          tag: <string>,
 *          name: <string>
 *      },
 *      clanScore: {
 *          stars: <number>,
 *          destruction: <number>
 *      },
 *      enemyScore: {
 *          stars: <number>,
 *          destruction: <number>
 *      },
 *      positions: [ 
 *          {
 *              number: <number>,
 *              member: {
 *                  tag: <string>,
 *                  name: <string>,
 *                  mapPosition: <number>,
 *                  townhallLevel: <number>
 *              },
 *              enemy: {
 *                  tag: <string>,
 *                  name: <string>,
 *                  mapPosition: <number>,
 *                  townhallLevel: <number>
 *              },
 *              performedAttacks: [
 *                  {
 *                      attacker: <number>,
 *                      defender: <number>,
 *                      stars: <number>,
 *                      order: <number>,
 *                      destructionPercentage: <number>,
 *                  }
 *              ],
 *              sufferedAttacks: [
 *                  {
 *                      attacker: <number>,
 *                      defender: <number>,
 *                      stars: <number>,
 *                      order: <number>,
 *                      destructionPercentage: <number>,
 *                  }
 *              ],
 *              attackQueue: [
    *              {
    *                  attacker: <number>,
    *                  order: <number>
 *                  }
 *              ]
 *        }
 *    }
 *
 */

export const isPreparation = (war) => war.result === 0;
export const isInProgress  = (war) => war.result === 1;
export const isDraw        = (war) => war.result === 2;
export const isVictory     = (war) => war.result === 3;
export const isDefeat      = (war) => war.result === 4;


/**
 * Finds member positions elligible for pushing
 * Members with 2 performedAttacks or already in the positions's attack queue are removed
 * @param {object} war
 * @param {object} position
 * @returns {object}
 */
export const elligilePositionsForPushToQueue = function(war, position) {
    const count = performedMemberAttacksCountPerPosition(war);
    return war.positions.filter( p => {
        return (count[p.member.mapPosition]||0)<2 && !position.attackQueue.find( a => a.attacker === p.number ) ;
    });
};

/**
 * Find best performed attack at the position
 * @param {type} position
 * @returns {Number}
 */
export const bestPerformedAttack = function(position) {
    if (position.performedAttacks.length===0) {
        return { stars: -1, destructionPercentage: 0 };
    } else {
        return position.performedAttacks.reduce( (x, y) => (x.stars*1000+x.destructionPercentage) > (y.stars*1000+x.destructionPercentage) ? x : y);
    }
};

/**
 * Return an array indexed by member position containing the number of attacks
 * performed. If a member has not attacked yet, he won't be in the array.
 */
export const performedMemberAttacksCountPerPosition = function(war) {
    let counts = [];
    war.positions.map( 
        pos => pos.performedAttacks.map( attack => attack.attacker) 
    )
    .reduce( (x, y) => x.concat(y) )
    .forEach( attacker => counts[attacker] = (counts[attacker]||0) + 1 );
    
    return counts;
};

/**
 * Return the position planned attacks queue filtering plans into position.performedAttacks
 * Removes attackers with 2 performedAttacks or attackers already present in position's performedAttacks
 * @param {type} war
 * @param {type} position
 * @returns {unresolved}
 */
export const getFilteredAttackQueue = function(war, position) {
    const counts = performedMemberAttacksCountPerPosition(war);
    
    return position.attackQueue
            // filter out plans for players that already attacked this position
            .filter( queueItem => position.performedAttacks.map(a=> a.attacker).indexOf(queueItem.attacker) < 0 )
            // filter out atackers with 2 performed attacks
            .filter( queueItem => (counts[queueItem.attacker] || 0) < 2 );
};

/**
 * Return the position attack log. Shows the log of all attacks and plans on this position.
 * @param {type} war
 * @param {type} position
 * @returns {unresolved}
 */
export const getFilteredAttackLog = function(war, position) {
    let log = position.performedAttacks.map(a => {
            return {
                attacker: war.positions[a.attacker-1].member,
                planned: position.attackQueue.filter(p => p.attacker === a.attacker).reduce((x,y)=> x = y.order < a.order, false),
                executed: true,
                stars: a.stars,
                destructionPercentage: a.destructionPercentage,
                order: a.order
            };
    });
    position.attackQueue.forEach(p => {
        if (!log.some(l => l.attacker === p.attacker)) {
            log.push({
                attacker: war.positions[p.attacker-1].member,
                planned: true,
                executed: false,
                stars: null,
                destructionPercentage: 0,
                order: p.order
            });
        }
    });
    log.sort((a, b) => a.order - b.order);
    return log;
};

export const getWarRemainingTime = function(war, currentTime) {
    let seconds = 0;
    let prefix = "";
    let suffix = "";
    if (currentTime < war.startTime) {
        seconds = parseInt((war.startTime - currentTime)/1000);
        suffix = " to start";
    } else if (currentTime < war.endTime) {
        seconds = parseInt((war.endTime - currentTime)/1000);
        suffix = " to end";
    } else {
        return "War ended";
    }
    
    let hours = parseInt(seconds / (60*60));
    let minutes = hours > 0 ? parseInt(seconds / 60) % hours : parseInt(seconds / 60);
    
    hours = hours===0?"":hours + (hours > 1 ? " hours " : " hour ");
    minutes = minutes + (minutes > 1 ? " minutes" : " minute");
    return prefix + hours + minutes + suffix;
};

export const getWarAttackCount = function(war) {
    let performedAttacks = war.positions.map(p => p.performedAttacks.length).reduce(( prevVal, elem ) => prevVal + elem);
    let availableAttacks = (war.mapSize * 2) - performedAttacks;
    let performed = performedAttacks + " " + (performedAttacks > 1 ? "attacks" : "attack") + " performed";
    let available = availableAttacks + " available";
    
    return performed + ", " + available;
};


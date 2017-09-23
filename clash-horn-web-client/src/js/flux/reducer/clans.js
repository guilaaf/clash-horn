import objectAssign from 'object-assign';
import {reducer} from './util'


/**
 * Reducer state structure
 */
const initialState =  {
    // map used to control async fetch actions in progress
    fetching: {  },
    // indicates the last operation executed
    lastOperation: null,
    // user context bound clan account
    clanAccount: null,
    // clan obtained in the las fetch clan action
    fetchedClan: null,
    // war obtained in the last fetchWarPlan action
    openWarPlan: null
};

/**
 * Create and export the reducer
 */
export default reducer(initialState, {
        
    setAccountClan: (state, action) =>  
        objectAssign({}, state, { 
            accountClan: action.clan
        }),
        
    pushAttackQueueOnOpenWarPlan: (state, action) => {
        var newState = objectAssign({}, state);
        newState.openWarPlan.positions[action.enemyPosition-1].attackQueue.push(action.attackerPosition);
        return newState;
    },
        
    fetchClanDataRequest: (state, action) =>  
        objectAssign({}, state, { 
            fetchedClan: null,
            fetching: { 'fetchClanDataRequest': true }
        }),
        
    fetchClanDataSuccess: (state, action) =>  
        objectAssign({}, state, { 
            fetchedClan: action.clan,
            lastOperation: 'fetchClanData',
            fetching: { 'fetchClanDataRequest': false }
        }),
        
    registerClanAccountRequest: (state, action) =>  
        objectAssign({}, state, { 
            clanAccount: null,
            fetching: { 'registerClanAccount': true }
        }),
        
    registerClanAccountSuccess: (state, action) =>  
        objectAssign({}, state, { 
            clanAccount: action.clanAccount,
            lastOperation: 'registerClanAccount',
            fetching: { 'registerClanAccount': false }
        }),
        
    fetchClanAccountRequest: (state, action) =>  
        objectAssign({}, state, { 
            clanAccount: null,
            fetching: { 'fetchClanAccount': true }
        }),
        
    fetchClanAccountSuccess: (state, action) =>  
        objectAssign({}, state, { 
            clanAccount: action.clanAccount,
            lastOperation: 'fetchClanAccount',
            fetching: { 'fetchClanAccount': false }
        }),
        
    fetchWarPlanRequest: (state, action) =>  
        objectAssign({}, state, { 
            openWarPlan: null,
            fetching: { 'fetchWarPlan': true }
        }),
        
    fetchWarPlanSuccess: (state, action) =>  
        objectAssign({}, state, { 
            openWarPlan: action.warPlan,
            lastOperation: 'fetchWarPlan',
            fetching: { 'fetchWarPlan': false }
        }),
    
    serviceFailure: (state, action) =>
        objectAssign({}, state, { 
            fetching: { }
        })
    
});
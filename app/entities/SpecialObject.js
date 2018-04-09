import Entity from './base/Entity';

/******************************************************************************/

export default class SpecialObject extends Entity {

    constructor(props, tileSize, scale, sprites, victoryConditionsMet) {
        super(props, tileSize, scale, sprites);

        this.type = props.type;
        this.victoryConditionsMet = victoryConditionsMet;
    }

    checkInteraction(player) {
        if (!this.collidesWith(player)) return;

        if (!this.victoryConditionsMet()) {
            // remind the player to get all collectibles first
        }

        return this.playerActions();
    }

    playerActions() {
        switch (this.type) {
            case 'finish': return ['REACH_FINISH'];
        }
    }

}
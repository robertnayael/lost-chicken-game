import Entity from './entity';

export default class AnimatedEntity extends Entity {

  constructor(props, tileSize, scale, sprites) {
    super(props, tileSize, scale);

    this.animation = {
      previousVariant: null,
      frameIterator: null,
      firstFrame: (props.firstSpriteFrame ? props.firstSpriteFrame : 0)
    };

    this.sprites = sprites;
  }

  getSpriteFrame(spriteType, animationVariant, firstFrame = this.animation.firstFrame) {

    if (animationVariant !== this.animation.previousVariant) {
      this.animation.frameIterator = this.sprites.getFrameIterator(spriteType, animationVariant, firstFrame);
    }

    this.animation.previousVariant = animationVariant;
    return this.animation.frameIterator.next().value;

  }

}
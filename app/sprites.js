export default class Sprites {

  constructor(props) {
    this.filelist = props.FILELIST; // Filenames of the images to be loaded
    this.images = {};               // All image objects will be stored here

    this.spritemaps = {
      'player': props.player,
      'mobs': props.mobs,
      'mapTiles': props.mapTiles,
      "background": props.background,
      "screenOverlays": props.screenOverlays
    };
  }

/******************************************************************************/

  getSpriteProps(variantID, firstFrame = 0) {

    // Get the sub-key of the spritemaps object:
    let props = this.spritemaps;
    variantID.forEach(key => {
      props = Object.assign({}, props[key]);
    });

    return {
      props: props,
      firstFrame: firstFrame
    };
  }

/******************************************************************************/

  getbackgroundSprites() {
    return this.spritemaps.background.map(layer => {
      return Object.assign(layer, {image: this.images[layer.image]});
    });
  }

  /******************************************************************************/

    getScreenOverlayLayers() {

      const overlays = Object.assign({}, this.spritemaps.screenOverlays);

      Object.keys(overlays).forEach(type => {
        overlays[type].forEach(layer => {
          layer.image = this.images[layer.image];
        });
      });

      return overlays;
    }

/******************************************************************************/

  getSprite(spriteType) {

    const {props} = this.getSpriteProps(spriteType);

    return Object.assign(props, {
      image: this.images[props.image],
      width: props.dimensions[0],
      height: props.dimensions[1],
      drawOffsetX: props.drawOffset[0],
      drawOffsetY: props.drawOffset[1],
      x: props.coords[0],
      y: props.coords[1]
    });
  }

/******************************************************************************/

  getFrameIterator(spriteType, frame = 0) {

    // Sprite properties:
    const {props, firstFrame} = this.getSpriteProps(spriteType, frame);

    // Number of frames:
    const frames = props.frames;

    const spritePropertiesPartial = {
      image: this.images[props.image],
      width: props.dimensions[0],
      height: props.dimensions[1],
      drawOffsetX: props.drawOffset[0],
      drawOffsetY: props.drawOffset[1],
    };

    return this.frameIterator(frames, firstFrame, spritePropertiesPartial);
  }

/******************************************************************************/

  *frameIterator(frames, firstFrame, propertiesPartial) {

    let index = firstFrame;
    while (index < frames.length) {

      let i = index;
      index++;

      if (index === frames.length) index = 0;

      yield Object.assign({
        x: frames[i][0],
        y: frames[i][1]},
      propertiesPartial);

    }
  }

/******************************************************************************/

  loadImages(spritesDir) {

    const makeImage = (filename, blob) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.src = url;
      this.images[filename] = image;
    };

    const fetchFile = file => fetch(spritesDir + file)
      .then(
        function(response) {
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
          } else {
            return Promise.reject(new Error(response.statusText));
          }
        }
      )
      .then(response => response.blob())
      .then(blob => makeImage(file, blob));

    return Promise
      .all(this.filelist.map(fetchFile));
  }

/******************************************************************************/

}

/**
 * @file Defines the API for MD Image
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/30/16
 */

/**
 * Reserve space for the MD Image.
 * @param {Element} image - the MD Image element
 */
export const reserveImageSpace = (image) => {
  if (image.hasAttribute('data-height') && image.hasAttribute('data-width')) {
    const height = image.getAttribute('data-height');
    const width = image.getAttribute('data-width');
    const imageStyle = `height: ${height}px; width: ${width}px;`;
    image.setAttribute('style', imageStyle);
  }
  // else
  // throw new Meteor.Error 'The height and width of an MD Image are required.'
};

/**
 * Set the background color of the placeholder.
 * @param {Element} image - the MD Image element
 * @param {Element} placeholder - the embedded placeholder element
 */
export const setPlaceholderBgColor = (image, placeholder) => {
  if (image.hasAttribute('data-placeholder-bg')) {
    const bgStyle =
            `background-color: ${image.getAttribute('data-placeholder-bg')}`;
    placeholder.setAttribute('style', bgStyle);
  }
};

/**
 * Set the background image of the placeholder.
 * @param {Element} image - the MD Image element
 * @param {Element} placeholder - the embedded placeholder element
 */
export const setPlaceholderImage = (image, placeholder) => {
  if (image.hasAttribute('data-placeholder-img')) {
    const imageSrc = image.getAttribute('data-placeholder-img');
    placeholder.setAttribute('style', `background-image: ${imageSrc};`);
  }
};

/**
 * Set the size of the embedded img element.
 * @param {Element} image - the MD Image element
 * @param {Element} img - the embedded img element
 */
export const setImgSize = (image, img) => {
  const _img = img;
  if (image.hasAttribute('data-height') && image.hasAttribute('data-width')) {
    const height = image.getAttribute('data-height');
    const width = image.getAttribute('data-width');
    _img.height = height;
    _img.width = width;
  }
};

/**
 * Set the image as a background image for the .md-image, and apply the sizing.
 * @param {Element} image - the MD Image element
 * @param {string} [data] - data from the md_image template
 */
export const setImageAsBackground = (image, data) => {
  let _data;
  if (!data) {
    /*
     * The image is being re-rendered after a change in data-bg-url. Compose the
     * data object from the values in the changed element.
     */
    _data = {};
    _data.height = image.getAttribute('data-height');
    _data.width = image.getAttribute('data-width');
    _data.bg_url = image.getAttribute('data-bg-url');
    _data.sizing = image.getAttribute('data-sizing');
  } else {
    _data = data;
  }

  // Compose a style string.
  const imageStyle = `height: ${_data.height}px; 
                      width: ${_data.width}px; 
                      background-image: url(${_data.bg_url}); 
                      background-position: 50% 50%; 
                      background-repeat: no-repeat; 
                      background-size: ${_data.sizing};`;

  // Set the style attribute.
  image.setAttribute('style', imageStyle);
};

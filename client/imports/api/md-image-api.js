/**
 * @file Defines the API for MD Image
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
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
 * @param {string} [data__template] - data from the md_image template
 */
export const setImageAsBackground = (image, data__template) => {
  let data__style;
  if (!data__template) {
    /*
     * The image is being re-rendered after a change in data-bg-url. Compose the
     * data object from the values in the changed element.
     */
    data__style = {};
    data__style.height = image.getAttribute('data-height');
    data__style.width = image.getAttribute('data-width');
    data__style.bg_url = image.getAttribute('data-bg-url');
    data__style.sizing = image.getAttribute('data-sizing');
  } else {
    data__style = data__template;
  }

  let bg_image;
  if (data__style.bg_url) {
    bg_image = `url(${data__style.bg_url})`;
  } else {
    bg_image = 'none';
  }

  // Compose a style string.
  const imageStyle = `height: ${data__style.height}px; 
                      width: ${data__style.width}px; 
                      background-image: ${bg_image}; 
                      background-position: 50% 50%; 
                      background-repeat: no-repeat; 
                      background-size: ${data__style.sizing};`;

  // Set the style attribute.
  image.setAttribute('style', imageStyle);
};

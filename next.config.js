const path = require('path');
module.exports = {
  env: {
    CLOUDINARY_URL:
      'https://api.cloudinary.com/v1_1/miguelandres-site/image/upload',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
    prependData: `@import "main.scss";`,
  },
};

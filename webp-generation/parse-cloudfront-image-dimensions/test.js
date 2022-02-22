const variables = {
  allowedDimension: [
    { w: 100, h: 100 },
    { w: 200, h: 200 },
    { w: 300, h: 300 },
    { w: 400, h: 400 },
  ],
  defaultDimension: { w: 200, h: 200 },
  variance: 20,
  webpExtension: 'webp',
};

const input = '/catalog/product/t/o/totteannerbrink-ayh0edy-4nc_thumbnail_8.jpg';

const match = input.match(/(.*)\/(.*)\.(.*)/);

let prefix = match[1];
let imageName = match[2];
let extension = match[3];

// let url = [];
// url.push(prefix);
// url.push()

console.log(prefix, imageName, extension);

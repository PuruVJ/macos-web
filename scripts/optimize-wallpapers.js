// @ts-check
const { promisify } = require('util');

const sizeOf = promisify(require('image-size').default);
const resizeImg = require('resize-img');

const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const { constants } = require('fs');
const { readdir, readFile, mkdir, writeFile, access } = require('fs').promises;

const rimraf = require('rimraf');

const ora = require('ora');

const spinner = ora({
  color: 'blue',
  spinner: 'dots',
  text: '',
});

/** @param {number} final */
const counter = (final) => {
  let _count = 0;

  function increment() {
    _count++;

    console.log(`Resizing ${_count} of ${final}`);
  }

  return { increment };
};

async function main() {
  // Loop through the images
  const filesInWallpapers = (await readdir('../src/assets/wallpapers')).filter((str) =>
    str.includes('.'),
  );

  const { increment } = counter(filesInWallpapers.length);

  spinner.start();

  for (let imagePath of filesInWallpapers) {
    increment();

    const path = `../src/assets/wallpapers/${imagePath}`;

    // Check if it exists
    try {
      await access(`../src/assets/wallpapers/optimized/${imagePath}`, constants.F_OK);
      console.log('Exists');
      continue;
    } catch {}

    const { height, width } = await sizeOf(path);
    const aspectRatio = height / width;

    if (width === 2000) continue;

    // Resize
    const buffer = await resizeImg(await readFile(path), {
      width: 2000,
      height: 2000 * aspectRatio,
    });

    try {
      await mkdir('../src/assets/wallpapers/optimized');
    } catch {}

    await writeFile(`../src/assets/wallpapers/optimized/${imagePath}`, buffer, {
      encoding: 'utf-8',
    });

    // Now run imagemin
    await imagemin([`../src/assets/wallpapers/optimized/${imagePath}.jpg`], {
      plugins: [
        mozjpeg({
          quality: 86,
        }),
      ],
      destination: '../src/assets/wallpapers',
    });
  }

  spinner.text = 'Optimizing...';

  // Delete that folder
  await promisify(rimraf)('../src/assets/wallpapers/optimized');

  spinner.stop();
}

main();

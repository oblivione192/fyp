const fs = require('fs-extra');

(async () => {
  const src = './build';
  const dest = '../backend/build';

  try {
    // Ensure destination directory exists
    await fs.ensureDir(dest);
    // Move the build folder
    await fs.move(src, dest,{overwrite:true});
    console.log('Build folder moved successfully!');
  } catch (err) {
    console.error('Error moving build folder:', err.message);
  }
})();

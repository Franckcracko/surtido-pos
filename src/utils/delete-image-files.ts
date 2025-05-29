import fs from 'fs';
export const deleteImageFiles = (image: string | undefined) => {
  if (!image) return;

  const imagePath = `src/public/uploads/${image}`;

  fs.unlink(imagePath, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(`Error deleting file ${imagePath}:`, err);
    } else {
      console.log(`File ${imagePath} deleted successfully.`);
    }
  });
}
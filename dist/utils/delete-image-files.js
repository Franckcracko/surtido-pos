import fs from 'fs';
export const deleteImageFiles = (image) => {
    if (!image)
        return;
    const imagePath = `src/public/uploads/${image}`;
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error(`Error deleting file ${imagePath}:`, err);
        }
        else {
            console.log(`File ${imagePath} deleted successfully.`);
        }
    });
};

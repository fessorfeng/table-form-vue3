export const getImageSize = (image: string | File) => {
  return new Promise<{width:number, height: number}>((resolve, reject) => {
    const url = typeof image === 'string' ? image : URL.createObjectURL(image);
    const img = new Image() as HTMLImageElement;
    img.src = url;
    try {
      img.addEventListener('load', () => {
        const { naturalWidth: width, naturalHeight: height } = img;
        resolve({ width, height });
      });
    } catch (error) {
      reject(error);
    }
    // img.addEventListener('error', () => {
    //   reject(new Error('There was some problem with the image.'))
    // })
  });
};

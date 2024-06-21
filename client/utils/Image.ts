export function imageToData(image: any, func: any) {
    let img = image;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    if (ctx === null)
        return;

    canvas.width = img.width;
    canvas.height = img.height;

    img.crossOrigin = 'Anonymous';

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        func(data);
    };
};

export function dataToImage(data: any, width: any, height: any) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    if (ctx === null)
        return;

    canvas.width = width;
    canvas.height = height;

    let imgData = new ImageData(data, width, height);
    ctx.putImageData(imgData, 0, 0);

    let url = canvas.toDataURL('image/jpeg');

    return url;
};
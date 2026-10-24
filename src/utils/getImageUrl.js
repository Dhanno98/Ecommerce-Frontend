const getImageUrl = (image) => {
    if (!image) {
        return "";
    }

    // If backend returned a complete URL,
    // keep only its path and use the frontend origin.
    if (image.startsWith("http://") || image.startsWith("https://")) {
        const url = new URL(image);
        return `${import.meta.env.VITE_BACK_END_URL}${url.pathname}`;
    }

    // If backend returned only the filename.
    return `${import.meta.env.VITE_BACK_END_URL}/images/${image}`;
};

export default getImageUrl;
import { useState } from "react";

export const _postimageService = () => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    return {
        currentPhotoIndex,
        setCurrentPhotoIndex
    }
}

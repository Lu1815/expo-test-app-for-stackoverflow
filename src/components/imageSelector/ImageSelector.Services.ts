import { useState } from "react";
import { useI18n } from "../../utils/contexts/i18nContext";

export const _imageselectorService = (onSelectionChange) => {
    const { i18n } = useI18n();
    const [selectedImages, setSelectedImages] = useState([]);

    const toggleSelection = (postId) => {
        const isSelected = selectedImages.includes(postId);
        let updatedSelections = [];

        if (isSelected) {
            updatedSelections = selectedImages.filter((id) => id !== postId);
        } else {
            updatedSelections = [...selectedImages, postId];
        }

        setSelectedImages(updatedSelections);
        onSelectionChange(updatedSelections);
    };

    return {
        i18n,
        selectedImages,
        toggleSelection,
    };
};

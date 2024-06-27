import { useState } from "react";
import { Animated } from "react-native";
import { useI18n } from "../../utils/contexts/i18nContext";

type TInputServiceProps = {
    onFilterSelect?: (filter: string | null) => void;
}

export const _inputService = ({ onFilterSelect }: TInputServiceProps) => {
    const { i18n } = useI18n();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const scrollY = new Animated.Value(0);

    const handleFilterSelect = (filter: string) => {
        const newFilter = selectedFilter === filter ? null : filter;
        setSelectedFilter(newFilter);
        setDropdownVisible(false);
        if (onFilterSelect) {
            onFilterSelect(newFilter);
        }
    };

    const interpolatedScrollY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -100],
    });

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    return {
        i18n,
        dropdownVisible,
        setDropdownVisible,
        selectedFilter,
        handleFilterSelect,
        interpolatedScrollY,
        onScroll,
        scrollY
    }
}

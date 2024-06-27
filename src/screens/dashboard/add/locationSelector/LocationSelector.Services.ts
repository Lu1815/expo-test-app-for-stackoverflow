import { useI18n } from "../../../../utils/contexts/i18nContext";
import { useNavigationGH } from "../../../../utils/hooks/UseNavigation";

export const _locationselectorService = () => { 
    const { i18n } = useI18n();
    const { navigation } = useNavigationGH();

    return {
        i18n,
        navigation
    } 
}

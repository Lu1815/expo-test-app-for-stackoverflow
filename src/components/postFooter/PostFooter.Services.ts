import { useI18n } from "../../utils/contexts/i18nContext";

export const _postfooterService = () => {
    const { i18n } = useI18n();

    return {
        i18n
    }
}

import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

export const useNavigationGH = () => {
    const navigation: NavigationProp<ParamListBase> = useNavigation();

    return { navigation }
}
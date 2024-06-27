import * as Icons from "@expo/vector-icons";

export type TAccountOptions = {
    id: string;
    name: string;
    description?: string;
    iconName?: string;
    iconLibrary?: keyof typeof Icons;
    iconColor?: string;
    optionImage?: string;
}
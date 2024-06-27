import { LinkingOptions } from "@react-navigation/native";

export const getLinkingConfig = (prefix: string): LinkingOptions<ReactNavigation.RootParamList> => {
    return {
        prefixes: [prefix],
        config: {
            screens: {
                TabsNavigator: {
                    screens: {
                        Home: {
                            screens: {  
                                "Feed.Post": {
                                    path: "post/:post/:navigatingFrom/:addStatusBarMarginTop",
                                    parse: {
                                        post: (post) => {
                                            return JSON.parse(decodeURIComponent(post.slice(0, -1)))
                                        },
                                        addStatusBarMarginTop: Boolean,
                                    },
                                },
                            }
                        },
                    }
                }
            },
        }
    };
}
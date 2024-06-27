import React from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { tabsStyles as styles } from "./Tabs.Styles";

type TTabsProps = {
  tabsOptions: (string | { number: string; label: string })[];
  currentTab: string;
  setCurrentTab: (tab: string | null) => void; // Allow null to deselect
  containerStyle?: ViewStyle | ViewStyle[];
  tabStyle?: ViewStyle | ViewStyle[];
  numberStyle?: TextStyle | TextStyle[];
  labelStyle?: TextStyle | TextStyle[];
  textStyle?: TextStyle | TextStyle[];
  activeTabStyle?: ViewStyle | ViewStyle[];
  activeNumberStyle?: TextStyle | TextStyle[];
  activeLabelStyle?: TextStyle | TextStyle[];
  activeTextStyle?: TextStyle | TextStyle[];
  onTabPress?: (tab: string | null) => void;
  addDivider?: boolean;
  dividerColor?: string;
  noActiveStyle?: boolean;
};

const Tabs = ({
  tabsOptions,
  currentTab,
  setCurrentTab,
  containerStyle,
  tabStyle,
  numberStyle,
  labelStyle,
  textStyle,
  activeTabStyle,
  activeNumberStyle,
  activeLabelStyle,
  activeTextStyle,
  onTabPress,
  addDivider,
  dividerColor,
  noActiveStyle = false,
}: TTabsProps) => {
  const activeTab = activeTabStyle || styles.activeTab;
  const activeText = activeTextStyle || styles.activeText;
  const dividerStyle = { backgroundColor: dividerColor || "#ccc", width: 1 };

  const handlePress = (tab: string) => {
    const newTab = currentTab === tab ? null : tab;
    setCurrentTab(newTab);
    if (onTabPress) {
      onTabPress(newTab);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {tabsOptions.map((tab, index) => {
        const isLastTab = index === tabsOptions.length - 1;

        if (typeof tab === "string") {
          return (
            <React.Fragment key={tab}>
              <TouchableOpacity
                style={[styles.tab, tabStyle, (!noActiveStyle && currentTab === tab) && activeTab]}
                onPress={() => handlePress(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    textStyle,
                    (!noActiveStyle && currentTab === tab) && activeText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
              {addDivider && !isLastTab && (
                <View style={[styles.divider, dividerStyle]} />
              )}
            </React.Fragment>
          );
        } else {
          const { number, label } = tab;
          return (
            <React.Fragment key={label}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  tabStyle,
                  (!noActiveStyle && currentTab === label) && activeTab,
                ]}
                onPress={() => handlePress(label)}
              >
                <Text
                  style={[
                    styles.topText,
                    numberStyle,
                    (!noActiveStyle && currentTab === label) && activeText,
                  ]}
                >
                  {number}
                </Text>
                <Text
                  style={[
                    styles.tabText,
                    textStyle,
                    (!noActiveStyle && currentTab === label) && activeText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
              {addDivider && !isLastTab && (
                <View style={[styles.divider, dividerStyle]} />
              )}
            </React.Fragment>
          );
        }
      })}
    </View>
  );
};

export default Tabs;

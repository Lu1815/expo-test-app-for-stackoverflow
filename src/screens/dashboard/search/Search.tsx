import { MaterialIcons } from "@expo/vector-icons";
import React, { ReactElement, ReactNode, useCallback, useMemo } from "react";
import {
    Animated,
    FlatList,
    ListRenderItemInfo,
    Text,
    View,
} from "react-native";
import { GHSwitchBtn } from "../../../components/GHSwitchBtn";
import { Input } from "../../../components/input/Input";
import { Map } from "../../../components/map/Map";
import { PostCard } from "../../../components/postCard/PostCard";
import SkeletonLoader from "../../../components/postCard/PostCardSkeleton";
import SearchItem from "../../../components/searchItem/SearchItem";
import SearchItemSkeleton from "../../../components/searchItem/SearchItemSkeleton";
import Tabs from "../../../components/tabs/Tabs";
import { grayColor } from "../../../theme/Style";
import { TUserDetails } from "../../../utils/entities";
import { ScreenNamesEnum } from "../../../utils/lib/Consts";
import { TPostVM, isTPostVM } from "../../../utils/viewModels/PostVM";
import { _searchServices } from "./Search.Services";
import { searchStyles } from "./Search.Styles";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const Search = () => {
  const {
    currentTab,
    data,
    handlerSwitch,
    handleProfileNavigation,
    initialRegion,
    isLoading,
    isListOptionSelected,
    setCurrentTab,
    showDialog,
    formik,
    i18n,
    handleScroll,
    setCurrentFilter
  } = _searchServices();

  const renderItem = useCallback(
    ({ item }: { item: TPostVM | TUserDetails }) => {
      const isPost = isTPostVM(item);

      if (isPost) {
        return (
          <PostCard
            postId={item.postId}
            userName={item.userName}
            postImageUrls={item.postImageUrls}
            location={item.location}
            tags={item.tags}
            caption={item.caption}
            likes={item.likes}
            comments={item.comments}
            shares={item.shares}
            profilePictureUri={item.profilePictureUri}
            navigatingFrom={ScreenNamesEnum.SEARCH}
          />
        );
      } else {
        return (
          <SearchItem
            item={item}
            onPress={() => handleProfileNavigation(item.userEmail)}
          />
        );
      }
    },
    []
  );

  const renderLoader = useCallback(
    (skeletonLoader: ReactElement): ReactNode => {
      return (
        <FlatList
          data={[1, 2, 3, 4]} // An array to represent the number of placeholders
          renderItem={() => skeletonLoader}
          keyExtractor={(item) => item.toString()}
        />
      );
    },
    []
  );

  const renderLoadingOrList = useCallback((): ReactNode => {
    if (isLoading && currentTab === i18n.t("searchPostsTabText")) {
      return renderLoader(<SkeletonLoader />);
    } else if (isLoading && currentTab === i18n.t("searchAccountsTabText")) {
      return renderLoader(<SearchItemSkeleton />);
    }

    return (
      <AnimatedFlatList
        data={data}
        renderItem={(
          item: ListRenderItemInfo<TPostVM> | ListRenderItemInfo<TUserDetails>
        ) => renderItem(item)}
        keyExtractor={(_, index) => index.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={10}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
      />
    );
  }, [isLoading, data, renderItem]);

  const filterOptions = useMemo(
    () => [
      { label: i18n.t("searchFilterOptionToday"), value: "today" },
      { label: i18n.t("searchFilterOptionThisWeek"), value: "thisWeek" },
      { label: i18n.t("searchFilterOptionThisMonth"), value: "thisMonth" },
      { label: i18n.t("searchFilterOptionThisYear"), value: "thisYear" },
      { label: i18n.t("searchFilterOptionAllTime"), value: "allTime" },
    ],
    [i18n]
  );

  return (
    <View style={[searchStyles.container]}>
      <Animated.View style={[searchStyles.switchContainer]}>
        <GHSwitchBtn
          selected={isListOptionSelected}
          onPress={handlerSwitch}
          leftLabel={i18n.t("listText")}
          rightLabel={i18n.t("mapText")}
        />
      </Animated.View>

      <View style={[searchStyles.searchBarContainer]}>
        <Input
          leftIconName="search"
          rightIconName="filter-list"
          containerStyle={searchStyles.searchBar}
          leftIconColor={grayColor}
          placeholder={i18n.t("searchInputPlaceholderText")}
          onChangeText={formik.handleChange("searchTerm")}
          onBlur={formik.handleBlur("searchTerm")}
          value={formik.values.searchTerm}
          addFilters
          filterOptions={filterOptions}
          onFilterSelect={setCurrentFilter}
        />
      </View>

      <View style={searchStyles.mapContainer}>
        {initialRegion && !isListOptionSelected ? (
          <>
            {data.length === 0 && formik.values.searchTerm && !isLoading ? (
              <View style={searchStyles.mapNoResults}>
                <Text style={searchStyles.noResultsText}>
                  {i18n
                    .t("searchNotFoundText")
                    .replace(
                      "@",
                      i18n.t("searchResultsText").toLocaleLowerCase()
                    )}
                </Text>
              </View>
            ) : (
              <Map
                posts={data as TPostVM[]}
                setMarkerPopupVisible={showDialog}
                showUserLocation={false}
                navigationFrom={ScreenNamesEnum.SEARCH}
              />
            )}
          </>
        ) : (
          <>
            {data && formik.values.searchTerm ? (
              <View style={searchStyles.resultsContainer}>
                <View>
                  <Tabs
                    tabsOptions={[
                      i18n.t("searchAccountsTabText"),
                      i18n.t("searchPostsTabText"),
                    ]}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                  />
                  {data.length === 0 &&
                  formik.values.searchTerm &&
                  !isLoading ? (
                    <View style={searchStyles.noResults}>
                      <Text style={searchStyles.noResultsText}>
                        {i18n
                          .t("searchNotFoundText")
                          .replace("@", currentTab.toLocaleLowerCase())}
                      </Text>
                    </View>
                  ) : (
                    renderLoadingOrList()
                  )}
                </View>
              </View>
            ) : (
              <View style={searchStyles.welcomeContainer}>
                <MaterialIcons name="search" size={100} color={grayColor} />
                <Text style={searchStyles.welcomeText}>
                  {i18n.t("searchWelcomeText")}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

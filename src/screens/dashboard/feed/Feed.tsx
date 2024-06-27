import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { GHSwitchBtn } from "../../../components/GHSwitchBtn";
import GoogleAd from "../../../components/googleAd/GoogleAd";
import { Map } from "../../../components/map/Map";
import { PostCard } from "../../../components/postCard/PostCard";
import SkeletonLoader from "../../../components/postCard/PostCardSkeleton";
import { TScreenNames } from "../../../utils/lib/Consts";
import { TPostVM } from "../../../utils/viewModels/PostVM";
import { TFeedItem, _feedService } from "./Feed.Services";

const ITEM_HEIGHT = 550;

type TFeedProps = {
  route: {
    params?: {
      focusedPostId?: string;
      posts?: TPostVM[] | undefined;
      addStatusBarPaddingTop?: boolean;
      navigatingFrom?: TScreenNames;
      bookmarkCollectionId: string;
    };
  };
};

export const Feed = ({ route }: TFeedProps) => {
  const {
    focusedPostId,
    posts: routePostsParams,
    addStatusBarPaddingTop = true,
    navigatingFrom = "Feed",
    bookmarkCollectionId,
  } = route.params || {};

  const {
    loadMorePosts,
    posts,
    loading,
    lastVisible,
    isFetchingMore,
    flatListRef,
    routePosts,
    onRefresh,
    isRefreshing,
    select,
    handlerSwitch,
    i18n,
    initialRegion,
    tabBarHeight,
    handleNavigateToAddBookmarkScreen,
  } = _feedService({ routePostsParams, focusedPostId });

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  const MemoizedPostCard = React.memo(PostCard);

  const renderItem = useCallback(
    ({ item }) => {
      if (item.isAd) {
        return <GoogleAd />;
      } else {
        return (
          <MemoizedPostCard
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
            navigatingFrom={navigatingFrom}
          />
        );
      }
    },
    [navigatingFrom]
  );

  return (
    <View
      style={{
        flex: 1
      }}
    >
      {navigatingFrom === "Bookmarks" &&
        routePostsParams &&
        routePostsParams.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, paddingVertical: 10 }}>
            No bookmarks yet add one
          </Text>
          <TouchableOpacity
            onPress={() =>
              handleNavigateToAddBookmarkScreen(bookmarkCollectionId)
            }
          >
            <MaterialIcons name="add-circle-outline" size={100} color="#6D6D6D" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={{
            flexDirection: "row",
          }}>
            <GHSwitchBtn
              selected={select}
              onPress={handlerSwitch}
              leftLabel={i18n.t("mapText")}
              rightLabel={i18n.t("listText")}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            {initialRegion && select ? (
              <>
                <Map
                  posts={routePostsParams || (posts as TPostVM[])}
                  navigationFrom={navigatingFrom}
                />
              </>
            ) : (
              <>
                {!lastVisible && loading ? ( // SKELETON ONLY SHOWS ON FIRST LOAD
                  <FlatList
                    data={[1, 2, 3, 4]} // An array to represent the number of placeholders
                    renderItem={() => <SkeletonLoader />}
                    keyExtractor={(item) => item.toString()}
                  />
                ) : (
                  <FlatList
                    data={routePostsParams || posts}
                    renderItem={renderItem}
                    keyExtractor={(item: TFeedItem) => item.postId}
                    ListFooterComponent={renderFooter}
                    onEndReached={loadMorePosts}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    ref={flatListRef}
                    getItemLayout={(_, index) => ({
                      length: ITEM_HEIGHT,
                      offset: ITEM_HEIGHT * index,
                      index,
                    })}
                    onRefresh={onRefresh}
                    refreshing={isRefreshing}
                    initialNumToRender={10}
                  />
                )}
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

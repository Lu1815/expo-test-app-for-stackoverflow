import { useRoute } from "@react-navigation/native";
import React, { useCallback } from "react";
import { FlatList, View } from "react-native";
import { TUserDetails } from "../../utils/entities";
import SearchItem from "../searchItem/SearchItem";
import SearchItemSkeleton from "../searchItem/SearchItemSkeleton";
import { _followsListService } from "./FollowsList.Services";

type TUsersListProps = {
  listType: "following" | "followers";
  userId?: string;
};

export const FollowsList = ({ listType, userId }: TUsersListProps) => {
  const route = useRoute();
  const { listType: listTypeParam, userId: userIdParam } = route.params as TUsersListProps;
  const finalListType = listTypeParam || listType;
  const finalUserId = userIdParam || userId;

  const {
    loadMoreUsers,
    onRefresh,
    isRefreshing,
    users,
    loading,
    lastVisible,
    handleProfileNavigation,
  } = _followsListService({
    listType: finalListType,
    userId: finalUserId,
  });

  const renderItem = useCallback(
    ({ item }: { item: TUserDetails }) => (
      <SearchItem
        item={item}
        onPress={() => handleProfileNavigation(item.userEmail)}
      />
    ),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      {!lastVisible && loading ? ( // SKELETON ONLY SHOWS ON FIRST LOAD
        <FlatList
          data={[1, 2, 3, 4]} // An array to represent the number of placeholders
          renderItem={() => <SearchItemSkeleton />}
          keyExtractor={(item) => item.toString()}
        />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => JSON.stringify(item)}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
        />
      )}
    </View>
  );
};

import { useRoute } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { primaryColor } from "../../theme/Style";
import { ScreenNamesEnum, TScreenNames } from "../../utils/lib/Consts";
import { TPostVM } from "../../utils/viewModels/PostVM";
import MapMarker from "../mapMarker/MapMarker";
import { PostCard } from "../postCard/PostCard";
import { _mapService } from "./Map.Services";
import { mapStyles } from "./Map.Styles";

type TMapProps = {
  posts?: TPostVM[];
  setMarkerPopupVisible?: () => void | undefined;
  showUserLocation?: boolean;
  navigationFrom?: TScreenNames;
};

export const Map = ({
  posts = [],
  setMarkerPopupVisible = undefined,
  showUserLocation = true,
  navigationFrom,
}: TMapProps) => {
  const route = useRoute();
  const { post: postParam, navigatingFrom } = (route.params as { post: TPostVM, navigatingFrom: TScreenNames }) || {};
  const {
    initialRegion,
    isLoading,
    mapRef,
    navigation,
    handlePostNavigation,
  } = _mapService({ posts, postParam });

  const renderMapMarkers = (postsArray: TPostVM[]) => {
    return postsArray
      .map((post, index) => {
        const locationDetails = post.locationDetails;
        const location = post.location;

        if (
          locationDetails &&
          locationDetails.latitude &&
          locationDetails.longitude
        ) {
          return (
            <Marker
              key={index}
              identifier={`marker_${post.postId}`}
              coordinate={{
                latitude: locationDetails.latitude,
                longitude: locationDetails.longitude,
              }}
              title={location}
              onPress={() => {
                if (setMarkerPopupVisible) setMarkerPopupVisible();
              }}
            > 
              <MapMarker imageUri={post.postImageUrls[0]} />
              <Callout tooltip onPress={() => handlePostNavigation(post, navigatingFrom || navigationFrom)}>
                <View style={mapStyles.callout}>
                  <PostCard
                    postId={post.postId}
                    userName={post.userName}
                    postImageUrls={post.postImageUrls}
                    comments={post.comments}
                    likes={post.likes}
                    shares={post.shares}
                    tags={post.tags}
                    caption={post.caption}
                    profilePictureUri={post.profilePictureUri}
                    location={location}
                    locationDetails={locationDetails}
                    isPopup
                    navigatingFrom={ScreenNamesEnum.SEARCH}
                  />
                </View>
              </Callout>
            </Marker>
          );
        }
        return null;
      })
      .filter((marker) => marker != null); // Filter out null values
  };

  if (!initialRegion || isLoading)
    return (
      <View style={{ flex: 1, height: "100%" }}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );

  return (
    <>
      <View>
        <MapView
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
          initialRegion={initialRegion}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          showsUserLocation={showUserLocation}
          zoomControlEnabled
        >
          {renderMapMarkers(postParam ? [postParam] : posts)}
        </MapView>
      </View>
    </>
  );
};

import React from "react";
import { Dimensions, Image, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image as ImageSvg, Svg } from "react-native-svg";
import PostPagination from "../postPagination/PostPagination";
import { _postimageService } from "./PostImage.Services";

type TPostImage = {
  postImageUrls?: string[];
  isPopup?: boolean;
};

export const PostImage = (props: TPostImage) => {
  const { 
    postImageUrls, 
    isPopup 
  } = props;
  const {
    currentPhotoIndex,
    setCurrentPhotoIndex
  } = _postimageService();

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <View key={index}>
        <Image
          source={{ uri: item }}
          style={{ width: "100%", height: 300, maxHeight: 300 }}
        />
      </View>
    );
  };

  return (
    <View>
      {isPopup ? (
        <Svg width={"100%"} height={300}>
          <ImageSvg
            width={"100%"}
            height={"100%"}
            preserveAspectRatio="xMidYMid slice"
            href={
              postImageUrls && postImageUrls.length > 0
                ? postImageUrls[0]
                : "../../../assets/atardecer_dos.png"
            }
          />
        </Svg>
      ) : (
        <View style={{ height: postImageUrls.length > 1 ? 320 : 290 }}>
          <Carousel
            loop={false}
            width={Dimensions.get("window").width}
            height={300}
            autoPlay={false}
            data={postImageUrls}
            renderItem={renderItem}
            onSnapToItem={(index) => setCurrentPhotoIndex(index)}
          />
          {postImageUrls && postImageUrls.length > 1 && (
            <PostPagination
              data={postImageUrls}
              currentIndex={currentPhotoIndex}
            />
          )}
        </View>
      )}
    </View>
  );
};

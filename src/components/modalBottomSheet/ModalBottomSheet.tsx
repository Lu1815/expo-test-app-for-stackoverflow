import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from "react-native-reanimated";
import { modalBottomSheetStyles } from "./ModalBottomSheet.Styles";

type TModalProps = {
  bottomSheetModalRef: React.MutableRefObject<BottomSheetModal>;
  children: React.ReactNode;
  snapPoints?: string[];
};

export const ModalBottomSheet = ({
  bottomSheetModalRef,
  children,
  snapPoints,
}: TModalProps) => {
  // variables
  const memoizedSnapPoints = useMemo(() => snapPoints || ["25%", "50%", "80%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const CustomBackdropWithRef = useCallback((props: BottomSheetBackdropProps) => {
    return <CustomBackdrop {...props} bottomSheetRef={bottomSheetModalRef} />;
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={memoizedSnapPoints.length - 1}
      snapPoints={memoizedSnapPoints}
      onChange={handleSheetChanges}
      animateOnMount={true}
      backdropComponent={CustomBackdropWithRef}
    >
      <BottomSheetView style={modalBottomSheetStyles.contentContainer}>
        <View style={{ width: "100%", backgroundColor: "transparent" }}>
          {children}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const CustomBackdrop = ({ animatedIndex, style, bottomSheetRef }: BottomSheetBackdropProps & { bottomSheetRef: React.RefObject<BottomSheet> }) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "rgba(0,0,0,0.5)",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  const handleClose = () => {
    bottomSheetRef.current?.close();
  }

  return <Animated.View style={containerStyle} onTouchStart={handleClose}/>;
};

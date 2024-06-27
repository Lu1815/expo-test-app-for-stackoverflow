import React from 'react';
import { Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useI18n } from '../../utils/contexts/i18nContext';
import { _googleadService } from './GoogleAd.Services';
import { googleadStyles } from './GoogleAd.Styles';

const adUnitId = __DEV__ ? TestIds.BANNER : process.env.EXPO_PUBLIC_DEV_ADMOB_ANDROID_APP_ID;

const GoogleAd = () => {
  const { i18n } = useI18n();
  const {
    handleAdLoaded,
    handleAdOpened,
    handleFailedToLoad
  } = _googleadService();

  // Mimic the structure and style of your PostCard here
  return (
    <View style={googleadStyles.card}>
      {/* Mimic the header of PostCard if needed */}
      <Text style={googleadStyles.adLabel}>{i18n.t("googlAddSponsoredText")}</Text>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.INLINE_ADAPTIVE_BANNER} // Adjust the size as needed for your layout
        onAdFailedToLoad={handleFailedToLoad}
        onAdLoaded={handleAdLoaded}
        onAdOpened={handleAdOpened}
      />
      {/* Mimic the footer of PostCard if needed */}
    </View>
  );
};

export default GoogleAd;

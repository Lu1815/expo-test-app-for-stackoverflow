// componentTemplates.js
exports.tsxContent = (formattedComponentName) => `
import React from 'react';
import { View, Text } from 'react-native';

export const ${formattedComponentName} = () => {
   return (
    <View>
      <Text>${formattedComponentName}</Text>
    </View>
   );
}
`;

exports.stylesContent = (componentName) => `
import { StyleSheet } from 'react-native';

export const ${componentName.toLowerCase()}Styles = StyleSheet.create({})
`;

exports.servicesContent = (componentName) => `
export const _${componentName.toLowerCase()}Service = () => { return {} }
`;

exports.navigatorContent = (formattedComponentName) => `
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ${formattedComponentName} } from './${formattedComponentName}';

const Stack = createNativeStackNavigator();

export const ${formattedComponentName}Navigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="${formattedComponentName}" component={${formattedComponentName}} />
    </Stack.Navigator>
  );
};
`;

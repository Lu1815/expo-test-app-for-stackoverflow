import { StyleSheet } from 'react-native';
import { grayColor, primaryColor } from '../../theme/Style';

export const inputStyles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: grayColor,
    borderRadius: 5,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  icon: {
    paddingHorizontal: 10,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    zIndex: 1000,
    marginTop: 5,
    borderRadius: 5,
  },
  filterText: {
    marginTop: 4,
    color: 'gray',
    fontSize: 14,
    zIndex: 0,
  },
  filterItem: {
    padding: 12,
  },
  selectedFilterItem: {
    backgroundColor: '#fcefe6',  // Background color for selected item
  },
  selectedFilterText: {
    color: primaryColor,  // Text color for selected item
    fontWeight: 'bold',
  },
});

import { StyleSheet } from 'react-native';

export const tabsStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#F78131',
  },
  topText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeText: {
    color: '#F78131',
    fontWeight: 'bold',
  },
  divider: {
    height: '80%',
    alignSelf: 'center',
  },
});

import { StyleSheet } from 'react-native';

export const profiledetailsStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 10,
        marginTop: 20,
      },
      imagePickerContainer: {
        alignItems: 'center',
        marginVertical: 20,
      },
      profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
      inputContainer: {
        marginBottom: 10,
      },
      submitButton: {
        backgroundColor: '#F78131',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
      },
      errorText: {
        color: 'red',
        marginBottom: 10,
      }
})

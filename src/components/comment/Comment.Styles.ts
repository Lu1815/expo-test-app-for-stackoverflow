
import { StyleSheet } from 'react-native';
import { primaryColor } from '../../theme/Style';

export const commentStyles = StyleSheet.create({
    commentContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ececec',
    },
    commentContentContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
    },
    commentInfoContainer: {
        flex: 1,
    },
    comment: {
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
    },
    username: {
        display: 'flex',
        fontWeight: 'bold',
    },
    commentText: {
        fontWeight: 'normal',
        flexWrap: 'wrap',
    },
    likeButton: {
        marginLeft: 'auto',
        paddingLeft: 5,
        paddingBottom: 5,
    },
    commentInfo: {
        fontSize: 12,
        color: 'grey',
        marginTop: 4,
    },
    replyButton: {
        marginTop: 4,
    },
    replyButtonText: {
        color: primaryColor,
        fontSize: 12,
    },
    commentRepliesContainer: {
        marginTop: 10,
        marginLeft: 40,
    },
    showAnswersButton: {
        padding: 10,
        backgroundColor: '#eeee',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5,
    },
    showAnswersButtonText: {
        color: primaryColor,
    },
})

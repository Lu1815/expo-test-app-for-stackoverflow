import React from 'react';
import { View } from 'react-native';
import { postpaginationStyles } from './PostPagination.Styles';

interface PaginationProps {
  data: string[];
  currentIndex: number;
}

const PostPagination: React.FC<PaginationProps> = ({ data, currentIndex }: PaginationProps) => {
  return (
    <View style={postpaginationStyles.container}>
      {data.map((_, index) => (
        <View
          key={index}
          style={[
            postpaginationStyles.dot,
            index === currentIndex ? postpaginationStyles.activeDot : postpaginationStyles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

export default PostPagination;

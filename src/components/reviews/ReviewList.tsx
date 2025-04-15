import React from 'react';
import { List, Rate, Card, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  reviewer: {
    name: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, loading = false }) => {
  return (
    <List
      loading={loading}
      itemLayout="vertical"
      dataSource={reviews}
      renderItem={(review) => (
        <List.Item>
          <Card className="w-full">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Rate disabled defaultValue={review.rating} />
                <Text className="ml-2 text-gray-600">
                  by {review.reviewer?.name || 'Anonymous'}
                </Text>
              </div>
              <Text className="text-gray-400">
                {dayjs(review.created_at).fromNow()}
              </Text>
            </div>
            <Text>{review.review_text}</Text>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ReviewList; 
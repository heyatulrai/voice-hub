import React, { useState } from 'react';
import { Form, Input, Rate, Button, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const { TextArea } = Input;

interface ReviewFormProps {
  voiceActorId: string;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ voiceActorId, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { rating: number; review_text: string }) => {
    if (!user) {
      message.error('Please sign in to leave a review');
      return;
    }

    setLoading(true);
    try {
      // Insert the review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert([
          {
            voice_actor_id: voiceActorId,
            reviewer_id: user.id,
            rating: values.rating,
            review_text: values.review_text,
            created_at: new Date().toISOString(),
          },
        ]);

      if (reviewError) throw reviewError;

      // Update voice_actors table with new rating average and count
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('voice_actor_id', voiceActorId);

      if (reviews) {
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        const { error: updateError } = await supabase
          .from('voice_actors')
          .update({
            rating: avgRating,
            review_count: reviews.length,
          })
          .eq('id', voiceActorId);

        if (updateError) throw updateError;
      }

      message.success('Review submitted successfully!');
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="max-w-lg"
    >
      <Form.Item
        name="rating"
        label="Rating"
        rules={[{ required: true, message: 'Please give a rating!' }]}
      >
        <Rate allowHalf={false} />
      </Form.Item>

      <Form.Item
        name="review_text"
        label="Review"
        rules={[{ required: true, message: 'Please write your review!' }]}
      >
        <TextArea
          rows={4}
          placeholder="Share your experience with this voice actor..."
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!user}
        >
          Submit Review
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm; 
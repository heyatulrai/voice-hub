import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, VoiceActor } from '../lib/supabase';
import {
  Layout,
  Card,
  Input,
  Select,
  Rate,
  Tag,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Avatar,
  Spin,
  Empty,
  message
} from 'antd';
import {
  UserOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StarOutlined,
  EnvironmentOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import styles from '../styles/pages/HomePage.module.css';

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const HomePage: React.FC = () => {
  const [actors, setActors] = useState<VoiceActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const categories = [
    'Commercial',
    'Animation',
    'Audiobook',
    'Video Games',
    'Documentary',
    'E-Learning'
  ];

  useEffect(() => {
    fetchVoiceActors();
  }, []);

  const fetchVoiceActors = async () => {
    try {
      // First fetch voice actors
      const { data: actorsData, error: actorsError } = await supabase
        .from('voice_actors')
        .select('*');

      if (actorsError) throw actorsError;

      // Then fetch all reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('voice_actor_id, rating');

      if (reviewsError) throw reviewsError;

      // Calculate average rating and review count for each actor
      const actorsWithReviews = actorsData?.map(actor => {
        const actorReviews = reviewsData?.filter(review => review.voice_actor_id === actor.id) || [];
        const reviewCount = actorReviews.length;
        const averageRating = reviewCount > 0
          ? actorReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          : 0;

        return {
          ...actor,
          rating: averageRating,
          review_count: reviewCount
        };
      }) || [];

      setActors(actorsWithReviews);
    } catch (error) {
      message.error('Failed to fetch voice actors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string | undefined) => {
    setSelectedCategory(value || '');
  };

  const handleAudioPlay = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
      const audio = document.querySelector(`audio[src="${audioUrl}"]`) as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } else {
      if (playingAudio) {
        const previousAudio = document.querySelector(`audio[src="${playingAudio}"]`) as HTMLAudioElement;
        if (previousAudio) {
          previousAudio.pause();
          previousAudio.currentTime = 0;
        }
      }
      setPlayingAudio(audioUrl);
      const audio = document.querySelector(`audio[src="${audioUrl}"]`) as HTMLAudioElement;
      if (audio) {
        audio.play().catch(() => {
          message.error('Failed to play audio');
        });
      }
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const filteredActors = actors.filter(actor => {
    const matchesSearch = searchTerm === '' ||
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      actor.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === '' ||
      actor.skills.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        zIndex: 9999
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Row gutter={16} className={styles.searchSection} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Search voice actors by name, skill, or language..."
              allowClear
              onSearch={handleSearch}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col flex="none">
            <Select
              placeholder="Select Category"
              style={{ width: '240px' }}
              onChange={handleCategoryChange}
              allowClear
              size="large"
              value={selectedCategory}
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col flex="none">
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleReset}
              size="large"
              title="Reset all filters"
            >
              Reset
            </Button>
          </Col>
        </Row>

        {filteredActors.length === 0 ? (
          <Empty
            description="No voice actors found"
            className="py-12"
          />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredActors.map(actor => (
              <Col key={actor.id} xs={24} sm={12} lg={8} xl={6}>
                <Card
                  hoverable
                  className="h-full"
                  actions={[
                    <Button
                      key="play"
                      type="text"
                      icon={playingAudio === actor.demo_audio_url ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={() => handleAudioPlay(actor.demo_audio_url)}
                    >
                      Demo
                    </Button>,
                    <Link key="view" to={`/profile/${actor.id}`}>
                      <Button type="link">View Profile</Button>
                    </Link>
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        size={64}
                        src={actor.profile_picture_url}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <Space className="w-full flex justify-between">
                        <Text strong>{actor.name}</Text>
                        <Space>
                          <StarOutlined className="text-yellow-500" />
                          <Text>{actor.rating.toFixed(1)}</Text>
                        </Space>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" className="w-full">
                        <Space>
                          <EnvironmentOutlined />
                          <Text type="secondary">{actor.location}</Text>
                        </Space>
                        <div>
                          {actor.languages.slice(0, 2).map(lang => (
                            <Tag key={lang} color="blue">{lang}</Tag>
                          ))}
                          {actor.languages.length > 2 && (
                            <Tag>+{actor.languages.length - 2}</Tag>
                          )}
                        </div>
                        <div>
                          {actor.skills.slice(0, 3).map(skill => (
                            <Tag key={skill}>{skill}</Tag>
                          ))}
                          {actor.skills.length > 3 && (
                            <Tag>+{actor.skills.length - 3}</Tag>
                          )}
                        </div>
                      </Space>
                    }
                  />
                  <audio src={actor.demo_audio_url} />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomePage; 
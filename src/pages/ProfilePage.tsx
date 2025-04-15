import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, VoiceActor, Job } from '../lib/supabase';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Rate,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Space,
  Statistic,
  Avatar,
  message,
  Spin,
  Divider,
  List,
  Layout
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  SendOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  StarOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from '../styles/pages/ProfilePage.module.css';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [actor, setActor] = useState<VoiceActor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [jobForm, setJobForm] = useState<Partial<Job>>({
    project_name: '',
    category: 'Commercial',
    voice_characteristics: [],
    language: '',
    accent: '',
    voice_gender: '',
    script_url: '',
    audio_length: 0,
    deadline: '',
    budget: 0,
    approval_method: 'single_step'
  });

  // Add voice character options
  const voiceCharacterOptions = [
    'Comedic',
    'Deep',
    'Energetic',
    'Authoritative',
    'Friendly',
    'Professional',
    'Warm',
    'Serious',
    'Youthful',
    'Dramatic'
  ];

  // Add categories
  const categories = [
    'Commercial',
    'Animation',
    'Audiobook',
    'Video Games',
    'Documentary',
    'E-Learning',
    'IVR/Phone System',
    'Podcast'
  ];

  // Add languages
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Mandarin',
    'Japanese',
    'Hindi',
    'Arabic'
  ];

  // Add accents
  const accents = [
    'American',
    'British',
    'Australian',
    'Canadian',
    'Irish',
    'Scottish',
    'Neutral'
  ];

  useEffect(() => {
    fetchVoiceActor();
  }, [id]);

  const fetchVoiceActor = async () => {
    try {
      // Fetch voice actor details
      const { data: actorData, error: actorError } = await supabase
        .from('voice_actors')
        .select('*')
        .eq('id', id)
        .single();

      if (actorError) throw actorError;

      // Fetch reviews for this actor
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('voice_actor_id', id);

      if (reviewsError) throw reviewsError;

      // Calculate average rating
      const reviewCount = reviewsData?.length || 0;
      const averageRating = reviewCount > 0
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

      // Combine actor data with review stats
      const actorWithReviews = {
        ...actorData,
        rating: averageRating,
        review_count: reviewCount,
        reviews: reviewsData
      };

      setActor(actorWithReviews);
    } catch (error) {
      message.error('Failed to fetch voice actor details');
    } finally {
      setLoading(false);
    }
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

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `scripts/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('voicehub')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('voicehub')
        .getPublicUrl(filePath);

      // Set the URL string directly
      const publicUrl = data.publicUrl;
      form.setFieldValue('script_url', publicUrl);
      message.success('File uploaded successfully');
    } catch (error) {
      message.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmitJob = async (values: any) => {
    try {
      // Convert deadline to ISO string if it exists
      const deadline = values.deadline ? values.deadline.toISOString() : null;

      // Get the script URL directly from form
      const scriptUrl = form.getFieldValue('script_url');

      const jobData = {
        ...values,
        voice_actor_id: id,
        deadline,
        script_url: scriptUrl || '' // Use the URL from form
      };


      const { error } = await supabase.from('jobs').insert(jobData);

      if (error) throw error;
      
      message.success('Job invitation sent successfully');
      setShowJobModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create job invitation');
    }
  };

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

  if (!actor) {
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
        <Typography.Text type="danger">Voice actor not found</Typography.Text>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <div className={styles.container}>
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          size="large"
          className={styles.backButton}
          style={{ marginBottom: 24 }}
        >
          Back to Search
        </Button>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Main Profile Section */}
          <Row gutter={[24, 24]}>
            {/* Left Column - Main Info */}
            <Col xs={24} lg={16}>
              <Card className="mb-6 shadow-sm">
                <Space className="w-full" direction="vertical" size="large">
                  <Row align="top" gutter={[16, 16]} className="w-full">
                    <Col flex="auto">
                      <Space className="w-full" align="start">
                        <Avatar 
                          size={96} 
                          src={actor.profile_picture_url} 
                          icon={<UserOutlined />}
                        />
                        <div className="flex-1">
                          <Title level={2} style={{ marginBottom: 4 }}>{actor.name}</Title>
                          <Space align="center" size="middle" wrap>
                            <Space>
                              <EnvironmentOutlined />
                              <Text type="secondary">{actor.location}</Text>
                            </Space>
                            <Divider type="vertical" />
                            <Space>
                              <StarOutlined style={{ color: '#faad14' }} />
                              <Text>{actor.rating.toFixed(1)}</Text>
                              <Text type="secondary">({actor.review_count} reviews)</Text>
                            </Space>
                            <Rate disabled defaultValue={actor.rating} style={{ fontSize: 14 }} />
                          </Space>
                        </div>
                      </Space>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Space direction="vertical" size="small" className="w-full">
                        <Button
                          type="primary"
                          size="large"
                          icon={<SendOutlined />}
                          onClick={() => setShowJobModal(true)}
                        >
                          Invite to Job
                        </Button>
                        <Text type="secondary" className="text-sm">
                          Typically responds within {actor.reply_time}
                        </Text>
                      </Space>
                    </Col>
                  </Row>

                  <Divider style={{ margin: '16px 0' }} />

                  <div>
                    <Title level={4}>About</Title>
                    <Paragraph>{actor.bio}</Paragraph>
                  </div>

                  <div>
                    <Title level={4}>Certifications</Title>
                    <Space wrap size={[8, 16]}>
                      {actor.certifications.map((cert, index) => (
                        <Tag key={index} color="blue">{cert}</Tag>
                      ))}
                    </Space>
                  </div>

                  <div>
                    <Title level={4}>Skills</Title>
                    <Space wrap size={[8, 16]}>
                      {actor.skills.map((skill, index) => (
                        <Tag key={index}>{skill}</Tag>
                      ))}
                    </Space>
                  </div>

                  <div>
                    <Title level={4}>Languages</Title>
                    <Space wrap size={[8, 16]}>
                      {actor.languages.map((language, index) => (
                        <Tag key={index} color="green">{language}</Tag>
                      ))}
                    </Space>
                  </div>
                </Space>
              </Card>

              {/* Audio Portfolio Section */}
              <Card title="Audio Portfolio" className="mb-6 shadow-sm">
                <Row gutter={[16, 16]}>
                  {actor.audio_snippets.map((audioUrl, index) => (
                    <Col key={index} xs={24} sm={12}>
                      <Card 
                        size="small" 
                        hoverable
                        className="flex items-center justify-center"
                        bodyStyle={{ width: '100%', padding: '12px' }}
                      >
                        <Button
                          type="text"
                          icon={playingAudio === audioUrl ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                          onClick={() => handleAudioPlay(audioUrl)}
                          size="large"
                        >
                          Voice Sample {index + 1}
                        </Button>
                        <audio src={audioUrl} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            {/* Right Column - Widgets */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" size="middle" className="w-full">
                {/* Activity Widget */}
                <Card className="shadow-sm">
                  <Title level={4}>Activity & Stats</Title>
                  <Row gutter={[16, 24]}>
                    <Col xs={12}>
                      <Statistic
                        title="Last Online"
                        value={dayjs(actor.last_online).fromNow()}
                        prefix={<ClockCircleOutlined />}
                      />
                    </Col>
                    <Col xs={12}>
                      <Statistic
                        title="Reply Time"
                        value={actor.reply_time}
                        prefix={<MessageOutlined />}
                      />
                    </Col>
                    <Col xs={12}>
                      <Statistic
                        title="Last Hired"
                        value={actor.last_hired ? dayjs(actor.last_hired).fromNow() : 'Not available'}
                        prefix={<CalendarOutlined />}
                      />
                    </Col>
                    <Col xs={12}>
                      <Statistic
                        title="Completed Jobs"
                        value={actor.completed_jobs}
                        prefix={<CheckCircleOutlined />}
                      />
                    </Col>
                  </Row>
                </Card>

                {/* Past Clients Widget */}
                <Card className="shadow-sm">
                  <Title level={4}>Past Clients</Title>
                  <List
                    dataSource={actor.past_clients}
                    renderItem={client => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar style={{ backgroundColor: '#f56a00' }}>
                              {client.charAt(0)}
                            </Avatar>
                          }
                          title={client}
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                {/* Recent Reviews */}
                <Card className="shadow-sm">
                  <Title level={4}>Recent Reviews</Title>
                  <List
                    itemLayout="vertical"
                    dataSource={actor.reviews || []}
                    locale={{ emptyText: 'No reviews yet' }}
                    renderItem={review => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={
                            <Space>
                              <Text strong>Client Review</Text>
                              <Rate disabled value={review.rating} />
                            </Space>
                          }
                          description={dayjs(review.created_at).format('MMMM D, YYYY')}
                        />
                        {review.review_text}
                      </List.Item>
                    )}
                  />
                </Card>
              </Space>
            </Col>
          </Row>

          {/* Job Modal */}
          <Modal
            title="Create Job Invitation"
            open={showJobModal}
            onCancel={() => setShowJobModal(false)}
            footer={null}
            width={800}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitJob}
              initialValues={{
                category: 'Commercial',
                voice_characteristics: [],
                approval_method: 'single_step'
              }}
            >
              <Form.Item
                name="project_name"
                label="Project Name"
                rules={[{ required: true, message: 'Please enter project name' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Radio.Group>
                  <Space wrap>
                    {categories.map((cat) => (
                      <Radio key={cat} value={cat}>
                        {cat}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="voice_characteristics"
                label="Voice Characteristics"
              >
                <Checkbox.Group>
                  <Space wrap>
                    {voiceCharacterOptions.map((char) => (
                      <Checkbox key={char} value={char}>
                        {char}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="language"
                    label="Language"
                    rules={[{ required: true, message: 'Please select language' }]}
                  >
                    <Select>
                      {languages.map((lang) => (
                        <Option key={lang} value={lang}>{lang}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="accent"
                    label="Accent"
                  >
                    <Select>
                      <Option value="">Select Accent</Option>
                      {accents.map((accent) => (
                        <Option key={accent} value={accent}>{accent}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="voice_gender"
                label="Voice Gender"
                rules={[{ required: true, message: 'Please select voice gender' }]}
              >
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="script_url"
                label="Script Upload"
              >
                <div>
                  <Upload
                    beforeUpload={handleFileUpload}
                    maxCount={1}
                    accept=".pdf,.doc,.docx,.txt"
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />} loading={uploading}>
                      Upload Script
                    </Button>
                  </Upload>
                  {form.getFieldValue('script_url') && (
                    <div className="mt-2">
                      <Text type="success">File uploaded successfully!</Text>
                      <br />
                      <Text type="secondary" className="text-sm break-all">
                        {form.getFieldValue('script_url')}
                      </Text>
                    </div>
                  )}
                </div>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="audio_length"
                    label="Estimated Audio Length (minutes)"
                    rules={[{ required: true, message: 'Please enter estimated length' }]}
                  >
                    <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="deadline"
                    label="Project Deadline"
                    rules={[{ required: true, message: 'Please select deadline' }]}
                  >
                    <DatePicker style={{ width: '100%' }} disabledDate={(d) => d.isBefore(dayjs())} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="budget"
                label="Budget ($)"
                rules={[{ required: true, message: 'Please enter budget' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  prefix={<DollarOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="approval_method"
                label="Approval Method"
                rules={[{ required: true, message: 'Please select approval method' }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    {[
                      'Single review and approval',
                      'Multiple revision rounds allowed',
                      'Milestone-based approval',
                      'Live direction session required'
                    ].map((method) => (
                      <Radio key={method} value={method}>
                        {method}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button onClick={() => setShowJobModal(false)}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Submit Invitation
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage; 
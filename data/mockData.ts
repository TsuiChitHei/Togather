import { User, Community, Event, Post } from '../context/AppContext';

export const MOCK_USERS: User[] = [
  {
    id: 'user-2',
    email: 'jane@test.com',
    password: 'password',
    name: 'Jane Doe',
    year: 3,
    faculty: 'Arts and Social Sciences',
    major: 'Psychology',
    hometown: 'Vancouver',
    interests: ['Hiking', 'Photography', 'Baking', 'Movies'],
    bio: 'Just a psych major trying to understand the world, one cup of coffee at a time. Love capturing moments and exploring new trails!',
    privatePrompts: { prompt1: "A perfect weekend for me is being outdoors.", prompt2: "I'm looking for friends who are open-minded and love to laugh." },
    joinedCommunityIds: ['comm-1', 'comm-3'],
    signedUpEventIds: ['event-1', 'event-3'],
    avatarUrl: 'https://picsum.photos/seed/jane/200'
  },
  {
    id: 'user-3',
    email: 'sam@test.com',
    password: 'password',
    name: 'Sam Wilson',
    year: 5,
    faculty: 'Engineering',
    major: 'Mechanical Engineering',
    hometown: 'Toronto',
    interests: ['Robotics', '3D Printing', 'Cycling', 'Sci-Fi'],
    bio: 'Building the future, one gear at a time. Avid cyclist and sci-fi enthusiast. Let\'s talk tech!',
    privatePrompts: { prompt1: "Something that fascinates me is the potential of AI.", prompt2: "I connect best with people who are passionate about their hobbies." },
    joinedCommunityIds: ['comm-2'],
    signedUpEventIds: ['event-1', 'event-2'],
    avatarUrl: 'https://picsum.photos/seed/sam/200'
  },
];

export const MOCK_COMMUNITIES: Community[] = [
  { id: 'comm-1', name: 'Fishing Club', description: 'For all angling enthusiasts, from beginners to pros.', memberCount: 78, imageUrl: 'https://picsum.photos/seed/fishing/600/400', members: ['user-2'] },
  { id: 'comm-2', name: 'Fun Bouldering', description: 'Climb, connect, and conquer new heights together.', memberCount: 123, imageUrl: 'https://picsum.photos/seed/bouldering/600/400', members: ['user-3'] },
  { id: 'comm-3', name: 'Movie Buffs', description: 'Discussing everything from blockbusters to indie gems.', memberCount: 210, imageUrl: 'https://picsum.photos/seed/movie/600/400', members: ['user-2'] },
  { id: 'comm-4', name: 'Startup Grind', description: 'Connect with fellow entrepreneurs and build the future.', memberCount: 95, imageUrl: 'https://picsum.photos/seed/startup/600/400', members: [] },
];

export const MOCK_EVENTS: Event[] = [
  { id: 'event-1', name: 'The Peak Social Hike', time: 'Today, 5pm', location: 'Sai Ying Pun MTR Exit A2', communityId: 'comm-1', description: 'Join us for a scenic hike up The Peak! A great way to meet new people and enjoy the amazing Hong Kong skyline. We\'ll meet at the MTR exit and head up together. All fitness levels welcome.', imageUrl: 'https://picsum.photos/seed/hike/200/200', attendees: ['user-2', 'user-3'] },
  { id: 'event-2', name: 'West Kowloon 5k Run', time: 'Tomorrow, 6pm', location: 'West Kowloon Cultural District', communityId: 'comm-2', description: 'Let\'s go for a casual 5k run along the beautiful West Kowloon waterfront. A perfect way to de-stress and stay active. We\'ll end with some stretching and social time.', imageUrl: 'https://picsum.photos/seed/run/200/200', attendees: ['user-3'] },
  { id: 'event-3', name: 'Inception Screening', time: 'Friday, 8pm', location: 'Campus Cinema', communityId: 'comm-3', description: 'Join the Movie Buffs for a special screening of Christopher Nolan\'s masterpiece, Inception. Popcorn will be provided! We\'ll have a short discussion after the film.', imageUrl: 'https://picsum.photos/seed/cinema/200/200', attendees: ['user-2'] },
  { id: 'event-4', name: 'Pitch Night', time: 'Next Tuesday, 7pm', location: 'Innovation Hub', communityId: 'comm-4', description: 'Have a startup idea? Come pitch it to fellow entrepreneurs and get valuable feedback. Or just come to listen and get inspired!', imageUrl: 'https://picsum.photos/seed/pitch/200/200', attendees: [] },
];

export const MOCK_POSTS: Post[] = [
    { id: 'post-1', type: 'event', authorId: 'user-2', communityId: 'comm-1', timestamp: '2h ago', eventId: 'event-1' },
    { id: 'post-2', type: 'text', authorId: 'user-3', communityId: 'comm-2', timestamp: '5h ago', content: 'Just finished a new climbing route at the gym! Feeling accomplished. Anyone else hit a PR recently?' },
    { id: 'post-3', type: 'event', authorId: 'user-2', communityId: 'comm-3', timestamp: '1d ago', eventId: 'event-3' },
    { id: 'post-4', type: 'text', authorId: 'user-2', communityId: 'comm-3', timestamp: '2d ago', content: 'Just rewatched Blade Runner 2049. What a masterpiece. What are your thoughts on it?' },
];
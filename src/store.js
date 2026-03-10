// In-memory data store with seed data
// Re-initialized on every import (handles Vercel cold starts)

const store = {
  users: new Map(),
  posts: new Map(),
  follows: new Map(),    // userId -> Set of followedUserIds
  followers: new Map(),  // userId -> Set of followerUserIds
  likes: new Map(),      // postId -> Set of userIds
  comments: new Map(),   // postId -> Array of comment objects
  notifications: new Map(), // userId -> Array of notification objects
  bookmarks: new Map(),  // userId -> Set of postIds
  counters: { userId: 0, postId: 0, commentId: 0, notificationId: 0 }
};

function generateId(type) {
  store.counters[type]++;
  return String(store.counters[type]);
}

// Seed 5 users
const seedUsers = [
  {
    username: 'alexchen',
    display_name: 'Alex Chen',
    bio: 'Full-stack developer. Coffee enthusiast. Building things that matter.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexchen'
  },
  {
    username: 'sarahwave',
    display_name: 'Sarah Wave',
    bio: 'Designer & photographer. Capturing moments one pixel at a time.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahwave'
  },
  {
    username: 'markusdev',
    display_name: 'Markus Dev',
    bio: 'Open source contributor. Rust & Go. Minimalist by choice.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=markusdev'
  },
  {
    username: 'emilygrows',
    display_name: 'Emily Grows',
    bio: 'Plant mom. Urban gardener. Sharing green tips for city dwellers.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emilygrows'
  },
  {
    username: 'jaketravels',
    display_name: 'Jake Travels',
    bio: 'Nomad life. 30 countries and counting. Stories from the road.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jaketravels'
  }
];

// Create seeded users
seedUsers.forEach(userData => {
  const id = generateId('userId');
  store.users.set(id, {
    id,
    ...userData,
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  });
  store.follows.set(id, new Set());
  store.followers.set(id, new Set());
  store.notifications.set(id, []);
  store.bookmarks.set(id, new Set());
});

// Set up some follow relationships
// Alex follows Sarah, Markus, Emily
store.follows.get('1').add('2').add('3').add('4');
store.followers.get('2').add('1');
store.followers.get('3').add('1');
store.followers.get('4').add('1');

// Sarah follows Alex, Jake
store.follows.get('2').add('1').add('5');
store.followers.get('1').add('2');
store.followers.get('5').add('2');

// Markus follows Alex, Sarah
store.follows.get('3').add('1').add('2');
store.followers.get('1').add('3');
store.followers.get('2').add('3');

// Emily follows Sarah, Jake
store.follows.get('4').add('2').add('5');
store.followers.get('2').add('4');
store.followers.get('5').add('4');

// Jake follows Alex, Emily
store.follows.get('5').add('1').add('4');
store.followers.get('1').add('5');
store.followers.get('4').add('5');

// Seed 20 posts
const seedPosts = [
  { author_id: '1', text: 'Just deployed my latest project to production! The feeling never gets old. #coding #webdev', image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600' },
  { author_id: '2', text: 'Golden hour at the pier. Sometimes the best shots are unplanned. #photography #sunset', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },
  { author_id: '3', text: 'Rust ownership model finally clicked today. The borrow checker is your friend, not your enemy. #rust #programming', image_url: null },
  { author_id: '4', text: 'My monstera just unfurled a new leaf! Look at that fenestration. #plants #monstera #urbangarden', image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600' },
  { author_id: '5', text: 'Street food in Bangkok never disappoints. This pad thai was incredible. #travel #thailand #foodie', image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600' },
  { author_id: '1', text: 'Hot take: CSS is a real programming language and deserves respect. Fight me. #css #webdev #hottake', image_url: null },
  { author_id: '2', text: 'New camera lens arrived! Can\'t wait to test it this weekend. #photography #gear', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600' },
  { author_id: '3', text: 'Built a CLI tool in Go that reduced our deploy time by 60%. Sometimes simple tools make the biggest impact. #golang #devops', image_url: null },
  { author_id: '4', text: 'Pro tip: coffee grounds make excellent fertilizer for acid-loving plants like blueberries and azaleas. #gardening #tips', image_url: null },
  { author_id: '5', text: 'Watching sunrise over Angkor Wat. Some places live up to the hype. #cambodia #travel #bucketlist', image_url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600' },
  { author_id: '1', text: 'Code review tip: review the tests first. They tell you what the code is supposed to do. #codereview #engineering', image_url: null },
  { author_id: '2', text: 'Experimenting with long exposure photography. The city looks magical at night. #longexposure #nightphotography', image_url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600' },
  { author_id: '3', text: 'Just open sourced my terminal dashboard. 200 stars in 24 hours! The community response has been amazing. #opensource #terminal', image_url: null },
  { author_id: '4', text: 'Started composting last month. Already seeing results in my soil quality. Small changes, big impact. #sustainability #composting', image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600' },
  { author_id: '5', text: 'Lost my passport in Lisbon. Three hours at the embassy later, adventure continues. Travel isn\'t always glamorous. #travel #reallife', image_url: null },
  { author_id: '1', text: 'Anyone else excited about the new Node.js features? The built-in test runner is a game changer. #nodejs #javascript', image_url: null },
  { author_id: '2', text: 'Portrait session today. Natural light, no flash, minimal editing. Less is more. #portrait #photography', image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600' },
  { author_id: '4', text: 'My balcony garden is thriving! Tomatoes, basil, and peppers all from seed. #growyourown #balconygarden', image_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600' },
  { author_id: '5', text: 'Best coffee I\'ve ever had was in a tiny village in Ethiopia. The origin country truly hits different. #coffee #ethiopia #travel', image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600' },
  { author_id: '3', text: 'Controversial opinion: most microservices should be monoliths. Complexity is not a feature. #architecture #softwareengineering', image_url: null }
];

// Create seeded posts with staggered timestamps
seedPosts.forEach((postData, index) => {
  const id = generateId('postId');
  const hoursAgo = (seedPosts.length - index) * 2; // Most recent posts last
  store.posts.set(id, {
    id,
    ...postData,
    created_at: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
    updated_at: null
  });
  store.likes.set(id, new Set());
  store.comments.set(id, []);
});

// Add some seed likes
const likeData = [
  ['1', ['2', '5', '7', '12']], // Alex likes these posts
  ['2', ['1', '4', '6', '11', '16']], // Sarah likes these
  ['3', ['1', '6', '8', '11', '16', '20']], // Markus likes these
  ['4', ['2', '4', '9', '14', '18']], // Emily likes these
  ['5', ['1', '2', '5', '10', '15', '19']] // Jake likes these
];

likeData.forEach(([userId, postIds]) => {
  postIds.forEach(postId => {
    if (store.likes.has(postId)) {
      store.likes.get(postId).add(userId);
    }
  });
});

// Add some seed comments
const seedComments = [
  { post_id: '1', author_id: '2', text: 'Congrats on the launch! What stack did you use?' },
  { post_id: '1', author_id: '3', text: 'Nothing beats that deploy feeling. Well done!' },
  { post_id: '2', author_id: '1', text: 'Stunning shot! What camera are you using?' },
  { post_id: '4', author_id: '2', text: 'So jealous! My monstera is still tiny.' },
  { post_id: '5', author_id: '4', text: 'Adding this to my travel list!' },
  { post_id: '6', author_id: '3', text: 'CSS is Turing complete, so technically yes!' },
  { post_id: '10', author_id: '1', text: 'Angkor Wat is on my bucket list too!' },
  { post_id: '13', author_id: '1', text: '200 stars? That\'s awesome! Dropping a star now.' },
  { post_id: '16', author_id: '3', text: 'The built-in test runner is fantastic. No more jest configs!' },
  { post_id: '20', author_id: '1', text: 'Strongly agree. Start with a monolith, split later if needed.' }
];

seedComments.forEach(commentData => {
  const id = generateId('commentId');
  const comment = {
    id,
    ...commentData,
    created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
  };
  if (store.comments.has(commentData.post_id)) {
    store.comments.get(commentData.post_id).push(comment);
  }
});

module.exports = { store, generateId };

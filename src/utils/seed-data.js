import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// Define Post schema
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create Post model (only if it doesn't exist)
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function seedPosts() {
  try {
    // Connect to MongoDB using environment variable
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Delete existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');
    
    // Create sample posts
    const posts = [
      {
        _id: new ObjectId(),
        title: 'The Art of Mindfulness',
        content: `In a world that never stops moving, finding stillness becomes an art form. Mindfulness isn't about escaping reality—it's about experiencing it fully.

When we practice mindfulness, we learn to observe our thoughts without judgment, to feel our emotions without being consumed by them, and to live in the present moment without constantly reaching for the next.

Try this simple exercise: Close your eyes and take three deep breaths. Notice the sensation of air filling your lungs and then leaving your body. Feel the weight of your body against the chair or floor. Listen to the sounds around you without labeling them as good or bad.

This is mindfulness—this is presence.`,
        isPublic: true,
        createdAt: new Date('2023-11-15T08:30:00Z'),
        updatedAt: new Date('2023-11-15T08:30:00Z')
      },
      {
        _id: new ObjectId(),
        title: 'Autumn Reflections',
        content: `The leaves are falling like memories,
Each one a moment that once was green with life.
Now painted in amber and rust,
They dance their way to the ground.

I watch them from my window,
Thinking of all the seasons that have passed,
How we too change our colors,
How we too eventually let go.

There is beauty in this surrender,
In the way nature teaches us
That release is not an ending,
But a necessary part of renewal.`,
        isPublic: true,
        createdAt: new Date('2023-10-21T14:45:00Z'),
        updatedAt: new Date('2023-10-21T14:45:00Z')
      },
      {
        _id: new ObjectId(),
        title: 'Notes on Writing',
        content: `Writing is not about waiting for inspiration. It's about sitting down every day and doing the work, even when the words don't want to come.

I've found that my best writing happens when I:
1. Create a consistent routine
2. Eliminate distractions
3. Set small, achievable goals
4. Read widely and curiously
5. Allow myself to write poorly in first drafts

As Hemingway said, "The first draft of anything is garbage." The magic happens in revision, in the careful sculpting of those rough initial thoughts into something that resonates.

Remember: writer's block is not a creative drought—it's often perfectionism in disguise.`,
        isPublic: true,
        createdAt: new Date('2023-09-05T19:20:00Z'),
        updatedAt: new Date('2023-09-05T19:20:00Z')
      },
      {
        _id: new ObjectId(),
        title: 'Private Thoughts on Future Projects',
        content: `Ideas for upcoming writing projects:

- Essay series on digital minimalism
- Short story collection based on dreams
- Poetry chapbook focused on urban nature
- Collaborative writing experiment with other writers

Need to research more about publishing options and potential audiences. Maybe reach out to some literary magazines first to build credibility.

Note to self: Set aside 2 hours every Saturday morning to work specifically on these projects.`,
        isPublic: false,
        createdAt: new Date('2023-11-01T10:15:00Z'),
        updatedAt: new Date('2023-11-01T10:15:00Z')
      },
      {
        _id: new ObjectId(),
        title: 'Favorite Quote Collection',
        content: `"The universe is made of stories, not of atoms." — Muriel Rukeyser

"We tell ourselves stories in order to live." — Joan Didion

"A word after a word after a word is power." — Margaret Atwood

"I can shake off everything as I write; my sorrows disappear, my courage is reborn." — Anne Frank

"You can make anything by writing." — C.S. Lewis

"Write hard and clear about what hurts." — Ernest Hemingway

"Stories are a way of subtracting the future from the past, the only way of finding clarity in hindsight." — Anthony Doerr`,
        isPublic: true,
        createdAt: new Date('2023-08-17T16:30:00Z'),
        updatedAt: new Date('2023-08-17T16:30:00Z')
      }
    ];
    
    await Post.insertMany(posts);
    console.log('Sample posts created successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedPosts();
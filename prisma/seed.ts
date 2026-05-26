import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed manipulation patterns from the prototype
  const patterns = [
    {
      name: 'Rapid Cuts',
      description:
        'When a video switches between shots super fast so your brain can\'t look away — it makes everything feel exciting even when nothing is really happening.',
      howToSpot:
        'Count how many times the image changes in 5 seconds. More than 4? That\'s rapid cuts!',
      icon: 'fa-bolt',
      psychologyExplanation:
        'Rapid visual changes trigger your orienting response — an automatic brain reaction to new stimuli. Each cut forces your attention to reset, making it nearly impossible to look away.',
      examples: [
        'Music videos with constant angle changes',
        'Toy unboxing videos with fast zooms',
        'Gaming highlight reels',
      ],
    },
    {
      name: 'Exaggerated Expressions',
      description:
        'When people in videos make HUGE faces — shocked, scared, or amazed — to make you feel those emotions too, even before you know what happened.',
      howToSpot: 'Ask yourself: "Would a real person actually react this way?"',
      icon: 'fa-theater-masks',
      psychologyExplanation:
        'Mirror neurons in your brain automatically mimic emotions you see on screen. Exaggerated expressions hijack this system to make you feel intense emotions that keep you engaged.',
      examples: [
        'Thumbnails with wide-open mouths',
        'Reaction videos with over-the-top responses',
        'Prank videos with fake surprise',
      ],
    },
    {
      name: 'Countdown Timers',
      description:
        'Numbers ticking down that make you feel like you MUST act now or you\'ll miss out. They want you to click, buy, or decide before you can think about it.',
      howToSpot:
        'If a timer makes your heart race, pause and ask: "What happens if I just wait?"',
      icon: 'fa-hourglass-half',
      psychologyExplanation:
        'Countdown timers exploit loss aversion — your brain fears missing out more than it values gaining something. The ticking creates artificial urgency that bypasses rational thinking.',
      examples: [
        'Limited-time offers in videos',
        'Live stream countdowns to reveals',
        'Challenge videos with time pressure',
      ],
    },
    {
      name: 'Cliffhangers',
      description:
        'Stopping a story right at the exciting part so you HAVE to watch the next video. It\'s designed to make you feel like you can\'t stop watching.',
      howToSpot:
        'Notice when a video ends mid-action. That unfinished feeling is the trick!',
      icon: 'fa-mountain',
      psychologyExplanation:
        'The Zeigarnik effect means your brain remembers incomplete tasks better than completed ones. Cliffhangers exploit this by creating an open loop your mind desperately wants to close.',
      examples: [
        'Series that end on dramatic moments',
        'Videos split into unnecessary parts',
        'Teasers that never deliver in the same video',
      ],
    },
    {
      name: 'Before/After Comparisons',
      description:
        'Showing something "bad" then something "amazing" side by side to make you want the product or result. The change often looks way bigger than it really is.',
      howToSpot:
        'Look at the lighting and angles — are they the same in both shots?',
      icon: 'fa-exchange-alt',
      psychologyExplanation:
        'Contrast bias makes differences appear larger when shown side by side. Creators manipulate lighting, angles, and timing to exaggerate transformations beyond reality.',
      examples: [
        'Beauty transformation videos',
        'Room makeover content',
        'Fitness before/after with different lighting',
      ],
    },
    {
      name: 'Repetitive Music',
      description:
        'A catchy tune that plays over and over, getting stuck in your head. It keeps you watching because your brain starts to expect and want the next loop.',
      howToSpot:
        'Mute the video for 10 seconds. Does it suddenly feel less exciting?',
      icon: 'fa-music',
      psychologyExplanation:
        'Repetitive music creates a dopamine anticipation loop — your brain predicts the next beat and rewards itself for being right. This creates a trance-like state that extends watch time.',
      examples: [
        'TikTok sounds that loop endlessly',
        'Background music in compilation videos',
        'Jingles in toy advertisement content',
      ],
    },
    {
      name: 'Delayed Payoffs',
      description:
        'Messages like "Wait for it..." or "You won\'t BELIEVE what happens next!" that keep you watching for a long time before anything interesting actually happens.',
      howToSpot:
        'Next time you see "Wait for it," try skipping to the end. Was it worth 5 minutes of waiting? Usually not!',
      icon: 'fa-hourglass',
      psychologyExplanation:
        'Your brain has something called "curiosity drive" — when someone promises something amazing is coming, your brain releases a tiny bit of dopamine. But the trick is: you get that feeling from WAITING, not from the actual payoff.',
      examples: [
        'Compilation videos that promise "the best part" at the end',
        'Thumbnails showing a crazy moment you never actually see',
        'Videos that keep saying "stay tuned" or "coming up next"',
        'Live streams that delay announcements to keep you watching',
      ],
    },
  ];

  for (const pattern of patterns) {
    await prisma.pattern.upsert({
      where: { name: pattern.name },
      update: pattern,
      create: pattern,
    });
  }

  // Create demo parent account
  const parentHash = await bcrypt.hash('parent123', 10);
  const parent = await prisma.user.upsert({
    where: { email: 'parent@clearfeed.dev' },
    update: {},
    create: {
      email: 'parent@clearfeed.dev',
      name: 'Alex Chen',
      passwordHash: parentHash,
      role: 'PARENT',
    },
  });

  // Create demo child account
  const childHash = await bcrypt.hash('child123', 10);
  const child = await prisma.user.upsert({
    where: { email: 'maya@clearfeed.dev' },
    update: {},
    create: {
      email: 'maya@clearfeed.dev',
      name: 'Maya Chen',
      passwordHash: childHash,
      role: 'CHILD',
      parentId: parent.id,
    },
  });

  // Create child profile
  await prisma.childProfile.upsert({
    where: { userId: child.id },
    update: {},
    create: {
      userId: child.id,
      age: 10,
      contentThreshold: 5,
    },
  });

  console.log('Seed complete: patterns, parent, and child accounts created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

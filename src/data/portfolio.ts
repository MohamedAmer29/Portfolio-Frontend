export const portfolio = {
  name: 'Mohamed Amer',
  fullName: 'Mohamed Amer.',
  logoLetter: 'M',
  email: 'm1o1h1a1a1@gmail.com',
  resumeUrl: '/resume.pdf',
  social: {
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
  },
  hero: {
    greeting: 'Hey! my name is',
    tagline: 'I build things for the web.',
    bio: "I'm a Full Stack Engineer with a strong foundation in front-end & back-end development. I focus on building accessible, performant products and digital experiences that people enjoy using.",
  },
  about: {
    paragraphs: [
      "Hello! I'm Mohamed Amer, a full stack engineer who enjoys turning ideas into polished, reliable web products. My interest in development started with curiosity about how things work on the web — and it grew into a passion for building them.",
      "Today I work across the stack: crafting clean interfaces, designing APIs, and shipping features that feel fast and intentional. I care about accessibility, maintainability, and details that make an experience feel finished.",
      "Here are a few technologies I've been working with recently:",
    ],
    tech: [
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'MongoDB',
      'Prisma',
      'Tailwind CSS',
    ],
  },
  experience: [
    {
      company: 'COMPANY A',
      title: 'Full Stack Engineer',
      range: 'Jan 2025 - Current',
      url: '#',
      bullets: [
        'Build and ship full-stack features across React and Node.js services used by production users.',
        'Collaborate with design and product to deliver accessible, responsive interfaces with strong performance.',
        'Improve developer experience through shared components, typed APIs, and clearer project structure.',
      ],
    },
    {
      company: 'COMPANY B',
      title: 'Frontend Developer',
      range: 'Jun 2023 - Dec 2024',
      url: '#',
      bullets: [
        'Developed responsive web applications with React, TypeScript, and modern CSS architecture.',
        'Partnered with backend teams to integrate REST APIs and improve end-to-end user flows.',
        'Reduced UI bugs and increased consistency by introducing reusable design patterns.',
      ],
    },
    {
      company: 'COMPANY C',
      title: 'Web Developer',
      range: 'Jan 2022 - May 2023',
      url: '#',
      bullets: [
        'Built marketing sites and internal tools with a focus on clean layout and maintainable code.',
        'Worked closely with stakeholders to translate requirements into shipped interfaces.',
        'Improved page load and interaction quality through performance and accessibility passes.',
      ],
    },
  ],
  projects: [
    {
      title: 'Project Alpha',
      description:
        'A full-stack web application for discovering and managing content. Built with a modern React frontend, typed API layer, and a focus on fast search and clean UX.',
      tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      github: 'https://github.com/',
      external: '#',
      image: 'alpha',
    },
    {
      title: 'Project Beta',
      description:
        'A dashboard experience for tracking activity and insights in real time. Features responsive charts, role-aware views, and a calm visual system for dense data.',
      tech: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind'],
      github: 'https://github.com/',
      external: '#',
      image: 'beta',
    },
    {
      title: 'Project Gamma',
      description:
        'An e-commerce style storefront with cart flows, product filtering, and a lightweight admin surface. Designed for clarity, speed, and mobile-first shopping.',
      tech: ['React', 'Zustand', 'Express', 'MongoDB'],
      github: 'https://github.com/',
      external: '#',
      image: 'gamma',
    },
    {
      title: 'Project Delta',
      description:
        'A portfolio CMS and content workspace that makes updating projects and case studies simple. Includes markdown authoring and media management.',
      tech: ['Next.js', 'TypeScript', 'Sanity', 'Vercel'],
      github: 'https://github.com/',
      external: '#',
      image: 'delta',
    },
  ],
  contact: {
    eyebrow: "What's Next?",
    title: 'Get In Touch',
    blurb:
      "I'm currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi. I'll try my best to get back to you!",
  },
} as const

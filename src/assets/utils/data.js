import cssIcon from '/images/css.svg'
import htmlIcon from '/images/html.svg'
import JavascriptIcon from '/images/javascript.svg'
import laravelIcon from '/images/laravel.svg'
import firebaseIcon from '/images/firebase.svg'
import gitIcon from '/images/git.svg'
import githubIcon from '/images/github.svg'
import phpIcon from '/images/php.svg'
import reactIcon from '/images/react.svg'
import nodeIcon from '/images/nodejs.svg'
import nextIcon from '/images/next-js.svg'
import mySqlIcon from '/images/mysql.svg'
import postgresqlIcon from '/images/postgresql.svg'
import mariadbIcon from '/images/mariadb.svg'
import viteIcon from '/images/vitejs.svg'
import dockerIcon from '/images/docker.svg'
import typescriptIcon from '/images/typescript.svg'
import figmaIcon from '/images/figma.svg'
import tailwindcss from '/images/tailwindcss.svg'
import sass from '/images/sass.svg'
import sequelizeIcon from '/images/Sequelize.svg'
import prismaIcon from '/images/prisma.svg'
import nestIcon from '/images/nestJs.svg'
import muiIcon from '/images/mui.svg'

// images apps

import appOpenAI from '/images/app-OpenAI.png'
import appRealTimeChat from '/images/app-realtime-chat.png'
import appTravel from '/images/app-travel.png'
import appDashboard from '/images/dashboard.png'
import gascertcol from '/images/gascertcol.png'
import consteladora from '/images/consteladora.png'


export const WORK_EXPERIENCE = [

    {

        title : 'Fullstack developer - Software factory - CDITI Dosquebradas',
        date : '3 - JULY 2022 | 20 - SEPTEMBER 2023',
        responsabilities : [
            'I developed a comprehensive system with Laravel to centralize and efficiently manage information from multiple databases of a non-profit foundation.',
            'I implemented collaboration and version control with Git and GitLab for efficient code management.',
            'I optimized the performance of the database with MySQL to ensure reliable storage and retrieval of data.',
            'I designed a secure and scalable architecture with Laravel to enhance the organization, accessibility, and security of data, facilitating decision-making and goal achievement in social work.'
        ]

    },
    {

        title : 'Fullstack Developer - Suzuki Motor of Colombia',
        date : '25 - SEPTEMBER 2023 | 1 - MAY 2025',
        responsabilities : [
            'Active participation in full stack development at Suzuki, using React and Node to design and implement web solutions and systems from scratch.',
            'Comprehensive contribution from design to implementation, ensuring coherence and efficiency throughout the development process.',
            'Effective collaboration using Git and GitLab to manage versions and facilitate teamwork.',
            "Significant professional growth and contribution to the company's success, thanks to acquired experience and solutions implemented with React, Node, Git, GitLab, and PostgreSQL."
        ]

    },

]

export const SERVICES = [

    {
        title : 'Web development',
        description : 
        "I'm a web developer specialized in crafting engaging and functional online experiences. Using technologies like React.js, Node.js, and Laravel, I build high-performance web systems that are user-friendly and efficient.",
        icon : 'fa-solid fa-code'
    },
    {
        title : 'UI/UX Designing',
        description : 'As a UX/UI designer, I specialize in crafting intuitive and visually appealing digital experiences. My focus is on enhancing user satisfaction through thoughtful design that seamlessly integrates functionality with aesthetics.',
        icon : 'fa-solid fa-palette'

    },
    {
        title: "Software Development",
        description: "I specialize in developing complex software solutions using various technologies like React.js, Node.js, Laravel, and more. My focus is on creating robust and scalable applications that drive innovation",
        icon: "fa-solid fa-cogs"
    }
    
]

export const TECHNOLOGIES = [

        {
            name: 'Html5',
            experience : 'Advanced',
            icon : htmlIcon,
            color : '#ef652a'
        },

        {
            name: 'Css',
            experience : 'Intermedate',
            icon : cssIcon,
            color : '#1b73ba'

        },

        {
            name: 'Sass',
            experience : 'Intermedate',
            icon : sass,
            color : '#cf649a'
            
        },
        {
            name: 'Material UI',
            experience : 'Intermedate',
            icon : muiIcon,
            color : '#00b0ff'
            
        },
        {
            name: 'Tailwindcss',
            experience : 'Basic',
            icon : tailwindcss,
            color : '#1ab0ba'
        },

        {
            name: 'Javascript',
            experience : 'Intermedate',
            icon : JavascriptIcon,
            color : '#e9ca32'
        },

        {
            name: 'Typescript',
            experience : 'Basic',
            icon : typescriptIcon,
            color : '#007acc'
        },

        {
            name: 'Php',
            experience : 'Intermedate',
            icon : phpIcon,
            color : '#8993be'
        },

        {
            name: 'ReactJs',
            experience : 'Intemedate',
            icon : reactIcon,
            color : '#61dafb'
        },
        {
            name: 'NextJs',
            experience : 'Basic',
            icon : nextIcon,
            color : '#000000'
        },
        {
            name: 'Laravel',
            experience : 'Intermedate',
            icon : laravelIcon,
            color : '#7e474a'
        },
        {
            name: 'NodeJs',
            experience : 'Intermedate',
            icon : nodeIcon,
            color : '#8cc84b'
        },
        {
            name: 'NestJs',
            experience : 'Basic',
            icon : nestIcon,
            color : '#ea2853'
        },
        {
            name: 'Postgresql',
            experience : 'Intermedate',
            icon : postgresqlIcon,
            color : '#336791'
        },
        {
            name: 'Mysql',
            experience : 'Intermedate',
            icon : mySqlIcon,
            color : '#f3e2ca'
        },
        {
            name: 'MariaDB',
            experience : 'Intermedate',
            icon : mariadbIcon,
            color : '#40608b'
        },
        {
            name: 'Sequelize',
            experience : 'Intermedate',
            icon : sequelizeIcon,
            color : '#51aee4'
        },
        {
            name: 'Prisma',
            experience : 'Basic',
            icon : prismaIcon,
            color : '#000'
        },

        {
            name: 'Firebase',
            experience : 'Basic',
            icon : firebaseIcon,
            color : '#fca512'
        },

        {
            name: 'Git',
            experience : 'Intermedate',
            icon : gitIcon,
            color : '#de4c36'
        },

        {
            name: 'GitHub',
            experience : 'Intermedate',
            icon : githubIcon,
            color : '#000000'
        },

        {
            name: 'ViteJs',
            experience : 'Basic',
            icon : viteIcon,
            color : '#916cff'
        },

        {
            name: 'Docker',
            experience : 'Basic',
            icon : dockerIcon,
            color : '#0091e2'
        },
]

export const PROJECTS = [
    {
        name : 'Landing Page - Consteladora Familiar',
        link : 'https://newlife01.com/',
        github: 'https://github.com/Sebasxx44',
        image : consteladora,
        description : 'Landing page for a Family Constellations company, offering guidance and healing through transformative workshops and personalized support.',
        technologies : [reactIcon,JavascriptIcon,cssIcon]
    },
    {
        name : 'Landing Page - Gascertcol',
        link : 'https://www.gascertcol.com/',
        github: 'https://github.com/Sebasxx44',
        image : gascertcol,
        description : 'Landing page for a Gas Network Inspection company, highlighting expert services, safety, and reliability with clear calls-to-action and client-focused content.',
        technologies : [reactIcon,JavascriptIcon,tailwindcss]
    },
    {
        name : 'Articles Generator GPT-4',
        link : 'https://articlesopenai.netlify.app/',
        github: 'https://github.com/Sebasxx44/OpenAI_Articles_Generator',
        image : appOpenAI,
        description : 'This application, developed with React, connects to the GPT-4 API to generate article summaries. Users can input the text or URL of an article, and the application uses GPT-4 to process and produce a concise and coherent summary.',
        technologies : [reactIcon,JavascriptIcon,tailwindcss]
    },
    {
        name : 'Dashboard',
        link : 'https://dashboard-sebaz.vercel.app/',
        github: 'https://github.com/Sebasxx44/DashboardReact',
        image : appDashboard,
        description : 'This application, developed with React and styled with Sass, is a sophisticated interactive dashboard. Designed to offer a smooth and attractive user experience, it allows real-time data visualization through dynamic and intuitive charts.',
        technologies : [reactIcon,typescriptIcon,sass]
    },
    {
        name : 'Real Time Chat App',
        link : 'https://talkzones.vercel.app/',
        github : 'https://github.com/Sebasxx44/chat-real-time',
        image : appRealTimeChat,
        description : 'Real-time chat application developed with React and Firebase. The application allows users to sign in with Google and participate in the chat where they can send and receive messages instantly. Thanks to Firebase Firestore, messages are updated in real-time.',
        technologies : [reactIcon,JavascriptIcon,firebaseIcon,cssIcon]
    },
    {
        name : 'Travel Landing Page',
        link : 'https://natunest.vercel.app/',
        github: 'https://github.com/Sebasxx44/landing_page_app_travel',
        image : appTravel,
        description : 'I have developed an attractive landing page for camping in Pereira using Next.js and TailwindCSS. This page highlights the stunning views and rich biodiversity of the region, offering fast navigation and a responsive design.',
        technologies : [nextIcon,typescriptIcon,tailwindcss]
    }

]



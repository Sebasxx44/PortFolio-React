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

// images apps

import appOpenAI from '/images/app-OpenAI.png'
import appRealTimeChat from '/images/app-realtime-chat.png'
import appTravel from '/images/app-travel.png'


export const WORK_EXPERIENCE = [

    {

        title : 'Fullstack developer - Software factory - CDITI Dosquebradas',
        date : '3 - JULY OF 2022 | 20 - SEPTEMBER OF 2023',
        responsabilities : [
            'I developed a comprehensive system with Laravel to centralize and efficiently manage information from multiple databases of a non-profit foundation.',
            'I implemented collaboration and version control with Git and GitLab for efficient code management.',
            'I optimized the performance of the database with MySQL to ensure reliable storage and retrieval of data.',
            'I designed a secure and scalable architecture with Laravel to enhance the organization, accessibility, and security of data, facilitating decision-making and goal achievement in social work.'
        ]

    },
    {

        title : 'Fullstack Developer - Suzuki Motor of Colombia',
        date : '25 - SEPTEMBER OF 2023 | 25 - MARCH OF 2024',
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
            name: 'React.Js',
            experience : 'Intemedate',
            icon : reactIcon,
            color : '#61dafb'
        },
        {
            name: 'Laravel',
            experience : 'Intermedate',
            icon : laravelIcon,
            color : '#7e474a'
        },
        {
            name: 'Node.Js',
            experience : 'Intermedate',
            icon : nodeIcon,
            color : '#8cc84b'
        },
        {
            name: 'Next.Js',
            experience : 'Basic',
            icon : nextIcon,
            color : '#000000'
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

        {
            name: 'Tailwindcss',
            experience : 'Basic',
            icon : tailwindcss,
            color : '#1ab0ba'
        },
]

export const PROJECTS = [
    {
        name : 'Real Time Chat App',
        link : 'https://talkzones.vercel.app/',
        github : 'https://github.com/Sebasxx44/chat-real-time',
        image : appRealTimeChat,
        description : 'Real-time chat application developed with React and Firebase. The application allows users to sign in with Google and participate in the chat where they can send and receive messages instantly. Thanks to Firebase Firestore, messages are updated in real-time.',
        technologies : [reactIcon,JavascriptIcon,firebaseIcon,cssIcon]
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
        name : 'Travel Landing Page',
        link : 'https://natunest.vercel.app/',
        github: 'https://github.com/Sebasxx44/landing_page_app_travel',
        image : appTravel,
        description : 'I have developed an attractive landing page for camping in Pereira using Next.js and TailwindCSS. This page highlights the stunning views and rich biodiversity of the region, offering fast navigation and a responsive design.',
        technologies : [nextIcon,typescriptIcon,tailwindcss]
    }

]



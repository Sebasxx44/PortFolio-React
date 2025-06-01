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
import azharslimpieza from '/images/azharslimpieza.png'


export const WORK_EXPERIENCE = [
    {
        title: 'workExp.0.title',
        date: 'workExp.0.date',
        responsabilities: [
            'workExp.0.resp.0',
            'workExp.0.resp.1',
            'workExp.0.resp.2',
            'workExp.0.resp.3',
        ],
    },
    {
        title: 'workExp.1.title',
        date: 'workExp.1.date',
        responsabilities: [
            'workExp.1.resp.0',
            'workExp.1.resp.1',
            'workExp.1.resp.2',
            'workExp.1.resp.3',
        ],
    },
];

export const SERVICES = [
  {
    title: 'services.0.title',
    description: 'services.0.description',
    icon: 'fa-solid fa-code',
  },
  {
    title: 'services.1.title',
    description: 'services.1.description',
    icon: 'fa-solid fa-palette',
  },
  {
    title: 'services.2.title',
    description: 'services.2.description',
    icon: 'fa-solid fa-cogs',
  },
];

export const TECHNOLOGIES = [
    {
        name: 'technologies.html5.name',
        experience: 'technologies.html5.experience',
        icon: htmlIcon,
        color: '#ef652a',
    },
    {
        name: 'technologies.css.name',
        experience: 'technologies.css.experience',
        icon: cssIcon,
        color: '#1b73ba',
    },
    {
        name: 'technologies.sass.name',
        experience: 'technologies.sass.experience',
        icon: sass,
        color: '#cf649a',
    },
    {
        name: 'technologies.materialUi.name',
        experience: 'technologies.materialUi.experience',
        icon: muiIcon,
        color: '#00b0ff',
    },
    {
        name: 'technologies.tailwindcss.name',
        experience: 'technologies.tailwindcss.experience',
        icon: tailwindcss,
        color: '#1ab0ba',
    },
    {
        name: 'technologies.javascript.name',
        experience: 'technologies.javascript.experience',
        icon: JavascriptIcon,
        color: '#e9ca32',
    },
    {
        name: 'technologies.typescript.name',
        experience: 'technologies.typescript.experience',
        icon: typescriptIcon,
        color: '#007acc',
    },
    {
        name: 'technologies.php.name',
        experience: 'technologies.php.experience',
        icon: phpIcon,
        color: '#8993be',
    },
    {
        name: 'technologies.reactjs.name',
        experience: 'technologies.reactjs.experience',
        icon: reactIcon,
        color: '#61dafb',
    },
    {
        name: 'technologies.nextjs.name',
        experience: 'technologies.nextjs.experience',
        icon: nextIcon,
        color: '#000000',
    },
    {
        name: 'technologies.laravel.name',
        experience: 'technologies.laravel.experience',
        icon: laravelIcon,
        color: '#7e474a',
    },
    {
        name: 'technologies.nodejs.name',
        experience: 'technologies.nodejs.experience',
        icon: nodeIcon,
        color: '#8cc84b',
    },
    {
        name: 'technologies.nestjs.name',
        experience: 'technologies.nestjs.experience',
        icon: nestIcon,
        color: '#ea2853',
    },
    {
        name: 'technologies.postgresql.name',
        experience: 'technologies.postgresql.experience',
        icon: postgresqlIcon,
        color: '#336791',
    },
    {
        name: 'technologies.mysql.name',
        experience: 'technologies.mysql.experience',
        icon: mySqlIcon,
        color: '#f3e2ca',
    },
    {
        name: 'technologies.mariadb.name',
        experience: 'technologies.mariadb.experience',
        icon: mariadbIcon,
        color: '#40608b',
    },
    {
        name: 'technologies.sequelize.name',
        experience: 'technologies.sequelize.experience',
        icon: sequelizeIcon,
        color: '#51aee4',
    },
    {
        name: 'technologies.prisma.name',
        experience: 'technologies.prisma.experience',
        icon: prismaIcon,
        color: '#000000',
    },
    {
        name: 'technologies.firebase.name',
        experience: 'technologies.firebase.experience',
        icon: firebaseIcon,
        color: '#fca512',
    },
    {
        name: 'technologies.git.name',
        experience: 'technologies.git.experience',
        icon: gitIcon,
        color: '#de4c36',
    },
    {
        name: 'technologies.github.name',
        experience: 'technologies.github.experience',
        icon: githubIcon,
        color: '#000000',
    },
    {
        name: 'technologies.vitejs.name',
        experience: 'technologies.vitejs.experience',
        icon: viteIcon,
        color: '#916cff',
    },
    {
        name: 'technologies.docker.name',
        experience: 'technologies.docker.experience',
        icon: dockerIcon,
        color: '#0091e2',
    },
];

export const PROJECTS = [
  {
    name: 'projects.azhars.name',
    description: 'projects.azhars.description',
    link: 'https://azharslimpieza.com.co/',
    github: 'https://github.com/Sebasxx44',
    image: azharslimpieza,
    technologies: [reactIcon, JavascriptIcon, cssIcon],
  },
  {
    name: 'projects.consteladora.name',
    description: 'projects.consteladora.description',
    link: 'https://newlife01.com/',
    github: 'https://github.com/Sebasxx44',
    image: consteladora,
    technologies: [reactIcon, JavascriptIcon, cssIcon],
  },
  {
    name: 'projects.gascertcol.name',
    description: 'projects.gascertcol.description',
    link: 'https://www.gascertcol.com/',
    github: 'https://github.com/Sebasxx44',
    image: gascertcol,
    technologies: [reactIcon, JavascriptIcon, tailwindcss],
  },
  {
    name: 'projects.articlesGPT.name',
    description: 'projects.articlesGPT.description',
    link: 'https://articlesopenai.netlify.app/',
    github: 'https://github.com/Sebasxx44/OpenAI_Articles_Generator',
    image: appOpenAI,
    technologies: [reactIcon, JavascriptIcon, tailwindcss],
  },
  {
    name: 'projects.dashboard.name',
    description: 'projects.dashboard.description',
    link: 'https://dashboard-sebaz.vercel.app/',
    github: 'https://github.com/Sebasxx44/DashboardReact',
    image: appDashboard,
    technologies: [reactIcon, typescriptIcon, sass],
  },
  {
    name: 'projects.realTimeChat.name',
    description: 'projects.realTimeChat.description',
    link: 'https://talkzones.vercel.app/',
    github: 'https://github.com/Sebasxx44/chat-real-time',
    image: appRealTimeChat,
    technologies: [reactIcon, JavascriptIcon, firebaseIcon, cssIcon],
  },
  {
    name: 'projects.travelLanding.name',
    description: 'projects.travelLanding.description',
    link: 'https://natunest.vercel.app/',
    github: 'https://github.com/Sebasxx44/landing_page_app_travel',
    image: appTravel,
    technologies: [nextIcon, typescriptIcon, tailwindcss],
  },
];




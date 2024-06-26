# subway-live
부산 도시철도 지하철 정보 서비스
* 실시간 도착정보
* 역별 시간표
* 열차별 시간표

## Tech Stack
* JS Library: **React**
* Bundling: **Vite**
* Routing: **React Router**
* Type Checking: **TypeScript**
* Linting: **ESLint + Prettier**
* CSS: **Tailwind CSS**
* Hosting: **Github Pages**
* Backend API: **Express** (Node.js) on Heroku

## Dependencies
* Landing Page Markdown Parsing: `react-markdown`, `react-gfm`
* Github Pages SPA Routing: `react-router-dom`, [`spa-github-pages`](https://github.com/rafgraph/spa-github-pages)
* Loading Spinner: `react-spinners`
* Icons: `react-icons`
* iOS Safari Optimization: `postcss-100vh-fx`
* Select Component: `react-tailwindcss-select` - **fork 후 커스텀 진행, `yalc`을 사용하여 local package로 설치**
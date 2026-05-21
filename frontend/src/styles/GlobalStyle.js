import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }    
  }
  :root {
    /* 색상 정의 */
    --blue : #0F60FF;
    --red : #EA5455;
    --green : #1EB564;
    --yellow : #FFC600;
    --purple : #BD00FF;
    --violet : #33189D;
    --rightblue : #0FB7FF;

    --background : #FAFAFA;

    --hover-bg : #fafcff;


    --border : #EAEAEA;
    --focus-border : #b7cdeb;

    --choice : #f3f6fb;

    --hover-gray : #F3F4F8;

    --read-only : #f3f4f6;

    --font : #000000;
    --font2 : #828282;

    --placeholder : #8B909A;

    /* 박스 그림자 */
    --shadow : 2px 2px 8px rgba(0, 0, 0, 0.03);


    /* 폰트 사이즈 정의 */
    --title : 22px;
    --th : 11px;
    --td :  12px;

  }
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer; 
    font-family: inherit;
  }
   input, textarea, select {
    outline: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
  }
  a {
    text-decoration: none;
    color: inherit;   
  }
  ul, li {
    list-style: none;  
  }
  img {
    max-width: 100%;
    display: block;  
  }
  svg:focus {
  outline: none; 
  }

  svg *:focus {
  outline: none; 
  }



 /* =========================
       Consumer UI Color
    ========================= */
    --bg-page: #efefef;
    --bg-section: #f5f1ea;
    --bg-card: #ffffff;
    --bg-soft: #f8f6f2;
    --bg-soft-2: #fcfbf8;

    --border: #eaeaea;
    --border-soft: #ebe5dc;
    --border-strong: #d9cfc1;
    --focus-border: #b7cdeb;

    --font: #111111;
    --font2: #6f685f;
    --font3: #8b847c;
    --placeholder: #9b948b;

    --choice: #f3f6fb;
    --hover-bg: #fafcff;
    --hover-gray: #f3f4f8;
    --read-only: #f3f4f6;

    --shadow: 0 10px 30px rgba(17, 17, 17, 0.05);

    /* radius */
    --radius-xl: 32px;
    --radius-lg: 24px;
    --radius-md: 18px;
    --radius-sm: 14px;
    --radius-pill: 999px;

    /* spacing */
    --page-side-padding: 24px;
    --page-top-padding: 48px;
    --page-bottom-padding: 200px;
    --section-gap-xl: 56px;
    --section-gap-lg: 48px;
    --section-gap-md: 32px;
    --section-gap-sm: 24px;
    --content-gap: 16px;

    /* layout */
    --container-width: 1180px;
    --container-wide-width: 1265px;
    --header-height: 72px;

    /* font scale */
    --fs-30: 30px;
    --fs-24: 24px;
    --fs-22: 22px;
    --fs-20: 20px;
    --fs-16: 16px;
    --fs-12: 12px;

    /* legacy vars 유지 */
    --background: #fafafa;
    --title: 22px;
    --th: 11px;
    --td: 12px;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    min-height: 100%;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family:
      "Pretendard",
      "Apple SD Gothic Neo",
      "Noto Sans KR",
      "Malgun Gothic",
      sans-serif;
    background: var(--bg-page);
    color: var(--font);
    line-height: 1.5;
  
`;

export default GlobalStyle;

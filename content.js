/*
  포트폴리오 내용 편집 파일
  ------------------------------------------------------------
  1. 따옴표 안의 문구만 원하는 내용으로 바꾸세요.
  2. 항목을 추가할 때는 같은 모양의 { ... } 블록을 복사하세요.
  3. 저장한 뒤 index.html 화면을 새로고침하면 반영됩니다.
  4. 이미지 경로는 assets/파일이름.확장자 형식으로 적으세요.
*/

window.PORTFOLIO_DATA = {
  site: {
    brand: "STEADY / PLANNER",
    title: "거북이 기획자 김재원",
    description: "게임 기획자의 이력서, 프로젝트 경험, 포트폴리오와 취미를 담은 개인 웹사이트",
    heroImage: "assets/portal-hero.png",
    copyright: "© 2026 GAME PLANNER PORTFOLIO"
  },

  hero: {
    eyebrow: "GAME PLANNER · PORTFOLIO",
    firstLine: "꾸준히 나아가는",
    highlight: "거북이",
    lastWord: "기획자",
    description: "느릴지언정 멈추진 않습니다. 끝까지 나아가는 게임 기획자의 기록입니다."
  },

  story: {
    eyebrow: "왠 거북이?",
    titleLines: ["한 걸음씩,", "결국 더 멀리."],
    paragraphs: [
      "저는 게임 개발에 관한 꿈을 가지며 게임 업계에 들어오기 위해 노력했고 그 모습을 토끼와의 경주에서 꾸준함과 성실함으로 승리한 거북이에 빗대고 싶었다.",
      "또한 앞으로의 포부로써 이 꾸준함을 이용해 아킬레우스 조차 따라잡을 수 없는 거북이가 되고 싶다."
    ]
  },

  resume: {
    intro: "지금까지 쌓아 온 경험과 역량을 한눈에 보여주는 공간입니다.",
    status: "OPEN TO WORK",
    monogram: "NAME",
    name: "김재원",
    role: "게임 기획자",
    contacts: {
      email: "ky74123@email.com",
      phone: "010-5462-3378",
      location: "의정부시, 경기도",
      military: "군필 병장 만기전역 (2020.11 ~ 2022.05)"
    },
    groups: [
      {
        key: "career",
        label: "경력",
        eyebrow: "CAREER",
        items: [
          { title: "세븐일레븐 편의점", meta: "2019.01 ~ 2020.09", description: "담당 업무와 경험을 입력해 주세요." },
          { title: "현대백화점 차량통제", meta: "2022.05 ~ 2022.10", description: "담당 업무와 경험을 입력해 주세요." },
          { title: "세븐일레븐 편의점", meta: "2023.01 ~ 현재", description: "담당 업무와 경험을 입력해 주세요." },
          { title: "서정대학교 학과실", meta: "2024.06 ~ 2025.02", description: "담당 업무와 경험을 입력해 주세요." }
        ]
      },
      {
        key: "certificate",
        label: "자격증",
        eyebrow: "CERTIFICATES",
        items: [
          { title: "자격증 이름", meta: "발급 기관 · 취득일", description: "자격증과 관련된 역량을 입력해 주세요." }
        ]
      },
      {
        key: "skill",
        label: "기술",
        eyebrow: "SKILLS",
        items: [
          { title: "기획 역량과 도구", meta: "숙련도 또는 사용 기간", description: "시스템 기획 · 콘텐츠 기획 · 데이터 분석 · 사용 도구를 입력해 주세요." }
        ]
      }
    ]
  },

  projects: {
    intro: "어떤 프로젝트였는지, 무엇을 맡았는지, 문제를 어떻게 풀었는지를 순서대로 보여줍니다.",
    items: [
      {
        badge: "SYSTEM",
        tone: "info",
        title: "프로젝트 이름",
        role: "담당 역할 · 참여 기간",
        description: "프로젝트의 목표와 내가 해결해야 했던 문제를 설명하는 영역입니다.",
        keyExperience: "핵심 경험 또는 성과를 한 문장으로 입력해 주세요."
      },
      {
        badge: "CONTENT",
        tone: "violet",
        title: "프로젝트 이름",
        role: "담당 역할 · 참여 기간",
        description: "맡았던 업무, 팀과 협업한 방식, 실제 결과를 상세하게 기록할 수 있습니다.",
        keyExperience: "수치나 플레이어 반응 등 구체적인 결과를 입력해 주세요."
      },
      {
        badge: "LIVE OPS",
        tone: "pink",
        title: "프로젝트 이름",
        role: "담당 역할 · 참여 기간",
        description: "과정에서 마주한 어려움과 배운 점을 중심으로 경험을 보여주는 영역입니다.",
        keyExperience: "다음 프로젝트에 적용한 배움을 입력해 주세요."
      }
    ]
  },

  portfolio: {
    intro: "완성한 기획서와 분석 자료를 시각적으로 소개합니다.",
    items: [
      {
        type: "시스템 기획서",
        tone: "violet",
        title: "포트폴리오 제목",
        description: "기획 의도와 핵심 설계를 짧게 소개해 주세요.",
        image: "",
        link: ""
      },
      {
        type: "콘텐츠 분석",
        tone: "violet",
        title: "포트폴리오 제목",
        description: "분석 대상과 인사이트를 짧게 소개해 주세요.",
        image: "",
        link: ""
      },
      {
        type: "레벨 디자인",
        tone: "violet",
        title: "포트폴리오 제목",
        description: "플레이 흐름과 설계 목표를 짧게 소개해 주세요.",
        image: "",
        link: ""
      },
      {
        type: "역기획서",
        tone: "violet",
        title: "포트폴리오 제목",
        description: "발견한 구조와 개선 아이디어를 짧게 소개해 주세요.",
        image: "",
        link: ""
      }
    ]
  },

  hobbies: {
    intro: "게임을 즐기는 방식과 일상에서 에너지를 회복하는 방법을 통해, 기획자 이전의 나를 보여줍니다.",
    items: [
      {
        label: "FAVORITE GAMES",
        title: "좋아하는 게임",
        description: "즐겨 온 게임의 장르와 작품, 오래 플레이하게 만든 재미를 기록해 주세요."
      },
      {
        label: "PLAY EXPERIENCE",
        title: "플레이 경험",
        description: "인상 깊었던 시스템과 콘텐츠, 플레이어로서 발견한 관점을 소개해 주세요."
      },
      {
        label: "RESET ROUTINE",
        title: "나만의 회복법",
        description: "스트레스를 해소하고 다시 집중력을 채우는 취미와 루틴을 입력해 주세요."
      }
    ],
    tags: ["RPG", "STRATEGY", "ADVENTURE", "INDIE"]
  },

  footer: {
    eyebrow: "NEXT QUEST",
    titleLines: ["다음 한 걸음도", "꾸준하게."]
  }
};

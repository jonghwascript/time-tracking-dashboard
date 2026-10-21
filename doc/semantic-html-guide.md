# 시맨틱 HTML 요소 가이드

`src/pages/index.html`을 작성할 때 요소를 고르는 기준입니다. 목표는 **CSS 없이 읽어도 내용과 구조가 전달되는 HTML**입니다. 브라우저와 스크린 리더는 요소 이름에서 역할(role)을 읽어 랜드마크 이동, 제목 목록, 목록 항목 수 안내 등에 사용합니다.

함께 읽을 문서:

- [figma-guide.md](figma-guide.md) §4: 이 저장소의 HTML 작성 규칙(클래스 접두사, 이미지 크기, placeholder 링크)
- [a11y-checklist.md](a11y-checklist.md): 접근성 점검 항목
- [scss-guide.md](scss-guide.md), [layout-guide.md](layout-guide.md): 클래스 이름과 `l-` 배치 클래스

이 문서는 요소의 의미만 다룹니다. 생김새는 클래스와 SCSS로 정하며, **보이는 모양 때문에 요소를 고르지 않습니다**. 예를 들어 크고 굵은 글자라고 해서 `<h2>`를 쓰지 않고, 제목이 아닌 텍스트를 작게 보이려고 `<h6>`을 쓰지 않습니다.

---

## 1. 요소 고르기 순서

1. 이 내용에 맞는 **HTML 요소가 있는가?** 있으면 그 요소를 씁니다(`<button>`, `<nav>`, `<ul>` 등).
2. 없으면 **묶음이 의미를 갖는가?** 제목이 있는 주제 묶음이면 `<section>`, 단독으로 떼어 써도 되는 콘텐츠면 `<article>`입니다.
3. 둘 다 아니면 배치용 `<div>`(블록) 또는 `<span>`(인라인)을 씁니다. `div`는 잘못된 요소가 아니라 **의미가 없는 요소**입니다. 스타일을 위한 묶음에는 `div`가 맞습니다.
4. ARIA `role`은 마지막 수단입니다. 같은 역할의 HTML 요소가 있으면 `role`을 붙이지 않습니다(`<div role="button">` 대신 `<button>`).

## 2. 문서 뼈대

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Frontend Mentor | Product preview card component</title>
    <link rel="stylesheet" href="./css/style.css" />
  </head>
  <body>
    <a class="c-skip-link" href="#main">Skip to main content</a>

    <header>
      <a href="/"><img src="./images/logo.svg" alt="Company name" width="120" height="32" /></a>
      <nav aria-label="Main">…</nav>
    </header>

    <main id="main">
      <h1>…</h1>
      …
    </main>

    <footer class="attribution">…</footer>
  </body>
</html>
```

- `lang`은 실제 콘텐츠의 언어입니다. 챌린지 문구가 영어라면 `en`을 유지합니다. 일부 문장만 다른 언어면 그 요소에 `lang`을 붙입니다.
- `<title>`은 비워 두지 않습니다. 현재 템플릿의 `<title> </title>`은 구현할 때 채웁니다.
- 건너뛰기 링크를 쓰면 [_skip-link.scss](../src/scss/components/_skip-link.scss)의 `.c-skip-link`를 사용하고, `href`의 대상 ID가 실제 `<main>`에 있는지 확인합니다. 헤더 내비게이션이 없는 단일 카드 페이지에서는 생략할 수 있습니다.

## 3. 랜드마크

랜드마크는 스크린 리더 사용자가 영역 단위로 건너뛸 때 쓰는 목차입니다.

| 요소 | 역할 | 사용 기준 |
| --- | --- | --- |
| `<header>` | `banner` | 사이트 공통 머리글(로고, 주 메뉴). `body` 바로 아래에 있을 때만 `banner`가 됨 |
| `<nav>` | `navigation` | 주요 이동 링크 묶음. 링크가 몇 개 있다고 모두 `nav`로 감싸지 않음 |
| `<main>` | `main` | 페이지의 핵심 콘텐츠. 문서에 하나만 보이게 둠 |
| `<aside>` | `complementary` | 본문과 관련 있지만 떼어내도 되는 보조 내용(관련 글, 광고) |
| `<footer>` | `contentinfo` | 사이트 공통 바닥글(저작권, attribution). `body` 바로 아래에 있을 때만 `contentinfo`가 됨 |
| `<section>` | `region` | **접근 가능한 이름이 있을 때만** 랜드마크가 됨(`aria-labelledby` 등) |
| `<form>` | `form` | 이름이 있을 때만 랜드마크가 됨 |
| `<search>` | `search` | 검색 폼을 감쌈. 오래된 브라우저를 지원해야 하면 `<form role="search">` |

- `<article>`, `<section>`, `<aside>`, `<nav>`, `<main>` 안의 `<header>`·`<footer>`는 그 영역의 머리글·바닥글일 뿐 `banner`·`contentinfo`가 아닙니다. 카드 안에 `<header>`를 써도 됩니다.
- 같은 종류의 랜드마크가 여러 개면 이름으로 구분합니다.

  ```html
  <nav aria-label="Main">…</nav>
  <nav aria-label="Footer">…</nav>
  ```

  이름에 "navigation"을 넣지 않습니다. 스크린 리더가 역할을 함께 읽으므로 "Main navigation navigation"처럼 중복됩니다.
- 모든 콘텐츠가 어떤 랜드마크 안에 있도록 합니다. 템플릿의 attribution은 `body` 바로 아래 `<footer>`이므로 `contentinfo` 안에 있습니다.

## 4. 제목

- 제목(`h1`~`h6`)은 문서의 개요입니다. 스크린 리더 사용자는 제목 목록으로 페이지를 훑습니다.
- `<h1>`은 페이지당 하나, 페이지의 주제를 담습니다.
- 단계를 건너뛰지 않습니다(`h2` 다음에 `h4` 금지). 크기가 맞지 않으면 클래스로 조정합니다.
- 제목이 아닌 텍스트(가격, 큰 숫자, 눈썹 문구)를 제목 요소로 만들지 않습니다.

Frontend Mentor의 단일 컴포넌트 챌린지는 화면에 제목이 카드 제목 하나뿐인 경우가 많습니다.

| 상황 | 처리 |
| --- | --- |
| 카드가 페이지 전체이고 카드 제목이 페이지 주제와 같다 | 카드 제목을 `<h1>`으로 |
| 카드가 여러 개이거나 페이지 주제가 따로 있다 | 숨긴 `<h1 class="u-sr-only">`을 두고 카드 제목은 `<h2>` |

`.u-sr-only`는 [_utilities.scss](../src/scss/utilities/_utilities.scss)에 있으며, 화면에서만 숨기고 스크린 리더에는 읽힙니다. 숨긴 `<h1>`을 추가하면 Figma에 없는 텍스트이므로 보고서에 적습니다.

제목과 함께 붙는 부제나 눈썹 문구는 `<hgroup>`으로 묶을 수 있습니다. `<hgroup>`에는 제목 하나와 `<p>`만 넣습니다.

```html
<hgroup>
  <p class="c-card__eyebrow">Perfume</p>
  <h1 class="c-card__title">Gabrielle Essence Eau De Parfum</h1>
</hgroup>
```

## 5. 묶음: section, article, div

| 요소 | 언제 | 판단 질문 |
| --- | --- | --- |
| `<article>` | 그 자체로 완결되어 다른 곳에 옮겨도 의미가 통하는 콘텐츠 | 이 카드만 따로 공유·재사용해도 말이 되는가? (글, 후기, 상품 카드, 댓글) |
| `<section>` | 한 주제를 다루는 묶음, 보통 제목이 있음 | 이 묶음에 제목을 붙일 수 있는가? (기능 소개, 요금제 영역) |
| `<div>` | 배치·스타일을 위한 묶음 | 위 둘에 해당하지 않는가? |

- 제목이 없는 `<section>`은 대개 `<div>`가 맞습니다.
- Auto Layout 프레임마다 `section`을 만들지 않습니다([figma-guide.md](figma-guide.md) §5).
- `<article>` 안에 `<section>`, `<section>` 안에 `<article>` 모두 가능합니다. 예: 후기 영역 `<section>` 안에 후기 카드 `<article>` 여러 개.

## 6. 텍스트 수준 요소

| 요소 | 의미 | 쓰지 않을 때 |
| --- | --- | --- |
| `<p>` | 문단 | 한 줄짜리 라벨이라도 문장·문단이면 `p` |
| `<strong>` | 중요함 | 굵게 보이기만 하면 됨 → CSS `font-weight` |
| `<em>` | 말의 강세 | 기울이기만 하면 됨 → CSS `font-style` |
| `<b>`, `<i>` | 강조 없이 구분만(제품명, 외국어, 기술 용어) | 중요도를 전하려면 `strong`·`em` |
| `<small>` | 부가 설명, 법적 고지, 저작권 | 글자를 작게만 하려면 CSS |
| `<s>` | 더 이상 유효하지 않은 내용(할인 전 가격) | 편집 이력이면 `del` |
| `<time datetime="">` | 날짜·시간 | `datetime`에 기계가 읽는 값(`2026-10-13`, `PT3H`) |
| `<abbr title="">` | 약어 | 처음 나올 때 풀이를 본문에 쓰는 편이 더 확실함 |
| `<address>` | 가장 가까운 `article` 또는 페이지 작성자의 연락처 | 일반 우편 주소 나열 |
| `<blockquote>`, `<q>`, `<cite>` | 인용문(블록·인라인), 작품 제목 | 후기 카드의 본문 인용에 `blockquote` 가능 |
| `<br>` | 시·주소처럼 줄바꿈이 내용의 일부일 때 | 간격·배치를 위한 줄바꿈 → CSS |

할인 가격 예시. 취소선만으로는 스크린 리더가 의미를 알 수 없으므로 숨긴 텍스트를 붙입니다.

```html
<p class="c-card__price">
  <span class="u-sr-only">Sale price:</span> $149.99
  <s><span class="u-sr-only">Original price:</span> $169.99</s>
</p>
```

## 7. 목록

| 요소 | 언제 |
| --- | --- |
| `<ul>` | 순서가 의미 없는 항목들(메뉴 링크, 기능 목록, 태그) |
| `<ol>` | 순서가 의미 있는 항목들(단계, 순위) |
| `<dl>`, `<dt>`, `<dd>` | 이름–값 쌍(통계 수치, 사양표, FAQ) |

- 스크린 리더는 "목록, 항목 3개"처럼 개수를 알려 줍니다. 같은 종류의 항목이 반복되면 목록을 씁니다.
- `list-style: none`을 주면 Safari + VoiceOver가 목록 의미를 빼고 읽습니다. 개수 안내가 중요하면 `<ul role="list">`로 의미를 되살립니다.
- 통계 카드 예시:

  ```html
  <dl class="c-stats">
    <div class="c-stats__item">
      <dt class="c-stats__label">Followers</dt>
      <dd class="c-stats__value">10k</dd>
    </div>
  </dl>
  ```

  `<dl>` 안에서 `dt`·`dd` 쌍을 `<div>`로 감싸는 것은 허용됩니다. 화면 순서(값이 위, 이름이 아래)는 CSS로 바꾸고 DOM은 이름–값 순서를 유지합니다.

## 8. 링크와 버튼

가장 자주 틀리는 부분입니다.

| 동작 | 요소 |
| --- | --- |
| 다른 페이지·위치로 **이동** | `<a href="…">` |
| 현재 페이지에서 **실행**(메뉴 열기, 탭 전환, 수량 변경) | `<button type="button">` |
| 폼 **제출** | `<button type="submit">` (폼 안의 `button`은 기본값이 `submit`) |

- `href` 없는 `<a>`는 링크가 아닙니다. 키보드 포커스를 받지 못합니다. 목적지를 모르면 `href="#"`로 두고 보고합니다([figma-guide.md](figma-guide.md) §4).
- `<div onclick>`, `<span onclick>`을 쓰지 않습니다. 키보드 조작, 포커스, 역할을 직접 다시 만들어야 합니다.
- 인터랙티브 요소 안에 인터랙티브 요소를 넣지 않습니다(`<a>` 안의 `<button>`, `<button>` 안의 `<a>`).
- 접근 가능한 이름이 있어야 합니다. 아이콘만 있는 버튼은 숨긴 텍스트나 `aria-label`을 붙이고, 아이콘은 `alt=""` 또는 `aria-hidden="true"`로 중복 읽기를 막습니다.

  ```html
  <button class="c-nav__toggle" type="button" aria-expanded="false" aria-controls="primary-menu">
    <img src="./images/icon-hamburger.svg" alt="" width="24" height="24" />
    <span class="u-sr-only">Open menu</span>
  </button>
  <ul id="primary-menu" class="c-nav__list">…</ul>
  ```

- 카드 전체를 클릭하게 만들 때는 카드를 `<a>`로 감싸지 말고, 제목의 링크 하나를 두고 CSS로 클릭 영역을 카드 전체로 넓힙니다. 카드 전체를 링크로 감싸면 스크린 리더가 카드 안 모든 텍스트를 링크 이름으로 읽습니다.
- "Learn more"처럼 여러 번 나오는 링크 텍스트는 목적지를 알 수 있게 숨긴 텍스트를 덧붙입니다: `Learn more<span class="u-sr-only"> about pricing</span>`.

## 9. 이미지와 미디어

- 정보 이미지는 내용을 설명하는 `alt`, 장식 이미지는 `alt=""`([figma-guide.md](figma-guide.md) §4). `alt` 속성 자체를 빼면 스크린 리더가 파일 이름을 읽을 수 있습니다.
- `alt`에 "image of", "picture of"를 넣지 않습니다. 이미지라는 사실은 역할로 이미 전달됩니다.
- 링크 안의 이미지가 유일한 내용이면 `alt`가 링크 이름이 됩니다. 로고 링크라면 회사 이름을 씁니다.
- 캡션이 있는 이미지·도표·코드 예시는 `<figure>`와 `<figcaption>`으로 묶습니다.
- 화면 크기별로 다른 이미지(모바일 세로형, 데스크톱 가로형)는 `<picture>`를 씁니다. `alt`는 안쪽 `<img>`에만 붙입니다.

  ```html
  <picture>
    <source media="(min-width: 37.5em)" srcset="./images/image-product-desktop.jpg" />
    <img src="./images/image-product-mobile.jpg" alt="Gabrielle perfume bottle" width="343" height="240" />
  </picture>
  ```

  미디어 쿼리 분기점은 SCSS의 분기점과 같은 값을 씁니다.
- CSS `background-image`는 장식 전용입니다. 정보 이미지를 배경으로 넣지 않습니다.
- 인라인 `<svg>`가 장식이면 `aria-hidden="true"`, 정보면 `role="img"`와 `<title>` 또는 `aria-label`을 붙입니다.

## 10. 폼

- 모든 입력에 `<label>`을 연결합니다(`for`–`id`). `placeholder`는 label을 대신하지 않습니다. 디자인에 라벨이 보이지 않으면 `.u-sr-only` label을 씁니다.
- 관련 입력 묶음(라디오 그룹, 주소)은 `<fieldset>`과 `<legend>`로 묶습니다.
- 입력 종류에 맞는 `type`(`email`, `tel`, `number`)과 `autocomplete`를 지정합니다.
- 오류 메시지는 입력과 `aria-describedby`로 연결하고, 오류 상태는 `aria-invalid="true"`로 표시합니다. 색만으로 오류를 알리지 않습니다.

```html
<form class="c-signup" novalidate>
  <label for="email">Email address</label>
  <input id="email" name="email" type="email" autocomplete="email"
         aria-describedby="email-error" />
  <p id="email-error" class="c-signup__error" hidden>Valid email required</p>
  <button type="submit">Subscribe</button>
</form>
```

`novalidate`는 브라우저 기본 검증 대신 직접 만든 검증을 보여줄 때만 씁니다. 그 경우 `src/js/main.js`에서 오류 표시와 `aria-invalid` 전환을 구현해야 합니다.

## 11. 표

- 행과 열로 비교하는 데이터(요금제 비교, 일정)에만 `<table>`을 씁니다. 배치용으로 쓰지 않습니다.
- `<caption>`, `<thead>`, `<th scope="col">`·`<th scope="row">`로 머리글을 표시합니다.
- 좁은 화면에서는 표를 감싼 요소에 가로 스크롤을 주는 방법이 표 구조를 지키기 쉽습니다.

## 12. 상호작용 요소

| 요소 | 용도 | 주의 |
| --- | --- | --- |
| `<details>`, `<summary>` | 펼치기·접기(FAQ 아코디언) | JavaScript 없이 키보드·상태 전달이 됨. 열림 표시 아이콘을 바꾸면 `summary`의 기본 화살표 처리 확인 |
| `<dialog>` | 모달·대화상자 | `showModal()`로 열면 포커스 가두기와 `Esc` 닫기가 기본 제공됨. 닫은 뒤 여는 버튼으로 포커스 복원 확인 |

이 요소들로 해결되면 `div`와 ARIA로 같은 동작을 직접 만들지 않습니다. 직접 만든다면 [AGENTS.md](../AGENTS.md) §3 상태표(열림·닫힘, ARIA 값, 포커스 복원)를 모두 검증합니다.

## 13. 피해야 할 패턴

| 패턴 | 문제 | 대안 |
| --- | --- | --- |
| `<div class="button">` | 키보드·역할 없음 | `<button type="button">` |
| `<a href="#" onclick="…">`로 메뉴 열기 | 링크로 안내되고 URL이 바뀜 | `<button type="button" aria-expanded>` |
| 크기 맞추려고 제목 단계 선택 | 개요가 깨짐 | 올바른 단계 + 클래스 |
| `<br>` 여러 개로 간격 | 의미 없는 줄 | `l-stack` 등 간격 클래스 |
| 모든 묶음을 `<section>` | 의미 없는 영역 남발 | 제목 없는 묶음은 `<div>` |
| `aria-label`을 `<div>`·`<span>`에 붙임 | 역할 없는 요소의 이름은 무시될 수 있음 | 역할이 있는 요소에 붙이거나 보이는 텍스트 사용 |
| `display: none`으로 숨긴 텍스트를 라벨로 사용 | 스크린 리더에도 숨겨짐 | `.u-sr-only` |
| `tabindex="1"` 이상 | 탭 순서가 DOM과 달라짐 | DOM 순서 조정, `0`·`-1`만 사용 |

## 14. 점검 순서

정적 검토와 브라우저 확인을 구분해서 기록합니다([AGENTS.md](../AGENTS.md) 검증 원칙).

- [ ] `lang`, 비어 있지 않은 `<title>`이 있다
- [ ] `<main>`이 하나이고, 모든 콘텐츠가 랜드마크 안에 있다
- [ ] 같은 종류의 랜드마크가 여럿이면 이름이 다르다
- [ ] `<h1>`이 하나이고 제목 단계를 건너뛰지 않는다
- [ ] 이동은 `<a href>`, 실행은 `<button type="button">`이다
- [ ] 모든 링크·버튼·입력에 접근 가능한 이름이 있다
- [ ] 정보 이미지는 설명 `alt`, 장식 이미지는 `alt=""`이다
- [ ] 반복 항목은 목록, 이름–값 쌍은 `<dl>`이다
- [ ] 인터랙티브 요소가 중첩되지 않고, `tabindex`는 `0`·`-1`만 쓴다
- [ ] 브라우저에서 CSS를 끄거나 접근성 트리를 확인해 읽기 순서가 내용 순서와 같다

브라우저 확인 방법:

- Chrome DevTools → Elements → **Accessibility** 패널에서 요소의 역할과 이름, "Full accessibility tree"로 전체 구조를 확인합니다.
- Firefox DevTools → **Accessibility** 탭에서 같은 정보를 확인하고, "Show Tabbing Order"로 탭 순서를 표시합니다.
- 자동 검사 결과는 수동 키보드·스크린 리더 확인을 대신하지 않습니다.

## 참고 자료

- [HTML Living Standard — Sections](https://html.spec.whatwg.org/multipage/sections.html)
- [MDN — HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [HTML Accessibility API Mappings (HTML-AAM)](https://www.w3.org/TR/html-aam-1.0/): 요소별 기본 역할
- [ARIA Authoring Practices Guide — Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
- [ARIA in HTML — 요소에 허용되는 role](https://www.w3.org/TR/html-aria/)

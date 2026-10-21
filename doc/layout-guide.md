# 레이아웃(l-) 클래스 패턴

이 절은 [실제 SCSS 구현](../src/scss/layout/_every-layout.scss)을 기준으로 설명합니다. 레이아웃 클래스는 요소의 배치와 간격을 담당하며, 컴포넌트 클래스와 조합해서 사용합니다. `.l-box`처럼 내부 여백과 기본 색상·테두리를 함께 제공하는 패턴도 있습니다.

```html
<div class="l-grid">
  <article class="c-card">첫 번째 카드</article>
  <article class="c-card">두 번째 카드</article>
</div>
```

아래의 `rem` 값은 루트 글꼴 크기에 따라 달라집니다. `ch`와 `cap`도 사용 글꼴에 영향을 받습니다. 변수의 기본값이 클래스에 직접 선언되어 있으면 부모에서 상속한 값보다 우선하므로, 해당 요소의 인라인 스타일이나 별도 CSS 규칙으로 재정의합니다. `var()`의 대체값은 변수가 없을 때 사용합니다.

## .l-stack

역할: 직계 자식을 세로로 쌓고 간격을 통제합니다. 기본 `--space`는 `1.5rem`이며, 직계 자식의 `margin-block`은 `0`으로 초기화합니다.

| 옵션 | 동작 |
| --- | --- |
| `data-space="small"` | 간격 `0.75rem` |
| `data-space="normal"` | 간격 `1rem` (속성 생략 시의 기본값과 다름) |
| `data-space="large"` | 간격 `3rem` |
| 직계 자식의 `.push-bottom` | 위쪽 자동 마진으로 남은 세로 공간을 차지함. 부모에 여유 높이가 있어야 효과가 보임 |
| `data-recursive` | `gap`을 `0`으로 바꾸고, 모든 자손의 세로 마진을 초기화한 뒤 인접 형제 사이에 위쪽 마진 `--space` 추가 |

재귀 옵션에서는 `gap` 대신 마진으로 간격을 만들므로 직계 자식 간격은 `--space` 한 번만 적용됩니다. `data-recursive="false"`이면 재귀 규칙이 적용되지 않습니다. 직계 자식의 `.push-bottom`은 재귀 옵션에서도 자동 마진을 유지합니다.

재귀 규칙은 모든 자손의 인접 형제에 위쪽 마진을 추가합니다. 안쪽에 `.l-cluster`처럼 가로로 배치되는 요소가 있으면 둘째 항목부터 위쪽 마진이 생겨 세로 정렬이 어긋날 수 있으므로, 그런 구조에는 일반 Stack을 사용합니다.

```html
<div class="l-stack" data-space="small" style="min-block-size: 20rem;">
  <h2>안내</h2>
  <p>본문 내용</p>
  <button class="push-bottom" type="button">확인</button>
</div>
```

## .l-stack-divided

역할: 첫 번째를 제외한 직계 자식에 위쪽 마진 `1.5rem`, 위쪽 패딩 `1.5rem`, 구분선 `1px solid #e2e8f0`을 추가합니다. 별도의 Flex 배치나 변수 옵션은 없습니다.

`.l-stack`과 함께 쓰면 Stack의 `gap`과 이 클래스의 마진이 합산됩니다.

```html
<div class="l-stack-divided">
  <section>첫 번째 영역</section>
  <section>구분선 아래 영역</section>
</div>
```

## .l-box

역할: 콘텐츠를 내부 여백과 경계로 감쌉니다. 기본 패딩은 `--padding: 1.5rem`입니다. 테두리·배경·글자색·둥글기는 `:root` 토큰을 사용합니다. 강제 색상 모드에서 경계를 제공하기 위한 투명 outline도 선언되어 있습니다.

| 속성 | 토큰 (기본값) |
| --- | --- |
| 테두리 | `--border-thin` (`1px`) `solid` `--border-color` (`#e2e8f0`) |
| 배경 | `--color-light` (`#ffffff`) |
| 글자색 | `--color-dark` (`#1e293b`) |
| 둥글기 | `--border-radius` (`0.5rem`) |

박스 안의 자손은 박스의 글자색을 상속합니다. 중첩된 `.l-box`는 자신의 글자색을 유지합니다. 컴포넌트 클래스에 지정한 색은 이 상속 규칙보다 우선합니다.

| 옵션 | 동작 |
| --- | --- |
| `data-invert="true"` | 배경·테두리 `--color-dark`, 글자색 `--color-light` (토큰을 맞바꿈) |
| `data-padding="none"` | 패딩 `0` |
| `data-padding="small"` | 패딩 `0.75rem` |
| `data-padding="normal"` | 패딩 `1rem` |
| `data-padding="large"` | 패딩 `3rem` |
| `data-border="none"` | 테두리 제거 |
| `data-radius="none"` | 둥글기 제거 |

```html
<div class="l-box" data-invert="true" data-padding="small">
  강조할 내용
</div>
```

## .l-center

역할: 콘텐츠의 최대 인라인 크기를 제한하고 양쪽 자동 마진으로 중앙에 배치합니다.

- 최대 콘텐츠 너비: `--measure`, 없으면 `60ch`.
- 양쪽 패딩: `--gutter-inline`, 없으면 `--s1`, 둘 다 없으면 `1.5rem`.
- `box-sizing: content-box`이므로 최대 콘텐츠 너비에 양쪽 패딩이 추가됩니다.

| 옵션 | 동작 |
| --- | --- |
| `data-align-text` | 텍스트 가운데 정렬 |
| `data-intrinsic` | 세로 Flex로 바꾸고 자식을 고유 너비대로 가운데 정렬 |

두 옵션은 `.l-center` 요소 자신에 지정합니다. 속성 값과 관계없이 속성이 있으면 적용됩니다.

```html
<main class="l-center" style="--measure: 70ch; --gutter-inline: 1rem;">
  <h1>페이지 제목</h1>
  <p>읽기 좋은 너비로 제한한 본문</p>
</main>
```

## .l-content-grid

역할: 요소 자체는 전체 폭을 유지하고, 직계 자식만 가운데 콘텐츠 열에 배치하는 Grid입니다. 섹션 배경은 화면 끝까지 채우고 내용만 폭을 제한할 때 사용합니다. `.l-center`는 요소 자체의 폭을 줄이므로 그 요소의 배경도 함께 좁아집니다. 이 차이가 두 클래스를 고르는 기준입니다.

- 열 구성: `[full-start] 여백 [content-start] 콘텐츠 [content-end] 여백 [full-end]`
- 콘텐츠 열 최대 너비: `--content-max`, 없으면 `69.375rem`(1110px). 화면이 좁으면 양쪽 여백을 뺀 너비로 줄어듭니다.
- 양쪽 최소 여백: `--gutter-inline`, 없으면 `--s1`, 둘 다 없으면 `1.5rem`. `.l-center`와 같은 변수입니다.
- 직계 자식은 모두 `content` 열에 배치됩니다. 손자 요소에는 적용되지 않습니다.

| 옵션 | 동작 |
| --- | --- |
| `data-full` | 직계 자식에 지정하면 그 자식만 `full` 열(화면 끝에서 끝)에 배치 |

다른 `l-` 클래스의 옵션과 달리 `data-full`은 `.l-content-grid` 요소 자신이 아니라 **직계 자식**에 지정합니다.

```html
<section class="c-hero l-content-grid" style="--content-max: 60rem;">
  <h1 class="c-hero__title">콘텐츠 열에 배치된 제목</h1>
  <img class="c-hero__image" data-full src="./images/hero.jpg" alt="" />
</section>
```

- 이 클래스는 `display: grid`이므로 자식은 블록 흐름이 아니라 Grid 항목입니다. 자식 사이 간격은 컴포넌트 클래스에서 `row-gap`으로 지정하거나, 콘텐츠를 `.l-stack` 자식 하나로 묶습니다.
- `.l-content-grid > *`와 컴포넌트 클래스는 명시도가 같습니다. [style.scss](../src/scss/style.scss)에서 레이아웃이 컴포넌트·페이지보다 먼저 로드되므로, 자식의 컴포넌트 클래스에 지정한 `grid-column`이 우선합니다. 데스크톱에서 이미지와 텍스트를 다른 열에 겹쳐 놓는 배치는 이렇게 컴포넌트에서 지정합니다.

## .l-cluster

역할: 버튼 그룹이나 태그 목록을 가로로 배치하고 공간이 부족하면 줄바꿈합니다. 기본 가로·세로 정렬은 모두 `center`입니다. 간격은 `--space`이며, 클래스에 기본값 `1rem`이 선언되어 있어 부모 레이아웃(`.l-stack` 등)의 `--space`를 상속하지 않습니다. 간격을 바꾸려면 `data-gap` 옵션이나 해당 요소의 인라인 스타일을 사용합니다.

| 옵션 | 동작 |
| --- | --- |
| `data-justify="start"` | 시작점 정렬 |
| `data-justify="between"` | 남은 공간을 항목 사이에 배분 |
| `data-gap="small"` | 간격 `0.5rem` |
| `data-gap="normal"` | 간격 `1rem` |
| `data-gap="large"` | 간격 `1.5rem` |

```html
<div class="l-cluster" data-justify="start" data-gap="small">
  <button type="button">저장</button>
  <button type="button">취소</button>
</div>
```

## .l-with-sidebar

역할: 두 직계 자식을 사이드바와 본문으로 배치합니다. 첫 번째 자식은 `flex-basis: 20rem; flex-grow: 1`, 마지막 자식은 `flex-basis: 0; flex-grow: 999; min-inline-size: 50%`입니다. 사이드바 너비는 고정되지 않으며, 공간이 부족하면 줄바꿈합니다.

간격은 `--gutter`, 없으면 `--s1`, 둘 다 없으면 `1.5rem`입니다. 첫 번째·마지막 자식 선택자에 의존하므로 두 자식 구조를 사용합니다.

```html
<div class="l-with-sidebar" style="--gutter: 2rem;">
  <aside>관련 정보</aside>
  <section>주요 콘텐츠</section>
</div>
```

## .l-switcher

역할: 컨테이너 너비를 기준으로 가로·세로 배치를 전환합니다. 기본 임계값은 `--threshold: 30rem`이며, 각 자식의 `flex-basis`는 `calc((var(--threshold) - 100%) * 999)`입니다. 실제 줄바꿈에는 간격과 자식의 최소 크기도 영향을 줍니다.

간격은 `--gutter`, 없으면 `--s1`, 둘 다 없으면 `1.5rem`입니다. 직계 자식이 5개 이상이면 너비와 관계없이 모든 자식의 `flex-basis`가 `100%`가 됩니다.

```html
<div class="l-switcher" style="--threshold: 40rem; --gutter: 1rem;">
  <article>첫 번째 카드</article>
  <article>두 번째 카드</article>
  <article>세 번째 카드</article>
</div>
```

## .l-cover

역할: 최소 높이 `100vh`인 세로 Flex 영역에서 주요 콘텐츠를 남은 세로 공간의 중앙에 배치합니다. 직계 자식인 `h1` 또는 `.center`에 위아래 자동 마진을 적용합니다. `.center`가 첫째나 마지막 자식이어도 중앙 배치가 유지됩니다.

패딩은 `--space`이며 기본값은 `var(--s1, 1.5rem)`입니다. 자식 마진은 별도로 `var(--s1, 1.5rem)`을 사용하므로 `--space`만 바꿔도 함께 바뀌지는 않습니다. 첫 자식이 `h1`·`.center`가 아니면 위쪽 마진을, 마지막 자식이 `h1`·`.center`가 아니면 아래쪽 마진을 제거합니다.

```html
<section class="l-cover">
  <header>사이트 이름</header>
  <div class="center">
    <h1>주요 메시지</h1>
    <p>소개 문구</p>
  </div>
  <footer>추가 안내</footer>
</section>
```

## .l-grid

역할: 공간에 맞춰 열 수를 자동으로 조정하는 Grid입니다. 기본 간격은 `1rem`, 최소 열 너비 변수는 `--minimum: 20ch`입니다.

`min()` 지원 조건에서 `repeat(auto-fit, minmax(min(var(--minimum), 100%), 1fr))`을 적용합니다. 최소 열 너비를 컨테이너 너비 이하로 제한하지만, 자식의 고정 크기나 긴 콘텐츠까지 자동으로 해결하는 것은 아닙니다. 지원 조건이 충족되지 않으면 자동 다중 열 선언은 적용되지 않습니다. 간격을 바꾸려면 별도 CSS나 인라인 `gap`을 사용합니다.

```html
<div class="l-grid" style="--minimum: 25ch; gap: 1.5rem;">
  <article class="c-card">첫 번째 카드</article>
  <article class="c-card">두 번째 카드</article>
</div>
```

## .l-frame

역할: 기본 `16 / 9` 비율의 미디어 영역을 만듭니다. `--n`은 가로 비율, `--d`는 세로 비율이며, 넘치는 내용은 숨깁니다. 직계 자식 `img`·`video`는 너비와 높이 `100%`, `object-fit: cover`로 채워 일부가 잘릴 수 있습니다.

```html
<div class="l-frame" style="--n: 1; --d: 1;">
  <img src="portrait.jpg" alt="인물 소개 사진">
</div>
```

`portrait.jpg`는 설명용 경로이며 실제 자산 경로로 교체합니다.

## .l-reel

역할: 항목을 한 줄에 배치하고 넘치는 부분을 가로 스크롤로 탐색하게 합니다. 세로 넘침은 숨깁니다. 자동 재생·이전/다음 버튼·스크롤 스냅은 이 클래스에서 제공하지 않습니다.

| 변수 | 기본값과 용도 |
| --- | --- |
| `--reel-height` | `auto`, 영역 높이 |
| `--item-width` | `25ch`, 일반 직계 자식의 Flex 기준 너비 (늘어나거나 줄어들지 않음) |
| `--color-light` | `:root` 토큰 (`#ffffff`), 스크롤바 밝은 색 |
| `--color-dark` | `:root` 토큰 (`#1e293b`), 스크롤바 어두운 색 |
| `--space` | `1rem`, 항목 사이 `gap` |

간격은 `--space`로 조정하며, 인라인 `gap`을 지정하면 그 값이 우선합니다. 직계 자식이 `img`이면 일반 항목 규칙 대신 `flex-basis: auto; width: auto; block-size: 100%`가 적용됩니다. 스크롤바 표현은 브라우저의 지원에 따라 달라집니다.

```html
<div class="l-reel" style="--item-width: 30ch; --space: 1.5rem;">
  <article>첫 번째 항목</article>
  <article>두 번째 항목</article>
  <article>세 번째 항목</article>
</div>
```

## .l-imposter

역할: 기준 영역의 중앙에 요소를 겹쳐 배치합니다. 기본 위치 지정은 `absolute`이며, 시작 위치 `50%`와 `translate(-50%, -50%)`를 조합합니다. 부모 영역을 기준으로 삼으려면 부모에 `position: relative` 등을 설정합니다. `--positioning: fixed`로 위치 지정 방식을 바꿀 수 있습니다.

`.contain`을 함께 지정하면 `overflow: auto`와 최대 너비·높이 제한을 적용합니다. 여백 변수 `--margin`의 기본값은 `0px`이며 단위가 있는 길이로 재정의합니다. 높이 제한이 필요한 경우 기준 영역의 높이도 정해야 합니다.

```html
<div style="position: relative; block-size: 20rem;">
  <div class="l-imposter contain" style="--margin: 1rem;">
    중앙에 겹쳐 배치할 내용
  </div>
</div>
```

이 클래스는 배치만 제공합니다. 모달로 사용할 때 필요한 열림·닫힘, 포커스 관리, 의미와 접근성 동작은 별도로 구현합니다.

## .l-icon / .l-with-icon

역할: `.l-icon`은 아이콘 너비·높이를 `0.75em`으로 지정하고, `cap` 지원 환경에서는 `1cap`으로 덮어씁니다. `.l-with-icon`은 텍스트와 아이콘을 `inline-flex` 및 기준선 정렬로 배치합니다.

간격 선택자는 `.l-with-icon .icon`입니다. 크기 클래스 `.l-icon`만으로는 간격이 적용되지 않으므로 아이콘에 `icon` 클래스도 추가합니다. 끝쪽 마진은 `--icon-space`, 없으면 `0.5em`입니다. 부모 레이아웃의 `--space`와 섞이지 않도록 별도 변수를 사용합니다.

```html
<button class="l-with-icon" type="button">
  <svg class="l-icon icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" fill="none" stroke="currentColor"></path>
  </svg>
  다운로드
</button>
```

텍스트로 이름이 제공되는 버튼에서는 장식 아이콘을 `aria-hidden="true"`로 중복 읽기에서 제외합니다.

## 일반적인 명칭과 실제 구현의 구분

`.l-wrapper`, `.l-inner`, `.l-container`, `.l-row`, `.l-col`, `.l-inline`, `.l-group`, `.l-sidebar`, `.l-main`은 일반적으로 쓰이는 명칭이지만 이 SCSS 파일에는 선언되어 있지 않습니다. 이 파일의 별칭으로 사용할 수 없습니다. 중앙 정렬은 `.l-center`, 전체 폭 배경 안의 콘텐츠 열은 `.l-content-grid`, 격자는 `.l-grid`, 가로 줄바꿈은 `.l-cluster`, 사이드바 구조는 `.l-with-sidebar`를 사용합니다.

# 대표적인 컴포넌트(c-) 종류

컴포넌트 스스로 바깥쪽 여백(margin)이나 크기, 위치를 결정해서는 안 됩니다.

나쁜 예: .c-card { margin-bottom: 20px; width: 300px; }
좋은 예: .c-card에는 폰트, 색상, 안쪽 여백(padding)만 둡니다. 사이 간격이나 너비는 부모인 .l-grid나 .l-stack이 통제하게 합니다.


## .c-button (버튼)

웹에서 가장 많이 재사용되는 요소입니다. 배경색, 둥근 모서리(border-radius), 호버(hover) 시 색상 변화 등의 시각적 스타일을 모두 포함합니다.

## .c-card (카드)

쇼핑몰의 상품, 블로그의 글 목록, 프로필 정보 등을 묶어 보여주는 상자 형태의 UI입니다. 주로 옅은 그림자나 테두리, 흰색 배경을 가집니다.

## .c-badge / .c-tag (뱃지 / 태그)

"NEW", "품절", "업데이트" 같은 짧은 텍스트나 카테고리를 강조할 때 쓰는 작은 요소입니다.

## .c-avatar (아바타)

사용자의 프로필 이미지를 보여주는 요소입니다. 이미지를 완벽한 원형으로 자르거나(border-radius: 50%), 기본 테두리를 두르는 역할을 합니다.

## .c-alert / .c-toast (알림 메시지)

비밀번호 오류, 저장 완료 등 사용자에게 상태를 알려주는 컬러풀한 박스(성공은 초록색, 에러는 빨간색 등)입니다.

## .c-modal / .c-dialog (모달 / 다이얼로그)

기존 화면 위에 반투명한 검은 배경을 깔고 중앙에 떠오르는 팝업 창입니다.

## .c-accordion (아코디언)

FAQ 섹션처럼 제목을 클릭하면 숨겨져 있던 내용이 아래로 스르륵 펼쳐지는 UI 요소입니다

```css
<!-- 완벽하게 역할이 분리된 마크업 예시 -->
<div class="l-stack"> <!-- 배치(간격) 담당 -->
  
  <article class="c-card"> <!-- 디자인 담당 -->
    <img src="profile.jpg" class="c-avatar" alt="프로필">
    <span class="c-badge">신규</span>
    <h3 class="c-title">새로운 글이 등록되었습니다.</h3>
    <button class="c-button">자세히 보기</button>
  </article>

</div>
```

# 대표적인 유틸리티(u-) 종류
##  .u-hidden (숨김)

요소를 화면에서 완전히 사라지게 합니다. (display: none !important;)

## .u-visually-hidden 또는 .u-sr-only (시각적 숨김 / 접근성)

화면에서는 보이지 않지만, 시각 장애인을 위한 스크린 리더기에서는 정상적으로 읽히도록 처리하는 매우 중요한 클래스입니다.

## .u-text-center, .u-text-right (텍스트 정렬)

부모나 컴포넌트의 기본 정렬을 무시하고 텍스트를 강제로 가운데나 오른쪽으로 정렬합니다.

## .u-mt-0, .u-mb-lg (여백 조정)

특정 상황에서만 마진(Margin)이나 패딩(Padding)을 없애거나 늘려야 할 때 사용합니다. (예: margin-top: 0 !important;)

## .u-color-error, .u-bg-primary (색상 강제 변경)

기본 텍스트나 배경색을 예외적으로 다른 색으로 덮어씌울 때 씁니다.

🚨 유틸리티 작성 및 사용 규칙
1. !important의 합법적인 사용처
일반적으로 CSS에서 !important의 사용은 금기시되지만, .u- 클래스에서는 적극 권장됩니다. 유틸리티는 아키텍처의 최하단에 위치하므로, 그 어떤 복잡한 컴포넌트(.c-card .c-title)가 오더라도 무조건 이겨서(우선순위가 높아) 스타일을 덮어씌워야 하기 때문입니다.

2. 단일 책임 원칙 (하나의 클래스는 하나의 일만)
유틸리티 클래스 안에 두 개 이상의 스타일 속성을 넣지 않습니다.

나쁜 예: .u-bold-and-red { font-weight: bold; color: red; }

좋은 예: .u-text-bold, .u-text-red 두 개를 분리해서 각각 필요할 때 조합해 씁니다.

💡 컴포넌트와의 결합 예시
잘 만들어진 .c-button이 있다고 가정해 보겠습니다. 이 버튼은 기본적으로 위쪽 여백(margin-top) 20px을 가지고 있습니다. 하지만 특정 화면에서는 이 여백이 필요 없을 수 있습니다.

이때 새로운 .c-button-no-margin이라는 컴포넌트를 만드는 대신, 유틸리티를 하나 덧붙여 우아하게 해결합니다.

```html 
<!-- 기본 버튼 -->
<button class="c-button">전송하기</button>

<!-- 특수한 상황: 기본 마진을 강제로 0으로 덮어씌움 -->
<button class="c-button u-mt-0">전송하기</button>

<!-- 버튼은 그대로 두고 숨기고 싶을 때 -->
<button class="c-button u-hidden">전송하기</button>
```

# 대표적인 is- 클래스 (자신의 상태)

`is-`와 `has-` 접두사는 요소가 현재 어떤 상태(State)에 있는지를 나타내는 데 사용됩니다. SMACSS 방법론에서 유래하여 지금도 널리 쓰이는 표준적인 네이밍 방식입니다.

레이아웃이나 컴포넌트가 화면이 처음 그려질 때의 기본 모습을 결정한다면, 상태 클래스는 **사용자의 클릭, 스크롤, 또는 데이터 로딩에 따라 자바스크립트(JS)가 동적으로 뗐다 붙였다(Toggle) 하는 클래스**입니다.

## 1. 대표적인 `is-` 클래스 (자신의 상태)

요소 그 자체가 현재 어떤 상태인지를 설명합니다.

* **`.is-active` / `.is-current` (활성화됨)**
* 현재 선택된 탭, 눌려있는 버튼, 현재 머물고 있는 내비게이션 메뉴 등입니다.


* **`.is-disabled` (비활성화됨)**
* 폼 전송 중이거나 조건을 만족하지 않아 클릭할 수 없게 회색으로 변한 버튼입니다. (보통 HTML의 `disabled` 속성과 함께 씁니다.)


* **`.is-loading` (로딩 중)**
* 데이터를 불러오는 중이라 내부에 빙글빙글 도는 스피너가 보이는 상태입니다.


* **`.is-open` / `.is-closed` (열림 / 닫힘)**
* 드롭다운 메뉴, 아코디언, 모달 창 등이 화면에 펼쳐져 있는지 접혀 있는지를 나타냅니다.


* **`.is-valid` / `.is-invalid` (유효함 / 에러)**
* 회원가입 폼에서 비밀번호 조건이 맞았을 때(초록색 띠)와 틀렸을 때(빨간색 띠)를 나타냅니다.



## 2. 대표적인 `has-` 클래스 (자식/포함 상태)

요소 자체가 아니라, **그 요소가 무엇을 품고 있는지**를 설명합니다. 주로 부모 요소에 붙어 자식 요소들의 배치를 바꿀 때 씁니다.

* **`.has-dropdown` (드롭다운을 가짐)**
* 메뉴 항목 중, 마우스를 올리면 하위 메뉴가 펼쳐지는 항목을 뜻합니다. (보통 옆에 화살표 ▼ 아이콘을 추가로 그려줍니다.)


* **`.has-error` (내부에 에러가 있음)**
* 폼 입력 그룹(라벨+입력칸+도움말) 전체를 붉은색 테두리로 감싸야 할 때, 가장 바깥 부모에게 이 클래스를 줍니다.


* **`.has-icon` (아이콘을 포함함)**
* 버튼 안에 글자만 있는 것이 아니라 아이콘이 함께 들어있어, 글자와 아이콘 사이의 간격(flex gap 등)을 조정해야 할 때 씁니다.



---

## 🚨 상태 클래스 작성 시 핵심 규칙 (컴포넌트 종속성)

유틸리티(`.u-`)와 달리, 상태 클래스는 **절대 혼자서 쓰이면 안 되며 항상 특정 컴포넌트(`.c-`)와 결합해서 정의**해야 합니다.

`.is-active`라는 상태는 '탭'이 활성화되었을 때(밑줄 추가)와 '모달'이 활성화되었을 때(화면 띄움)의 디자인이 완전히 다르기 때문입니다.

```css
/* ❌ 나쁜 예: 전역적으로 선언하면 다른 요소의 상태와 충돌합니다 */
.is-active { background-color: blue; } 

/* ✅ 좋은 예: 어떤 컴포넌트의 상태인지 명확히 연결(Chaining)합니다 */
.c-tab.is-active { border-bottom: 2px solid blue; }
.c-modal.is-active { display: block; opacity: 1; }

```

```html
<!-- 실제 HTML 적용 모습 (자바스크립트로 is-active를 제어) -->
<ul class="l-cluster">
  <li class="c-tab is-active">활성화된 탭</li>
  <li class="c-tab">일반 탭</li>
</ul>

```
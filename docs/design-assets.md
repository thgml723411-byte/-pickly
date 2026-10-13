# Pickly 아날로그 무드 디자인

사용자가 제공한 필름 프레임, 클립으로 묶은 종이, 사진이 인쇄된 LP 샘플을 참고했다. 기존 아마란스·핑크·그린·초크·올리브 팔레트를 유지하고, 필름 사진과 겹친 종이, 세리프 글자, 메모지 형태의 무드 카드를 조합했다.

## 생성 이미지

이미지는 내장 `image_gen.imagegen` 도구로 생성했다. 사진은 품질 88 JPEG, 배경을 제거한 책 이미지는 투명 PNG로 사용한다. 사용자가 제공한 원본 이미지 파일은 변경하지 않았다.

- `public/images/mood-cozy-cinema.jpg`: 첫 화면과 영화 카드의 포근한 홈시네마 사진. 필름 프레임과 세로 반복 이동은 CSS로 표현한다.
- `public/images/imgi_52_3cbc24fdfce3055e90b04bb9f4bf7760.jpg`: 사용자가 첨부한 필름 사진 원본. 후속 요청으로 내부 장면을 홈시네마 사진으로 교체했다. 원본 파일은 유지했다.
- `public/images/mood-listening-room.jpg`: 이전 디자인에서 사용한 필름 사진. 현재 화면에서는 사용하지 않는다.
- `public/images/mood-cinema-projector.jpg`: 이전 영화 카드용 프로젝터 사진. 현재 화면에서는 사용하지 않는다.
- `public/images/mood-amaranth-folder-cutout.png`: 아마란스 표지·검정 및 흰색 종이·클립을 남기고 회색 사진 배경을 제거한 투명 PNG. '한 페이지의 여유.' 문구와 부유 애니메이션은 HTML/CSS로 표시한다.
- `public/images/mood-amaranth-folder.jpg`: 배경 제거 전 책 표지 사진. 원본은 유지했다.
- `public/images/mood-record-art.jpg`: 원형으로 표시하는 기존 LP 표면 아트워크를 유지했다. 별·라벨·음반의 홈을 포함한 판 전체는 CSS로 연속 회전하고, 올리브색 앨범 커버는 고정한다.

## 최종 생성 프롬프트

### 필름 사진

```text
Use case: photorealistic-natural. Asset type: photographic background for a vintage analogue film-strip on a Korean media curation website called Pickly. Generate a single high-quality landscape 3:2 photograph, NO borders, no UI, no collage, no text or lettering. Subject: an intimate 1970s listening corner with a small walnut record shelf, stacked vinyl LP albums with abstract unbranded sleeves in dusty rose, muted sage and cream, one sculptural brass mushroom lamp, and one small potted plant. Warm timber wall and soft cream carpet. Cropped intimate composition, low viewpoint, quiet late-afternoon sun, inviting and lived-in, no people. Medium-format editorial film photography, organic 35mm grain, soft focus, slight halation, faded highlights and gentle vignette. Color palette should sit harmoniously with #933B5B amaranth, #B5728A dusty pink, #AABAAE sage, #E3D6BF chalk, #9F9679 olive. Sophisticated real photograph, no illustration, no visible words, no logos, no watermark.
```

### LP 아트워크

```text
Use case: stylized-concept. Asset type: artwork photograph printed on a vinyl LP record for an analogue music editorial website. Generate a square full-bleed abstract nostalgic landscape photo. A mountain lake at dusk with deep sage-blue water and a dusty rose sky; warm blurred terracotta and gold wildflowers in the foreground. Strong intentional circular motion blur from the camera, visible film grain and tactile print texture, artistically imperfect vintage 1990s indie album aesthetic, dreamy romantic, avoid crisp digital aesthetic. Dusty pink #B5728A, muted sage #AABAAE, amaranth #933B5B, chalk #E3D6BF and muted olive #9F9679. This is a flat square image to be clipped into a circle by website CSS: fill the WHOLE square with the artwork. NO actual vinyl object, no circle boundary, no black border or backdrop, no lettering, no logos, no stars, no watermark, no UI.
```

### 영화 카드 프로젝터

```text
Use case: photorealistic-natural. Asset type: a movie recommendation card photograph for Pickly, an analogue editorial website. Create a single portrait 4:5 photographic image of a quiet vintage cinema projection room: one authentic compact 16mm movie film projector with two metal film reels visibly mounted vertically on its top, a warm glowing lens casting a soft beam toward the upper left, a small pair of blank vintage cinema tickets resting on the dark wooden tabletop in front. Warm timber panel wall, soft tungsten lamplight, intimate late-night cinema atmosphere. Keep the projector clearly recognizable in the central area so it remains identifiable when center-cropped to a square. Leave some calm dark negative space in upper half for a short white website caption. Nostalgic analogue film photography, delicate visible grain, gently faded highlights, realistic worn metal and wood, muted chalk beige, dusty pink, olive and warm amber tones, low-key shadows. Must be unmistakably about movies, not music. No vinyl records, no record player, no LP albums, no album shelves, no headphones, no musical instruments, no people. No typography, no watermarks, no logos, no film-strip border, no UI.
```

### 책 표지 색상 변경 — 내장 Imagegen 편집

입력 파일: public/images/green folders 💚.jpg
출력 파일: public/images/mood-amaranth-folder.jpg

```text
Use case: precise-object-edit. Edit target: the attached local photograph of a lime-green paper folder on a stack of black-and-white papers held with a metallic paper clip. Change ONLY the lime-green front folder's color to a monochromatic Amaranth gradient based on hex #933B5B: a softly lit dusty rose highlight at the upper left, rich amaranth in the middle, and a slightly darker amaranth at the lower right. Preserve the exact original folder shape, paper texture, photographic light and shading, image framing, resolution/aspect ratio, perspective, clip, black paper, white papers, neutral grey background, all shadows and every other detail. It must look like the same original photograph with the green color replaced, not a redesigned scene. No remaining lime-green on the front folder. Do not add words, logos, symbols, objects, borders or decorations. Keep the real metal clip its original olive brass color. Keep the background and non-green papers completely unchanged.
```

### 포근한 홈시네마 — 내장 Imagegen 생성

출력 파일: public/images/mood-cozy-cinema.jpg

```text
Use case: photorealistic-natural. Asset type: photograph inside moving movie-film frames on Pickly, a warm analogue editorial website. Generate ONE landscape 3:2 photograph of a very cozy small private home cinema for a quiet movie night: a cream bouclé two-seat sofa with soft knitted blankets and dusty rose cushions in the foreground, a small wooden coffee table with a bowl of popcorn and two ceramic mugs, a compact vintage film projector visibly projecting a gentle shaft of light toward a small plain projection screen with a soft indistinct warm glow, amber table lamp, linen curtains, walnut wood, one small houseplant. The layout must make the screen, projector and comfortable seating visible together so the place reads immediately as a place to watch a film. Camera from the back corner facing the screen, intimate lived-in realistic home interior, soft tungsten lamplight at dusk, nostalgic 35mm film grain, gentle halation, photographic material texture. Warm chalk cream #E3D6BF, muted sage #AABAAE, dusty rose #B5728A and olive #9F9679 harmonize with amaranth #933B5B. Portrait-ish central composition within a landscape canvas so a square crop still shows screen and projector. Do not include vinyl records, record shelves, LP albums, turntables, headphones or music equipment. No people. No legible text, no poster titles, no logos or watermark. No film-strip border, no collage, no UI; website code will create the surrounding film frames.
```

### 책 이미지 회색 배경 제거 — 내장 Imagegen 편집

입력 파일: public/images/mood-amaranth-folder.jpg
출력 파일: public/images/mood-amaranth-folder-cutout.png
transparent_background: true

```text
Use case: background-extraction. Edit the input photograph by removing ONLY the surrounding neutral gray rectangular photographic backdrop. Keep the entire physical paper stack as the foreground: the amaranth gradient front folder, the black backing sheet, all white backing sheets, and the olive brass paper clip. White paper is foreground, NOT background; preserve it fully. Preserve the exact original shapes, color, surface texture, perspective, arrangement, small details, object scale, placement and original 1122x1402 canvas/aspect ratio. Do NOT crop or trim transparent margins, do NOT recenter or resize the object, because website text overlays depend on the existing coordinates. All pixels of the outer gray background must become truly transparent alpha, including gray background between protruding sheet edges. Preserve only a subtle natural contact shadow immediately next to the paper edges, with transparent fading outside. No solid-color replacement, no gray rectangle, no white rectangle, no painted checkerboard, no extra objects or typography. Return a clean transparent PNG cutout with the original foreground looking unchanged.
```
# Social Pharmacy Laboratory — homepage 시안 3

Sahmyook University 약학대학 Social Pharmacy Laboratory(김혜린 교수) 홈페이지의 **세 번째 디자인 시안** 저장소입니다.

## 시안 구성

| 시안 | 저장소 | 성격 |
| --- | --- | --- |
| 1 | `kimjunny/kim-hyerin-homepage` | 원본. 에디터/백엔드 도입 직전 상태로 롤백된 기존 디자인 |
| 2 | `kimjunny/kim-hyerin-homepage-v2` | <https://idea.korea.ac.kr/> 디자인을 그대로 복제 |
| 3 | 이 저장소 | 새 디자인 시안 (작업 예정) |

## 출발점

시안 2의 클론 마크업이 섞이지 않도록, **원본(롤백본)의 6개 페이지와 콘텐츠**를 그대로 가져와 시작합니다.
디자인 방향이 정해지면 `src/styles/`와 각 페이지 마크업을 그 방향으로 교체합니다.

## 지켜야 할 것

- 콘텐츠 보존: 영문 카피, 외부 링크 19개, DOI/PMID, 논문 그림 4종과 CC BY-NC 출처 표기, 캠퍼스 사진 크레딧.
- 실행 자바스크립트 0개 (비실행 `application/ld+json` 제외).
- 페이지 6종 유지: `index`, `profile`, `research`, `publications`, `education`, `sources`.

## 스택

```bash
bun install
bun run dev      # http://127.0.0.1:5173
bun run build    # dist/
bun run check    # biome
```

## 품질 게이트

- `bun run build` 종료코드 0, `bunx biome check .` 종료코드 0
- 320 / 375 / 768 / 1024 / 1440px에서 가로 오버플로 없음
- 키보드 포커스 가시성, 끊기지 않는 긴 문자열 내성
- 검사 하네스: `C:\Users\yejun\Desktop\github\_khp_qa\gate.ts`, `content-check.ts`, `evidence.ts`

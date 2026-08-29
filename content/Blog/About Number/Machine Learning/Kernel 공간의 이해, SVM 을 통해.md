---
title: Kernel 공간의 이해, SVM 을 통해
date: 2026-08-25
publish: true
---
### Motivation

난 주술회전을 보진 않았지만. 영역전개라는 기술을 안다. 이 기술은 공간을 나눠 마음의 영역을 현실로 끌어와 그 내부에서 술식을 부여한 특수한 공간을 구축하는, 쉽게 말해 나만 이길수 있는 공간을 현실로 불러오는 오의 같은거다. 

![[Pasted image 20260830030407.png|410]]

갑자기 만화 이야기를 하나 싶겠지만, 오늘 배울 내용인 커널공간이라는게 사실 이 영역전개와 다를바가 없다. 처리하기 엄청 어려운 고차원의 데이터도 커널로 불러오면 연산을 매우 쉽게 만들어 준다. (오늘 알아야할 주제이다) 이뿐만이 아니다 전역 최적해를 보장하여 Local Minima 의 저주에서 자유롭고, 구조체 즉 비정형 데이터 까지 커널 하나로 해결할수 있는 말도 안되는 성능을 가지고 있기에 (지금 무슨말을 하는지 몰라도 괜찮다 나중에 다 이야기 할거다)

딥러닝 이전 시대 1990-2000초반까지 머신러닝 학계를 지배한 방법론이다.

물론 $n \times n$ 행렬 계산 문제, 스스로 학습하지 못한다는 문제로 인해 딥러닝에게 그 왕좌를 내 주었지만 여전히 강력한 방법론이다.

커널 공간 그 자체를 설명하는건 "그래서 뭐 어쩌라는거야" 라는 질문이 나올수 있다. 따라서 나는 이 기술을 활용하여 지금까지 우리가 풀지못한(비선형) 분류 문제를 익숙한 SVM 방식을 개조하여 같이 풀어볼까 한다. 아마 훨씬 직관적으로 와 닿을 것이다 

(해당 글은 University of Melbourne, Statistical Machine Learning (COMP90051)의 5주차 1차시 수업내용을 기반으로 작성되었다)  

### Goal

1. Kernel 공간의 이해
2. Kernel SVM의 이해 
3. 커널 활용 방법의 이해

## 목차

1. **비선형 분류 문제와 고차원 매핑의 한계**
   * 선형 분리 불가능 문제와 차원의 저주

1. **SVM 개조하기: Primal에서 Dual로의 여정**
   * 3가지 필수 재료 (Soft-margin SVM, 제약 최적화, KKT 조건)
   * Hard-margin SVM Dual 유도 7단계
   * Dual 변수($\lambda$)를 통한 서포트 벡터 판별 및 파라미터($w, b$) 복원

3. **커널 트릭 (Kernel Trick)**
   * 내적($x_i^\top x_j$)에서 커널 함수($K(x_i, x_j)$)로의 전환
   * 실질적인 계산량 절감 효과 ($O(d_{\text{mapped}})$ vs $O(d_{\text{original}})$)

4. **Kernel Modular Learning과 유효성 검증**
   * 대표적인 커널: Polynomial Kernel과 RBF Kernel(무한 차원 매핑)
   * 커널 조합(Closure Property)
   * 커널 유효성 검증: Mercer / PSD 조건 ($a^\top M a \ge 0$)
   * 비정형 데이터(문자열, 그래프 등)로의 확장

5. **Wrap-up**

#### 비선형 분류문제란 무엇인가, 왜 기존 방법은 풀수 없으며 어떻게 접근해야 하는가 

일단 처리해야할 문제부터 파악해보자. 왼쪽 그림에서 우리는 빨간색과 초록색을 구분하는 선을 만들고 싶다 
근데 지금까지 우리가 배운 선을 긋는 방식은 직선이었다. 

![[Pasted image 20260827165559.png|453]]

왼쪽 그림은 어떤 직선을 그려도 초록색과 빨간색을 구분할수 없다. 이런 문제를 비선형 분류문제라고 한다. 지금까지 우리가 배운 방법으로는 해당 문제를 풀수 없다 

따라서 우린 새로운 아이디어를 적용해볼것이다. 2차원의 데이터를 3차원으로, 즉 고차원 확장(Mapping 한다고 한다)하면 오른쪽과 같은 그림을 띄게 될것이고 Z 축을 기준으로 하여 초평면으로 포를 뜨듯 반으로 갈라버리면 된다. 

고차원 매핑 컨셉이 kernel 의 아주 직관적인 컨셉이라고 이해해도 괜찮을거 같다. (엄연히 다르긴 하다)

#### SVM 개조를 위한 과정 -> Dual 문제 유도하기

데이터를 가르는 대표적인 방법인 SVM을 가지고, 비선형 문제 해결을 위해 개조를 해볼까 한다. 4,5 개 정도의 프로세스를 거칠 것인데 이를 먼저 알려주고자 한다. 

1. Hard margin primal 작성 
2. Lagrangian 과 KKT 조건 작성 
3. Stationarity 로 w,b 제거 (미분 set 0)
4. 3의 결과를 대입해서 Dual function 계산 
5. Dual constraints 를 붙여 Dual problem 완성 
6. 람다로 w, b 복원 
7. 새로운 데이터 예측 

지금 뭔말인지 전혀 몰라도 된다. 그냥 이런 순서로 진행이 될거고 구체적으로 하나씩 설명할때 이 프로세스 안에서 길을 잃지 않게 한번씩 살펴보면 된다 

해당 프로세스를 이해하기 위해서는 3가지 재료를 준비 해볼 필요가 있다

![[Pasted image 20260826230741.png|477]]

##### 재료를 준비하기전.. 근데 **왜 듀얼을 쓰는가? (미리보는 결과)**

고차원 공간에서 데이터를 분류하기 위해 비선형 SVM으로 확장해야 한다는 것은 알겠다. 그런데 왜 하필 번거롭게 Primal 문제를 Dual 문제로 바꾸는 걸까?

결론부터 미리 말하면 다음과 같다.

$$
\boxed{ \text{SVM을 Dual로 바꾸면 모든 데이터가 오직 '내적' 형태로만 나타난다.} }
$$

그리고 이 내적($x_i^\top x_j$)을 Kernel Function($K(x_i, x_j)$, 고차원 공간에서의 내적을 대신 계산하는 함수)으로 교체하면, 복잡한 고차원 좌표를 직접 계산하지 않고도 고차원 공간에서 SVM을 학습시킬 수 있다.

이를 커널 트릭(Kernel Trick)이라 하며, 이것이 우리가 라그랑지안과 KKT을 거쳐 나아갈 최종 목적지이다.

#### 1. Soft Margin SVM (재료 1) 

우리가 앞으로 계속 사용할 primal(걍 제약식 있는 문제라 생각하면 된다) 문제이다. SVM을 모르면 앞으로 하는 이야기를 이해할수 없으니 꼭 복습을 하고 오자

$$
\min_{w,b,\xi} \left( \frac12\lVert w\rVert^2+C\sum_{i=1}^{n}\xi_i \right)
$$

subject to

$$
y_i(w^\top x_i+b)\geq 1-\xi_i, \qquad \xi_i\geq 0.
$$

첫 항은 넓은 margin을 선호하고, 두 번째 항은 margin 위반을 처벌한다. 
평소와 같으면 해당 문제를 푸는데 집중하겠지만 오늘은 이 문제를 직접 푸는 대신 dual로 바꿀거다 

#### 2. 제약조건이 있는 최적화(재료 2) 

일반적인 constrained optimisation은

$$
\min_x f(x)
$$

subject to

$$
g_i(x)\leq0, \qquad h_j(x)=0
$$

형태이다. 그리고 이런 제약조건을 풀기위한 최적한 방법론중 하나가 라그랑주 승수법이다

그리고 이 라그랑주 승수법을 primal 문제에 적용하면 제약식과 목적함수를 하나로 합치게 되며 이것이 Dual 함수의 기본 형태가 된다 

이제 SVM 문제를 라그랑주에 적용시켜 보자 

#### KKT 조건(재료 3) 

슬프게도 바로 라그랑주를 풀수 없다. SVM 의 제약조건에는 부등식 제약이 걸려있어  KKT condition 이라는걸 활용해야 한다. 이는 부등식 제약조건이 붙은 최적화 문제에서 최적점($x^*$)이 반드시 만족해야 하는 4가지 체크리스트 같은거라 생각하면 된다.

문제: $\min_x f(x) \quad \text{subject to } g(x) \le 0$

1. **Stationarity (기울기 = 0)**: $\nabla f(x^*) + \lambda^* \nabla g(x^*) = 0$ 
2. **Primal Feasibility (원래 제약 만족)**: $g(x^*) \le 0$
3. **Dual Feasibility (벌금 승수는 0 이상)**: $\lambda^* \ge 0$
4. **Complementary Slackness (상보 여유성)**: $\lambda^* \cdot g(x^*) = 0$

    - $\lambda^* = 0$이거나 $g(x^*) = 0$이어야 합니다. 즉, **제약조건 경계에 걸려 있지 않다면($g(x^*) < 0$) 벌금 단가는 무조건 0**이어야 한다.

솔직히 이렇게 적어놓으면 뭐 어쩌라는 건지도 모르겠다. 이럴땐 간단한 예제를 풀어보는게 좋다 (나도 이해 못하다가 예제 풀고 바로 이해했다) 

**문제**: $f(x) = (x - 3)^2$의 최솟값을 구하라. (단, 제약조건 $x \le 1$)

표준형태로 바꾸면 $g(x) = x - 1 \le 0$ 이다.

**1단계: 라그랑지안 식 작성**

$$
\mathcal{L}(x, \lambda) = (x - 3)^2 + \lambda(x - 1)
$$

**2단계: KKT 조건 식 세우기**

1. $\frac{\partial \mathcal{L}}{\partial x} = 2(x - 3) + \lambda = 0 \implies 2(x - 3) = -\lambda$
2. $x \le 1$
3. $\lambda \ge 0$
4. $\lambda(x - 1) = 0$

**3단계: 4번 조건($\lambda(x - 1) = 0$)으로 케이스 나누어 풀기**

- **Case 1: $\lambda = 0$인 경우**
    - 1번 식에 대입: $2(x - 3) = 0 \implies x = 3$
    - 2번 조건($x \le 1$) 확인: $3 \le 1$ (**모순 발생, 탈락**)

- **Case 2: $x - 1 = 0 \implies x = 1$인 경우**
    - 1번 식에 대입: $2(1 - 3) + \lambda = 0 \implies -4 + \lambda = 0 \implies \lambda = 4$
    - 3번 조건($\lambda \ge 0$) 확인: $4 \ge 0$ (**조건 만족!**)

**최종 정답**: 최적해는 $x^* = 1$, 최솟값은 $(1 - 3)^2 = 4$ 이다.

### Hard-margin SVM 을 Dual 로 만들어 보기

이제 모든 준비는 끝났다. 실제로 SVM Primal 에 라그랑주, KKT 적용해서 Dual 문제로 바꿔볼꺼다. 

레시피를 다시 복습하자 

1. Hard margin primal 작성 
2. Lagrangian 과 KKT 조건 작성 
3. Stationarity 로 w,b 제거 (미분 set 0)
4. 3의 결과를 대입해서 Dual function 계산 
5. Dual constraints 를 붙여 Dual problem 완성 
6. 람다로 w, b 복원 
7. 새로운 데이터 예측 

그대로 갈거다 , 

**결국 우리가 만들고 싶은건 데이터의 내적 형태 (Dual form)이고, 내적으로 만들어야 커널을 사용할수 있다**

또한 Dual 문제에서 구한 람다를 통해 새로운 데이터가 들어왔을때의 반응을 확인해 볼것이다 (람다만 알아도, W, B 를 업데이트 할수 있음)

#### 1단계 : Hard-margin primal 작성

![[Pasted image 20260827133253.png|542]]

Hard-margin SVM은 선형분리 가능한 데이터에서 가장 넓은 margin을 찾습니다.

$$
\boxed{ \min_{w,b}\frac12\lVert w\rVert^2 }
$$

subject to

$$
\boxed{ y_i(w^\top x_i+b)\geq1, \qquad i=1,\ldots,n. }
$$

왜 $\lVert w\rVert^2$를 최소화할까?
전체 margin 폭은

$$
\frac{2}{\lVert w\rVert}
$$

이기 때문이다.
따라서:

$$
\lVert w\rVert\downarrow \quad\Longrightarrow\quad \frac{2}{\lVert w\rVert}\uparrow.
$$

즉,

$$
\min\frac12\lVert w\rVert^2
$$

는 margin을 최대화하는 것과 같다.

제약조건

$$
y_i(w^\top x_i+b)\geq1
$$

은 다음을 동시에 요구한다.

- 모든 점을 올바르게 분류
- 모든 점을 margin 안쪽이 아니라 margin 위 또는 바깥에 배치

Lagrangian의 표준형에 맞추기 위해 다음처럼 바꾼다, 즉 데이터 포인트 하나하나가 이런식으로 표현된다고 생각하면 된다 (오분류를 허용하지 않음)

$$
\boxed{ 1-y_i(w^\top x_i+b)\leq0. }
$$

#### 2단계 Lagrangian과 KKT 조건 

각 데이터의 제약조건에 $\lambda_i\geq0$를 붙인다.

$$
\boxed{ \mathcal L(w,b,\lambda) = \frac12\lVert w\rVert^2 + \sum_{i=1}^{n} \lambda_i \left[ 1-y_i(w^\top x_i+b) \right]. }
$$

직관적으로 $\lambda_i$는 다음을 나타낸다.
$i$번째 데이터의 제약조건이 최종 경계를 결정하는 데 얼마나 관여하는가? -> 식을 보면 제약조건의 가중치의 역할을 한다.

KKT 조건 4가지

 ① Primal feasibility
원래 SVM 제약조건을 만족해야 한다.

$$
1-y_i(w^\top x_i+b)\leq0.
$$

② Dual feasibility

$$
\lambda_i\geq0.
$$

③ Complementary slackness

$$
\boxed{ \lambda_i \left[ 1-y_i(w^\top x_i+b) \right]=0. }
$$

 ④ Stationarity

$$
\nabla_{w,b}\mathcal L=0.
$$

Complementary slackness의 직관

두 항의 곱이 0이므로 적어도 하나가 0이어야 한다.
Margin 밖에 있는 점

$$
y_i(w^\top x_i+b)>1
$$

이면

$$
1-y_i(w^\top x_i+b)<0.
$$

따라서 곱을 0으로 만들려면

$$
\lambda_i=0
$$

이어야 합니다. 이 점은 $w$에 직접 기여하지 않는다.

$\lambda_i>0$인 점

$$
\lambda_i>0
$$

이면 반드시

$$
1-y_i(w^\top x_i+b)=0,
$$

따라서

$$
y_i(w^\top x_i+b)=1.
$$

즉, margin boundary 위에 있는 support vector이다. 

꽤 놀랍지 않은가. 람다 라는 변수를 추가해서 우린 서포트 벡터를 추정할수 있다. 이런 Dual 의 특성으로 인해 해당 function 을 사용하는거다

#### 3단계: Stationarity로 $w,b$ 제거

이 단계의 목적은 $w,b$를 직접 계산하는 것이 아니다.

$$
\boxed{ w,b\text{를 }\lambda\text{로 표현하거나 dual에서 제거한다.} }
$$

$w$에 대해 미분
Lagrangian을 펼치면

$$
\mathcal L = \frac12w^\top w +\sum_i\lambda_i -\sum_i\lambda_i y_iw^\top x_i -\sum_i\lambda_i y_ib.
$$

**$w$로 미분하면**

$$
\nabla_w\mathcal L = w-\sum_i\lambda_i y_ix_i.
$$

Stationarity 조건에 의해

$$
w-\sum_i\lambda_i y_ix_i=0.
$$

따라서

$$
\boxed{ w=\sum_{i=1}^{n}\lambda_i y_ix_i. }
$$

이 식의 중요한 의미
최적 $w$는 훈련 데이터의 선형결합이다.

$$
w = \lambda_1y_1x_1+ \lambda_2y_2x_2+ \lambda_3y_3x_3.
$$

예를 들어 $\lambda_3=0$이면

$$
w=\lambda_1y_1x_1+\lambda_2y_2x_2.
$$

즉, $x_3$은 최종 경계 방향에 직접 기여하지 않는다.

**$b$에 대해 미분**

$$
\frac{\partial\mathcal L}{\partial b} = -\sum_i\lambda_i y_i.
$$

Stationarity를 적용하면

$$
\boxed{ \sum_{i=1}^{n}\lambda_i y_i=0. }
$$

이 식은 $b$의 값을 주는 것이 아니다. $b$가 dual 목적함수에서 사라지도록 하면서, 대신 $\lambda$가 만족해야 하는 제약조건을 준다.

따라서 이미지의 “$w,b$ 제거”를 정확히 말하면:

- $w$: $\lambda$의 함수로 표현
- $b$: 새로운 equality constraint를 남기고 제거

입니다. 그리고 이는 최종장에 가까워지는 4단계의 주요 재료로 사용된다 

#### 4단계: 결과를 대입해 dual function 계산

앞에서 구한

$$
w=\sum_i\lambda_i y_ix_i
$$

와

$$
\sum_i\lambda_i y_i=0
$$

를 Lagrangian에 대입한다.

먼저

$$
\frac12w^\top w = \frac12 \left( \sum_i\lambda_i y_ix_i \right)^\top \left( \sum_j\lambda_j y_jx_j \right).
$$

전개하면

$$
\frac12w^\top w = \frac12 \sum_i\sum_j \lambda_i\lambda_jy_iy_jx_i^\top x_j.
$$

나머지 항과 정리하면 dual function은

$$
\boxed{ q(\lambda) = \sum_{i=1}^{n}\lambda_i - \frac12 \sum_{i=1}^{n}\sum_{j=1}^{n} \lambda_i\lambda_jy_iy_jx_i^\top x_j. }
$$

여기서 가장 중요한 관찰

원래 있던 $w,b$가 사라졌다.
그리고 데이터는 오직

$$
\boxed{x_i^\top x_j}
$$

라는 내적 형태로만 등장하게 된다. 앞서 말한 그 모든 여정의 가장 큰 체크포인트가 바로 이 부분이다. 해당 결과를 꼭 기억하자! 미리 이야기 하자면 x 에 고차원 mapping 함수를 붙일때 어떤 식으로 계산 되는지를 볼것이다. 

일단 다음 항목은 dual problem 을 만들고 이를 통해 람다를 구한뒤 다시 primal 의 파라미터를 추정할것이다. 

#### 5단계: Dual constraints를 붙여 dual problem 완성

Dual function을 최대화하되, 앞에서 얻은 제약조건을 붙입니다.

$$
\boxed{ \max_{\lambda} \left[ \sum_{i=1}^{n}\lambda_i - \frac12 \sum_{i=1}^{n}\sum_{j=1}^{n} \lambda_i\lambda_jy_iy_jx_i^\top x_j \right] }
$$

subject to

$$
\boxed{ \lambda_i\geq0, \qquad \sum_{i=1}^{n}\lambda_i y_i=0. }
$$

이제 찾는 대상이 바뀌었습니다.

- Primal: feature별 weight $w$를 찾음
- Dual: 데이터별 coefficient $\lambda_i$를 찾음

Dual 문제를 풀어

$$
\lambda_1^*,\ldots,\lambda_n^*
$$

를 얻습니다.

SVM은 convex problem이므로 strong duality 조건 아래 dual의 최적해를 통해 primal 최적해도 복원할 수 있다. 아래는 그 과정이다. 

#### 6단계: $\lambda^*$로 $w^*,b^*$ 복원

 $w^*$ 복원

앞에서 이미 람다를 얻었기 때문에 우리가 알던 가중치 식에 새로운 람다를 넣으면 된다

$$
w=\sum_i\lambda_i y_ix_i
$$

또한 $\lambda_i^*=0$인 항은 사라지므로 support vector만 남겨지게 되며 아래와 같은 식 

$$
w^* = \sum_{i\in\mathrm{SV}} \lambda_i^*y_ix_i
$$

으로 쓸 수 있다.

$b^*$ 복원
Hard-margin support vector $x_j$에서는

$$
y_j\left((w^*)^\top x_j+b^*\right)=1.
$$

$y_j\in\{-1,+1\}$이므로 $y_j^{-1}=y_j$이다. 따라서 다음과 같이 전개가 가능하며

$$
(w^*)^\top x_j+b^*=y_j.
$$

b 를 왼쪽으로 옮겨 더 깔끔하게 표현 한뒤 

$$
b^*=y_j-(w^*)^\top x_j.
$$

앞서구한 $w^*$를 대입하면 다음과 같다

$$
\boxed{ b^* = y_j- \sum_{i=1}^{n} \lambda_i^*y_ix_i^\top x_j. }
$$

수치오차를 줄이기 위해 여러 적절한 support vector에서 계산한 $b$를 평균내기도 한다.

#### 7단계: 새로운 데이터 예측

새로운 데이터 $x_{\mathrm{new}}$의 score는 아래처럼 표현할수 있다

$$
s(x_{\mathrm{new}}) = (w^*)^\top x_{\mathrm{new}}+b^*.
$$

6과정에서 구한 $w^*$를 대입하면 다음식을 얻을수 있다

$$
\begin{aligned} s(x_{\mathrm{new}}) &= \left( \sum_i\lambda_i^*y_ix_i \right)^\top x_{\mathrm{new}}+b^*\\ &= \sum_i \lambda_i^*y_i x_i^\top x_{\mathrm{new}} +b^*. \end{aligned}
$$

따라서 예측은 다음과 같으며, 우린 새롭게 들어온 데이터가 어떻게 분류되는지를 알수 있다. 

$$
\boxed{ \hat y = \operatorname{sign} \left( \sum_{i\in\mathrm{SV}} \lambda_i^*y_i x_i^\top x_{\mathrm{new}} +b^* \right). }
$$

이렇게 Primal 문제를 Dual 로 바꾸어서 어떻게 풀고, 새로운 데이터를 어떻게 처리하는지를 알아보았다. 그리고 그 과정속에서 Dual 람다 값의 특징과 데이터를 내적으로만 표현하는 방법을 알았으며, 내적 표현 방식은 앞으로 우리가 배울 커널과 밀접하게 연결된다는 것 또한 알았다. 

드디어 커널트릭, 고차원 처리에 대해 알아보자

### 커널 트릭

일단 motivation 으로 돌아오자

![[Pasted image 20260827135614.png]]

위에서 바라보면 이런 모양일거다 

![[Pasted image 20260827172317.png|290]]

저차원에서 해결하지 못하는 문제를 고차원으로 보내 해결한다는 아이디어 말이다. 

고차원으로 보내기 위해서는 고차원 변환 함수를 거치면 된다. 그리고 변환된 고차원에서 초평면으로 갈라버리면 된다. 

근데 이는 치명적인 문제를 동반한다. 차원이 늘어나면 계산해야할 양이 지수적으로 증가하게 된다. 이를  차원의 저주라고 부른다. 그리고 우린 이 문제를 커널로 피해갈거다.  

Dual 문제로 바꾼 SVM 을 보자

![[Pasted image 20260827140121.png]]

Dual의 훈련과 예측식을 다시 보면 모든 데이터가 내적으로 등장합니다.

우린 여기다 그냥 고차원 공간을 바로 넣어버릴거다 x 대신에 $\phi(x)$ 를 넣어버리면 된다 

$x_i^\top x_j \quad\longrightarrow\quad \phi(x_i)^\top\phi(x_j)$

$K(x_i,x_j) = \phi(x_i)^\top\phi(x_j).$ 의 형태를 가지게 되고 이게 커널 함수 자체이다. 고차원을 서로 곱하는 형태이지만 걱정할거 없다. 

예측식은

$$
s(x) = b^* +\sum_{i=1}^{n} \lambda_i^*y_i \phi(x_i)^\top\phi(x)
$$

가 된다

중학교때 사용할 분배법칙을 생각해보자 
다음과 같은 고차원 좌표 하나가 있다 (3차원)

$$
\phi(x)= \begin{bmatrix} x^2\\ \sqrt{2c}\,x\\ c \end{bmatrix}.
$$

두 점 $u,v$를 변환해 내적하면

$$
\begin{aligned} \phi(u)^\top\phi(v) &=u^2v^2+2cuv+c^2\\ &=(uv+c)^2. \end{aligned}
$$

따라서 모든 변환 좌표를 계산하지 않고

$$
\boxed{K(u,v)=(uv+c)^2}
$$

만 계산해도 완전히 같은 결과를 얻을수 있다. 즉 우린 고차원 계산을 직접 할필요가 없다. 따라서 계산 효율성은 챙기면서 고차원 문제를 손쉽게 해결할수 있는거다. 이를 커널 트릭이라 하며 오늘 배움의 종착역이다. (이 방식 하나면 매우 높은 고차원의 $\phi$를 직접 계산하지 않아도 된다 n차원 계산의 편리함)

전체 연결은 다음 한 줄로 정리된다.

$$
\boxed{ x_i^\top x_j \longrightarrow \phi(x_i)^\top\phi(x_j) \longrightarrow K(x_i,x_j) }
$$

그리고 이렇게 커널함수가 적용된 SVM 을 Kernel SVM 이라고 한다. 

#### 실질적으로 계산을 얼마나 줄인건가 

원래 feature가 100개인 데이터에서 선형분리할 수 없는 비선형 문제를 더 높은 특징공간으로 보내 SVM으로 해결한다고 하자.

원래 데이터 하나는

$$
x_i\in\mathbb R^{100}
$$

이다.

비선형 경계를 표현하기 위해 원래 feature들의 거듭제곱과 곱 조합으로 이루어진 polynomial feature를 degree 3까지 만든다고 하자.

예를 들면 다음과 같은 feature들이다.

$$
1,\quad x_1,\quad x_1x_2,\quad x_1^2,\quad x_1x_2x_3,\quad x_1^3,\ldots
$$

상수항부터 degree 3까지 가능한 polynomial feature를 모두 만들면 변환 후 feature 수는

$$
d_{\text{mapped}} = \binom{100+3}{3} = 176{,}851
$$

176851 개가 된다. (176851 차원)

따라서 변환은

$$
x_i\in\mathbb R^{100} \longrightarrow \phi(x_i)\in\mathbb R^{176{,}851}
$$

이 된다.

Kernel을 사용하지 않고 이 변환을 직접 수행하면 데이터 하나에 대해 176,851개의 feature를 계산하고 저장해야 한다. 따라서 데이터 하나의 변환 비용은 대략

$$
O(d_{\text{mapped}}) = O(176{,}851)
$$

이고, 훈련 데이터가 $N$개라면 전체 데이터를 변환하는 비용은

$$
O(Nd_{\text{mapped}}) = O(N\cdot176{,}851)
$$

이다.

SVM dual에서 모든 데이터 쌍의 내적이 필요하다고 하자. 데이터가 $N$개이면 비교할 데이터 쌍은 대략 $N^2$개이고, 데이터 쌍 하나마다 176,851차원 내적을 계산해야 한다.

따라서 모든 데이터 쌍의 고차원 내적을 직접 계산하는 비용은

$$
O(N^2d_{\text{mapped}}) = O(N^2\cdot176{,}851)
$$

이다.

Polynomial kernel을 사용하면 176,851개의 feature를 실제로 만들지 않는다. 대신 데이터 쌍 $(x_i,x_j)$마다

$$
K(x_i,x_j) = (x_i^\top x_j+c)^3
$$

을 직접 계산한다.

원래 데이터는 100차원이므로

$$
x_i^\top x_j
$$

를 계산하는 비용은

$$
O(d_{\text{original}}) = O(100)
$$

이다.

따라서 모든 데이터 쌍의 kernel 값을 계산하는 비용은

$$
O(N^2d_{\text{original}}) = O(N^2\cdot100)
$$

이다.

결국 pairwise inner product 계산은

$$
O(N^2\cdot176{,}851)
$$

에서

$$
O(N^2\cdot100)
$$

으로 줄어든다.

즉, kernel trick은 176,851차원의 polynomial feature를 실제로 생성하지 않고도, 그 고차원 공간에서 내적한 것과 정확히 같은 값을 원래 100차원 데이터로 계산한다.

하지만 kernel trick을 사용해도 $N$개 데이터 사이의 kernel matrix

$$
K\in\mathbb R^{N\times N}
$$

를 만들어야 한다. 따라서 kernel matrix를 저장하는 데

$$
O(N^2)
$$

메모리가 필요하고, 계산에도 최소한 $N^2$개의 데이터 쌍을 처리해야 한다.

따라서 $N$이 매우 큰 데이터에서는 kernel method가 계산과 메모리 측면에서 부담스러울 수 있다.

이러한 $N^2$ 확장성 문제와 사람이 kernel을 미리 선택해야 한다는 한계 때문에, 대규모 데이터에서는 mini-batch 학습이 가능하고 특징표현 자체를 학습하는 neural network와 deep learning이 더 실용적인 선택이 되는 경우가 많아졌다. -> 차후에 배울 내용

### Kernel Modular Learning 

축하한다. 여러분은 방금 데이터 세계의 영역전개에 대해 배웠다. 앞으로 고차원의 저주를 피하고 새롭게 만들어진 커널 공간에서 이것저것 해볼수 있다. 

주술회전에서도 다양한 영역이 있듯 커널도 종류가 다양하다. 또 해당 커널 안에서 작동시킬 모델도 고를수 가 있다. 따라서 커널은 Modular 의 역할을 하기에 그 작동 원리를 좀더 파볼필요가 있다 

앞으로 다룰 질문은 다음과 같다 

1. 어떤 알고리즘을 kernel 로 풀수 있는가 - Representer theorem
2. 커널 공간은 어떻게 만들수 있는가, 대표적으로 사용되는 커널엔 무엇이 있는가
3. 만들어진 커널은 사용가능한 올바른 커널인가 -Mercer/PSD 조건

### 어떤 알고리즘을 kernel 로 풀수 있는가 - Representer theorem

우리는 이미 답을 알고있다. 데이터가 내적 형태로 변환 가능한 알고리즘은 kernel 로 풀수 있다 

하지만 어떤 알고리즘은 내적 형태가 명확히 보이지 않는다 이때 Representer theorem 을 사용하는거다 (구체적인 사용방법은 여기서 다루지 않는다)

### 대표적으로 사용되는 커널엔 무엇이 있는가

대표적으로 사용되는 커널로는 Polynomial kernel 이 있다 
Polynomial kernel은

앞서 본 예시에도 언급된 방식이다. 전체 degree가 2가 되는 가능한 모든 곱 조합을 만드는거다.

$x= \begin{bmatrix} x_1\\ x_2 \end{bmatrix}$ 가 있다면 

$x_1^2,\qquad x_2^2$ $x_1^2,\qquad x_1x_2,\qquad x_2^2.$ 이런걸 가능한 모든 조합을 만들어 내면 그만큼 차원이 확장 되고 이걸 내적 형태로 계산하면 그게 Polynomial kernel 이다 

영역전개에도 무량공처가 있듯 커널에도 비슷한게 있다 

RBF/Gaussian kernel 이다. 

$$
K(x,z) = \exp\left( -\gamma\lVert x-z\rVert^2 \right), \qquad \gamma>0.
$$

Polynomial kernel이 원래 feature들의 제곱과 곱 조합을 새로운 feature로 추가했다면, RBF kernel은 조금 더 극단적이다.

Polynomial kernel은 degree를 정한다.

예를 들어 degree 2라면

$$
x_1^2,\qquad x_1x_2,\qquad x_2^2
$$

처럼 2차항까지 사용하고, degree 3이라면

$$
x_1^3,\qquad x_1^2x_2,\qquad x_1x_2^2,\qquad x_2^3
$$

같은 3차항을 사용한다.

반면 RBF kernel은 특정 degree에서 멈추지 않는다.

$$
1,\quad x,\quad x^2,\quad x^3,\quad x^4,\quad\ldots
$$

처럼 모든 degree의 polynomial feature를 끝없이 포함하는 무한 차원 특징공간에 대응한다.

물론 이 무한히 많은 feature를 실제로 계산하거나 저장하는 것은 아니다. RBF kernel 함수

$$
K(x,z) = \exp\left( -\gamma\lVert x-z\rVert^2 \right)
$$

만 계산해 무한 차원 공간에서의 내적과 같은 값을 얻는다.

어떻게 무한 차원 feature가 들어 있는가?

설명을 단순하게 하기 위해 $x,z$가 숫자 하나인 1차원 데이터라고 하자.

$$
K(x,z) = \exp\left( -\gamma(x-z)^2 \right).
$$

제곱을 전개하면

$$
(x-z)^2=x^2-2xz+z^2
$$

이므로

$$
\begin{aligned} K(x,z) &= \exp(-\gamma x^2) \exp(2\gamma xz) \exp(-\gamma z^2). \end{aligned}
$$

여기서 exponential 함수는 다음과 같이 무한히 전개할 수 있다.

$$
e^t = 1+t+\frac{t^2}{2!}+\frac{t^3}{3!}+\cdots.
$$

따라서

$$
\exp(2\gamma xz) = 1 + 2\gamma xz + \frac{(2\gamma xz)^2}{2!} + \frac{(2\gamma xz)^3}{3!} +\cdots.
$$

식을 자세히 보면

$$
xz,\qquad x^2z^2,\qquad x^3z^3,\qquad\ldots
$$

처럼 모든 차수의 항이 끝없이 등장한다.

이는 RBF kernel이 암묵적으로

$$
1,\quad x,\quad x^2,\quad x^3,\quad\ldots
$$

같은 무한히 많은 feature를 사용한다는 뜻이다.

RBF kernel에 대응하는 한 가지 가능한 mapping을 명시적으로 쓰면 다음과 비슷하다.

$$
\phi(x) = e^{-\gamma x^2} \begin{bmatrix} 1\\[3pt] \sqrt{2\gamma}\,x\\[3pt] \sqrt{\dfrac{(2\gamma)^2}{2!}}x^2\\[3pt] \sqrt{\dfrac{(2\gamma)^3}{3!}}x^3\\ \vdots \end{bmatrix}.
$$

하지만 실제로는 이 무한 차원 벡터를 만들지 않는다.

그 대신

$$
\phi(x)^\top\phi(z)
$$

와 같은 값을 다음 한 번의 kernel 계산으로 얻는다.

$$
K(x,z) = \exp\left( -\gamma\lVert x-z\rVert^2 \right).
$$

이게 왜 사기냐면 polinomial 의 경우 degree 만큼 곡선 표현이 가능하지만 

![[Pasted image 20260827151320.png|497]]

가우시안의 경우 차원이 무한이기에 충분한 데이터와 적절한 설정값이 있다면 매우 넓은 범위의 연속적인 함수를 원하는 만큼 가깝게 근사할 수 있다는 뜻이다. 이를 Gaussian kernel의 universal approximation 성질이라고 한다. (당연히 fine 하게 그릴수록 over fitting 문제가 있다) 

이외에도 하이퍼볼릭 탄젠트 등등 다양한 커널의 종류가 있다 

다행히도 똑똑한 사람들이 어떤 문제에 어떤 커널을 써야하는지 정리를 해 놓은게 있다 

| 문제            | 대표적인 모델           |
| ------------- | ----------------- |
| 비선형 분류        | RBF-SVC           |
| 고차원·희소 데이터 분류 | Linear SVC        |
| 비선형 회귀        | RBF-SVR           |
| 부드러운 비선형 회귀   | Kernel Ridge      |
| 비지도 이상치 탐지    | RBF One-Class SVM |
| 불확실성까지 필요한 회귀 | Gaussian Process  |
| 비선형 차원 축소     | Kernel PCA        |
|               |                   |

이뿐만이 아니다 직접 커널을 만들 수도 있다. 그렇다고 아무 유사도 함수나 kernel로 사용할 수 있는 것은 아니다. 새로 만든 함수가 실제 feature 공간에서의 내적처럼 작동해야 한다.

다행히 이미 valid하다고 알려진 kernel들을 일정한 규칙에 따라 조합하면, 새로 만든 함수도 valid kernel임이 보장된다.

$K_1$과 $K_2$가 valid kernel이고 $c>0$이면 다음 함수들도 valid kernel이다.

$$
K(u,v)=K_1(u,v)+K_2(u,v)
$$

$$
K(u,v)=K_1(u,v)K_2(u,v)
$$

$$
K(u,v)=cK_1(u,v)
$$

$$
K(u,v)=f(u)K_1(u,v)f(v)
$$

이러한 성질을 kernel의 closure property라고 한다. 이미 valid한 kernel에 특정 연산을 적용해도 valid kernel 집합 안에 그대로 남는다는 뜻이다.

예를 들어 linear kernel과 degree-2 polynomial kernel을 더해

$$
K(u,v) = u^\top v+(u^\top v+1)^2
$$

라는 새로운 kernel을 만들 수 있다.

### 만들어진 커널은 사용가능한 올바른 커널인가 - Mercer/PSD 조건

함수 $K(u,v)$가 정말 kernel인지 확인하고 싶다.

데이터 $x_1,\ldots,x_n$에 대해 Gram/kernel matrix를 만든다.

$$
M_{ij}=K(x_i,x_j).
$$

모든 데이터 집합에 대해 $M$이 positive semidefinite라면 valid kernel이다.

PSD의 계산식은

$$
\boxed{ a^\top Ma\geq0 \quad\text{for every }a\in\mathbb R^n }
$$

이다.

왜냐하면 kernel이 내적이라면

$$
\begin{aligned} a^\top Ma &=\sum_i\sum_j a_ia_j \phi(x_i)^\top\phi(x_j)\\ &= \left\lVert \sum_i a_i\phi(x_i) \right\rVert^2\\ &\geq0. \end{aligned}
$$

즉, PSD 조건은 “이 함수가 실제로 어떤 공간의 내적처럼 행동하는가?”를 검사하는것이다. -> 걍 내적 되는지를 보는거라고 쉽게 생각해도 된다

예를 들어 함수를 다음과 같이 정하겠습니다.

$$
K(u,v)=uv
$$

1차원 데이터 세 개를 선택합니다.

$$
x_1=1,\qquad x_2=2,\qquad x_3=3
$$

Gram matrix의 각 원소는

$$
M_{ij}=K(x_i,x_j)=x_ix_j
$$

이므로,

$$
M= \begin{bmatrix} 1\cdot1 & 1\cdot2 & 1\cdot3\\ 2\cdot1 & 2\cdot2 & 2\cdot3\\ 3\cdot1 & 3\cdot2 & 3\cdot3 \end{bmatrix} = \begin{bmatrix} 1&2&3\\ 2&4&6\\ 3&6&9 \end{bmatrix}
$$

이제 임의의 계수 벡터를 놓는다.

$$
a= \begin{bmatrix} a_1\\a_2\\a_3 \end{bmatrix}
$$

그러면

$$
\begin{aligned} a^\top Ma &= a_1^2+4a_1a_2+6a_1a_3 +4a_2^2+12a_2a_3+9a_3^2\\ &= (a_1+2a_2+3a_3)^2\\ &\geq0 \end{aligned}
$$

어떤 $a_1,a_2,a_3$를 넣어도 제곱이므로 음수가 될 수 없다.

앞서본 valid 한 커널을 합쳐 만든 커널의 경우 또한 유효하다, 요소들 하나하나 가 다 vaild 하면 합친 결과물도 vaild 하기 때문이다

### (추가)커널은 벡터만 가능한가? 

커널의 입력은 반드시 고정 길이 숫자 벡터일 필요가 없다. 

- 문자열
- 트리
- 그래프
- 문장
- 생물학적 sequence

등에도 두 객체 사이의 kernel을 정의할 수 있다. 왜 그럴까? kernel이 실제로 요구하는 것은 **입력의 좌표 자체가 아니라 두 입력 사이의 내적값**이기 때문이다. 변환된 결과 $\phi(x)$가 어떤 feature 공간의 벡터이기만 하면 된다. 문장 같은것도 그냥 TF-IDF 벡터로 변환하면 일반적인 벡터용 kernel을 적용할 수 있습니다.

실제로 자연어 처리에서 문서가 서로 비선형 관계를 가질때 이들을 구분하기 위해 문서를 TF-IDF 로 벡터변환하고 RBF kernel 이나  Polynomial kernel 적용시켜서 비선형 경계를 그려볼수 있다. 

### Wrap-up

오늘 다룬 커널과 Kernel SVM의 핵심 흐름은 다음 세 가지로 압축할 수 있다. 

* **왜 듀얼인가?** SVM Primal 문제를 라그랑지안과 KKT 조건으로 전개하여 Dual 문제로 변환하면, 목적함수와 예측식이 오직 데이터의 **내적($x_i^\top x_j$)** 형태로만 표현된다. 

* **커널 트릭의 본질:** 내적 자리에 커널 함수 $K(x_i, x_j)$를 대입함으로써, 수십만 차원(또는 무한 차원)으로의 고차원 매핑 $\phi(x)$를 직접 계산하지 않고도 $O(d_{\text{original}})$의 비용으로 고차원 분리 평면을 학습한다. 

* **모듈러 확장과 조건:** RBF, Polynomial 등 다양한 커널 함수를 모듈처럼 교체해 사용할 수 있으며, Gram 행렬이 **반양의정치(PSD, $a^\top M a \ge 0$)**를 만족하기만 하면 텍스트나 그래프 같은 비정형 데이터까지 손쉽게 영역을 전개해 비선형 경계를 그릴 수 있다. 

$$
\boxed{ \text{저차원 비선형 문제} \xrightarrow{\text{Dual 내적 변환}} x_i^\top x_j \xrightarrow{\text{Kernel Trick}} K(x_i, x_j) \xrightarrow{\text{고차원 연산 생략}} \text{비선형 분리 완성} }
$$

커널 방법론은 데이터 공간을 확장해 문제를 단순화하는 가장 우아한 수학적 오의다. 비록 $O(N^2)$의 메모리·연산 한계로 인해 대규모 데이터에서는 딥러닝에 자리를 넘겨주었지만, 데이터가 적고 명확한 전역 최적해(Global Optimum)와 수학적 보장이 필요한 문제에서는 여전히 가장 강력한 머신러닝 무기 중 하나다.

## 관련 글

<!-- AUTO-RELATED:START -->
- [[PCA 이해하기]]
- [[Ridge, Lasso와 Overfitting]]
- [[MLE는 신이에요]]
<!-- AUTO-RELATED:END -->

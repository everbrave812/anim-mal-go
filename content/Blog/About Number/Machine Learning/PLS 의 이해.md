---
title: PLS 의 이해
description: "NIR 스펙트럼으로 혈중 알코올 농도를 예측하는 예시를 통해 PLS의 차원 축소 원리를 설명한다. 목표변수와의 공분산으로 성분을 만드는 과정과 PCR의 차이, 성분 간 직교 조건을 살펴본다."
date: 2026-09-05
publish: true
---
# Motivation

![[Pasted image 20260904173741.png|416]]

NIR 파장 분석기기 라는게 있다. 근적외선 영역의 빛을 시료에 쏘면 쪼개어 흡수되거나 반사되는 파장을 측정해 물질을 이루고 있는 성분을 분석이 가능하다. 

예를 들어 혈중 알코올 농도는 얼마인지, 스포츠 선수의 도핑 분석등 여러 분야에서 활발히 사용중이다. 

갑자기 왜 이런 이야기를 하냐면 오늘 배울 내용이 해당 기기에서 얻은 데이터와 밀접히 연관되어 있기 때문이다. 

사람 혈액에서 혈중 알코올 농도를 예측하는 프로그램을 만든다고 생각해보자 

우린 앞으로 NIR 로 측정된 데이터를 받을거고, 해당 데이터를 기반으로 혈중 알코올 농도를 예측해야 한다. 

![[Pasted image 20260905002136.png|381]]

사람 혈액의 55% 가 혈장으로 이루어져 있고 그중 대부분은 물이다. 그외 너무 다양한 구성요소들이 있다. 
어마어마 하게 많은 구성 요소들중 우리가 궁금한건 알코올 농도 하나이다. 

예측을 해야하니 회귀모델을 사용할거다. 

알코올 을 제외한 구성요소 하나하나를 설명변수라고 생각해보면. 아마 수십 또는 그 이상의 차원이 있을거다. 당연히 이렇게 많은 차원이 있으면 서로 상관된 변수들이 생긴다.

여기서 한 가지 짚고 넘어가자. 변수들이 상관되어 있다는 사실만으로 회귀가 불가능해지는 것은 아니다.

- $p>n$ 이거나 일부 NIR 파장이 다른 파장들의 **정확한 선형결합**이면 $\mathbf X^T\mathbf X$ 의 역행렬이 존재하지 않는다.
- 역행렬이 존재하더라도 인접 파장들이 매우 강하게 상관되면(근사 공선성) 회귀계수의 분산이 커져 추정과 예측이 불안정해진다.

NIR 스펙트럼은 파장이 수백 개인데다 인접 파장끼리 거의 같은 정보를 담고 있어 두 문제를 모두 안고 있다. 따라서 원래 $p$ 개의 파장을 그대로 사용하는 대신, 소수의 성분으로 차원을 축소한 뒤 회귀하는 방법을 고려하게 된다.

그 첫 후보가 PCA 를 이용한 회귀분석, 즉 PCR 이다.

$$
X_i=(X_{i1},X_{i2},\ldots,X_{ip})^T
$$

- $X_{ij}$ : 시료 $i$ 의 $j$ 번째 파장에서 측정한 NIR 신호
- $p$ : 측정한 파장 개수, 예를 들어 $p=500$
- $Z_i$ : 기준 분석법으로 측정한 실제 혈중 알코올 농도

$X$ 와 $Z$ 가 중심화되었다고 가정하면 회귀모형은

$$
Z=m(X)+\varepsilon, \qquad m(x)=E(Z\mid X=x)=\beta^Tx=\sum_{j=1}^{p}\beta_jx_j
$$

로 나타낼 수 있다.

이게 잘 작동할까..? 슬프게도 잘 작동하지 않는다. 우리의 문제는 단순히 차원을 줄이는게 아니다. $Z$ = 알코올 농도 가 확실하게 정해져 있는 상태이다. 

결국 우리가 원하는건 NIR 스펙트럼 자체를 잘 요약하는게 아니라, '어떤 변수가 알코올 농도와 같이 움직이는가' 가 궁금한거다. 

이런 문제를 해결하기 위해 등장한게 바로 PLS 이다. 

# Goal

- **describe / list** → PLS 가 무엇이며, 무엇을 위해 쓰는가
- **explain** → PLS 는 어떻게 작동하는가 (알고리즘)
- **compare / contrast** → PCR 과 PLS 는 어떻게 다른가
- **calculate** → PLS 알고리즘을 손계산 할수 있는가?
- **evaluate** → 최종, 그리고 과정에 있어 나온 결과물을 해석할수 있는가? 

# 목차

1. PLS의 아이디어
2. 첫번째 PLS 성분 계산 방법 
3. 두번째 PLS 성분 계산 방법 
4. PLS 성분을 이용한 저차원 회귀 
5. PLS 회귀계수 추정 
6. 교차검증으로 q 선택
7. 전체 알고리즘 
8. 표기와 해석에서 주의할 점 (ESL Algorithm 3.3 연결)
9. PLS의 확장과 PCR 과의 최종 비교
10. 실제 계산

# 본문

## PLS의 아이디어

앞서 말했듯 우리가 궁금한건 NIR 스펙트럼 자체를 잘 요약하는게 아니라, '어떤 변수가 알코올 농도와 같이 움직이는가' 가 궁금한거다. 

같이 움직인다는 개념은 통계적으로 어떻게 계산할수 있을까? 

우린 이미 기초통계때 배웠다. 

Correlation 이 해당 역할을 할수 있다 

![[Pasted image 20260904180733.png]]

그렇다면 직관적으로 
알코올 농도와 나머지 변수들의 Cov 를 계산하여 

$$
\operatorname{Cov}(Z,X_j)
$$

높은 Cov 를 가진 변수들만 가지고 회귀를 해보는 생각을 해볼수 있다 

회귀의 목적은 $X$ 를 잘 재구성하는 것이 아니라 $Z$ 를 잘 예측하는 것이다.

## 첫번째 PLS 성분 계산 방법 

결국 PLS 라는건 차원을 축소하는 방법이다. 따라서 PCA 처럼 축을 만들어야 한다. 

![[Pasted image 20260904182221.png|335]]

PCA 는 설명변수 $X$ 를 어떤 방향으로 직교투영하고, 투영값의 분산이 최대가 되도록 방향을 선택한다. 그 결과 선택된 방향이 $X$ 의 공분산행렬의 가장 큰 고유값에 대응하는 고유벡터가 된다.

그렇다면 PLS 는 어떻게 투영을 시켜 축을 만들어 내는걸까? 

PCA의 투영방향이 Gamma 였듯 PLS 의 투영방향을 phi 이다. PCA 는 투영방향을 투영값의 분산이 최대화 하기 위한 방향으로 진행했다. PLS 는 투영값과 타겟변수간의 공분산을 최대화 시키는게 목표다. 수식적으로 정리하면 

첫 번째 PLS 성분은

$$
T_1=\phi_1^TX
$$

이며 $\|\phi_1\|=1$ 이라는 조건에서

$$
\left|\operatorname{Cov}(Z,T_1)\right|
$$

을 최대화하도록 $\phi_1$ 을 선택하는거다. 즉 

$$
\phi_1 = \arg\max_{\|\phi\|=1} \left| \operatorname{Cov}(Z,\phi^TX) \right|
$$

이 최종 목적함수가 된다. 

이를 NIR 파장분석으로 설명해보면 

$$
\phi_1=(\phi_{11},\ldots,\phi_{1p})^T
$$

는 파장별(변수별) 가중치가 될것이다. 따라서

$$
T_1 = \phi_{11}X_1+\cdots+\phi_{1p}X_p
$$

알코올 농도와 관련된 파장에는 상대적으로 큰 가중치가 주어지고, 관련성이 약한 파장에는 작은 가중치가 주어진다.

그리고 $T_1$ 은 수백 개의 NIR 측정값과 가중치를 곱한 벡터를 하나의 스칼라로 압축한 것이다.

> $T_1$ 은 NIR 스펙트럼에서 혈중 알코올 농도와 가장 강하게 함께 움직이는 방향이다.

PCR 과 비교하면 다음과 같다.

| 방법  | 투영              | 최적화 기준                                     | 선택되는 방향                        |
| --- | --------------- | ------------------------------------------ | ------------------------------ |
| PCA | $Y=\gamma^TX$ | $\operatorname{Var}(Y)$ 최대               | $\Sigma_X$ 의 고유벡터             |
| PLS | $T=\phi^TX$   | $\lvert\operatorname{Cov}(Z,T)\rvert$ 최대 | $\operatorname{Cov}(X,Z)$ 방향 |

### 왜 해당 가중치가 최적인가

첫 번째 성분만 놓고 보면

$$
T_1=\phi_1^TX
$$

이고 PLS는

$$
\max_{\|\phi_1\|=1} \left| \operatorname{Cov}(Z,T_1) \right|
$$

을 풀고 싶어 한다.

중심화된 표본에서

$$
\widehat{\operatorname{Cov}}(Z,T_1) \propto \widetilde{\mathbf Z}^T \widetilde{\mathbf X}\phi_1
$$

여기서

$$
\mathbf c_1 = \widetilde{\mathbf X}^T\widetilde{\mathbf Z}
$$

라고 두면 목적함수는

$$
|\mathbf c_1^T\phi_1|
$$

이 된다.

Cauchy–Schwarz 부등식에 의해

$$
|\mathbf c_1^T\phi_1| \le \|\mathbf c_1\|\|\phi_1\|
$$

$\|\phi_1\|=1$ 이므로

$$
|\mathbf c_1^T\phi_1| \le \|\mathbf c_1\|
$$

최댓값은 $\phi_1$ 이 $\mathbf c_1$ 과 같은 방향일 때 얻어진다. 따라서

$$
\boxed{ \widehat\phi_1 = \frac{\mathbf c_1}{\|\mathbf c_1\|} }
$$

이다.

정리하면:

> Cauchy–Schwarz는 각 파장과 $Z$ 의 공분산을 모은 방향으로 가중치를 정하면, 만들어진 PLS 성분과 $Z$ 의 공분산이 최대가 된다는 것을 보여준다.

## 두번째 PLS 성분 계산 방법 

PLS 는 두번째 축을 어떻게 찾을까? (PC2 와 같은 역할을 하는) 일단 PCA와 PLS 모두 두번째 축이 첫번째 축과 중복되지 않도록 해야한다 

따라서 조건이 하나 추가된다 

$$
\|\phi_k\|=1, \qquad \left|\operatorname{Cov}(Z,T_k)\right|\text{ 최대화}
$$

이게 기본조건인건 같다. 하지만 

$$
\operatorname{Cov}(T_k,T_j) = \phi_k^T\Sigma_X\phi_j =0, \qquad j<k
$$

가 추가된다. 즉 첫번째와 두번째 축은 겹치는 부분이 있으면 안되는 동시에 알코올 농도 $Z$ 와 강하게 관련된 새로운 NIR 패턴을 찾는거다 

> [!warning] "겹치지 않는다" 가 무슨 뜻인가 PLS 와의 차이점
> 가중치 벡터끼리 직교한다는 뜻이 **아니다**. 식 가운데에 $\Sigma_X$ 가 끼어 있으므로 $\phi_k^T\phi_j=0$ 이 아니라 $\phi_k^T\Sigma_X\phi_j=0$ 이다.
>
> 즉 직교해야 하는 것은 가중치가 아니라 **만들어진 성분** $T_k, T_j$ 다. 설명변수들이 이미 서로 직교해 $\Sigma_X=I$ 인 특수한 경우에만 두 조건이 일치한다.

해당 과정을 PCA 와 마찬가지로 변수의 갯수만큼 반복한뒤 
모든 가중치 벡터를 모으면

$$
\Phi=(\phi_1\mid\cdots\mid\phi_p)
$$

이고 전체 PLS 성분은

$$
T=(T_1,\ldots,T_p)^T=\Phi^TX
$$

가 된다. 

PCA 와 마찬가지로 처음 몇개의 $T_j$ 에 알코올 예측에 필요한 정보가 집중되기를 기대하며 

몇개의 축을 사용할지 결정을 해야한다 

> [!info] 여기까지는 모집단 레벨이다
> 위 조건들은 "무엇을 원하는가" 를 정의한 것일 뿐이다. 실제로는 $\operatorname{Cov}(Z,T_k)$ 를 정확히 알 수 없으므로 표본에서 경험적으로 계산해야 한다.
>
> 그때 $\operatorname{Cov}(T_k,T_j)=0$ 조건은 **deflation(직교화)** 으로 달성한다. 앞 성분으로 설명되는 부분을 $X$ 에서 미리 제거해버리면 다음 성분은 자동으로 직교하게 된다.
>
> 구체적인 계산은 `전체 알고리즘` 의 Step 6 참고.

## PLS 성분을 이용한 저차원 회귀 

PCR 과 같은 흐름을 공유하는거다. 원래는 p 개의 파장 전체를 사용하여 회귀를 해야하는걸 

$$
Z = \beta_1X_1+\cdots+\beta_pX_p+\varepsilon
$$

PLS 에서는 이를 q 개의 성분으로 단순화 한다 

예를들어 NIR 파장이 500개(즉 변수가 500개)여도 q = 4 개의 PLS 성분으로 충분하다면 (당연히 타당한 방식을 거쳐야 한다)

$$
500\text{차원 NIR 스펙트럼} \quad\longrightarrow\quad 4\text{개의 알코올 관련 점수}
$$

로 차원을 줄일 수 있다. 수식으로 보자

가중치 벡터를 모은 행렬을

$$
\Phi=(\phi_1\mid\cdots\mid\phi_p)
$$

라고 하면 새로운 NIR 관측값 $x$ 의 PLS 좌표는

$$
t=\Phi^Tx=(t_1,\ldots,t_p)^T
$$

이다. 이중 첫 $q$ 개만 떼서

$$
t_{(q)}=(t_1,\ldots,t_q)^T
$$

라고 하자. PLS 는 원래 회귀함수

$$
m(x)=E(Z\mid X=x)=\beta^Tx
$$

를 첫 $q$ 개의 PLS 성분만 사용하는 조건부 평균으로 근사한다.

$$
\boxed{ m(x) \approx E(Z\mid T_{(q)}=t_{(q)}) \equiv m_{\mathrm{PLS}}(t_{(q)}) = \beta_{\mathrm{PLS}}^Tt_{(q)} }
$$

따라서 어떤 $q$ 를 고르느냐가 모형의 정의 자체를 바꿔버린다. 

## PLS 회귀계수 추정 

앞서 보았듯이 가중치 벡터를 데이터에 곱산 해서 축을 만들어놓은 상태이다. 

$$
T=(T_1,\ldots,T_p)^T=\Phi^TX
$$

그리고 q 개의 축을 사용한다고 했을때 행렬은 이런 형태일거다. 

$$
\mathbf T_{(q)} = \begin{pmatrix} T_{11}&\cdots&T_{1q}\\ \vdots&&\vdots\\ T_{n1}&\cdots&T_{nq} \end{pmatrix}
$$

회귀계수 구하는거 어려울거 없다. 그냥 OLS 하면 된다 

$$
\widehat\beta_{\mathrm{PLS}} = (\mathbf T_{(q)}^T\mathbf T_{(q)})^{-1} \mathbf T_{(q)}^T\widetilde{\mathbf Z}
$$

PLS regression은 결국 다음 두 단계이다

1. $X$ 와 $Z$ 를 사용해 예측에 유용한 PLS 성분 생성
2. 생성된 PLS 성분에 $Z$ 를 최소제곱 회귀

## 교차검증으로 q 선택

아직 해결하지 못한 문제가 있다, 과연 몇개의 q 를 사용할 것인가. 
너무 작은 q 를 고르면 underfitting 가능성이 있고 너무 크면 overfitting 가능성이 있다 

따라서 적절한 q를 선택할 필요가 있는데 여러 방법중 K - fold 방식을 사용해 볼까 한다 

데이터를 $K$ 개의 fold로 나눈다. 예를 들어 5-fold CV라면

$$
D=D_1\cup D_2\cup\cdots\cup D_5
$$

로 분할한뒤, 그다음 후보 성분 수

$$
q=1,2,\ldots,q_{\max}
$$

각각에 대해 교차검증을 수행하는거다. 하나하나 봐보자 

후보 $q=1$

첫 번째 반복

- 검증 데이터: $D_1$
- 훈련 데이터: $D_2,D_3,D_4,D_5$

훈련 데이터만 이용해:

1. $X$ 의 평균과 표준편차 계산
2. 훈련 $X$ 중심화 및 표준화
3. 첫 번째 PLS 방향 $\widehat\phi_1^{(-1)}$ 계산
4. PLS 회귀계수 추정
5. $D_1$ 의 $Z$ 예측

예측오차는

$$
SSE_{1}(1) = \sum_{i\in D_1} \left( Z_i-\widehat Z_i^{(-1,1)} \right)^2
$$

여기서:

- 위첨자 $(-1)$ : 첫 번째 fold를 제외하고 학습
- 마지막 $1$ : PLS 성분을 1개 사용

나머지 반복

똑같이 검증 fold를 바꾼다

$$
\begin{aligned} D_2&:\quad SSE_2(1),\\ D_3&:\quad SSE_3(1),\\ D_4&:\quad SSE_4(1),\\ D_5&:\quad SSE_5(1). \end{aligned}
$$

모든 검증오차를 합치면

$$
CV(1) = \sum_{r=1}^{5}SSE_r(1)
$$

또는 평균제곱오차로 표현하면

$$
MSECV(1) = \frac1n \sum_{r=1}^{5} \sum_{i\in D_r} \left( Z_i-\widehat Z_i^{(-r,1)} \right)^2
$$

RMSE는

$$
RMSECV(1)=\sqrt{MSECV(1)}
$$

이제 이걸 다른 $q$ 에서도 반복하면 된다 

이제 성분 수를 바꾼뒤 

$$
q=2,3,\ldots,q_{\max}
$$

각 $q$ 에 대해 모든 fold를 한 번씩 검증 데이터로 사용한다.

그 결과:

$$
CV(1),CV(2),\ldots,CV(q_{\max})
$$

또는

$$
RMSECV(1),RMSECV(2),\ldots,RMSECV(q_{\max})
$$

를 얻게된다.

마지막으로

$$
\boxed{ \widehat q = \arg\min_q CV(q) }
$$

를 선택한다.

예를 들어:

| 성분 수 $q$ | RMSECV |
| --- | --- |
| 1 | 0.040 |
| 2 | 0.025 |
| 3 | 0.017 |
| 4 | **0.015** |
| 5 | 0.016 |

라는 결과를 얻었다면, 가장작은 RMSECV 값을 가진 성분인 

$$
\widehat q=4
$$

가 최종 q 가 된다
이후 고정된 q 개의 PLS 축을 사용해 OLS 를 한뒤 회귀를 하면
모든 과정이 마무리 된다 

# 전체 알고리즘 

실제 데이터를 적용시켜 계산을 해보자

## 1. 데이터 정의

혈액 시료가 $n$ 개이고, 각 시료에서 $p$ 개의 NIR 파장을 측정했다고 하자.

$$
\mathbf X= \begin{pmatrix} X_{11}&\cdots&X_{1p}\\ \vdots&\ddots&\vdots\\ X_{n1}&\cdots&X_{np} \end{pmatrix} \in\mathbb R^{n\times p}
$$

- 행 $i$ : $i$ 번째 혈액 시료
- 열 $j$ : $j$ 번째 NIR 파장
- $X_{ij}$ : 시료 $i$ 의 파장 $j$ 에서 측정한 신호

혈중 알코올 농도 벡터는

$$
\mathbf Z= \begin{pmatrix} Z_1\\ \vdots\\ Z_n \end{pmatrix} \in\mathbb R^n
$$

이다.

PLS의 목표는 $p$ 개의 NIR 변수를 $q$ 개의 성분

$$
\mathbf T_1,\ldots,\mathbf T_q
$$

으로 압축하고, 이 성분들로 $\mathbf Z$ 를 예측하는 것이다.

## 2. 중심화와 표준화

각 NIR 파장에서 평균을 뺀다.

$$
\widetilde X_{ij}=X_{ij}-\overline X_j
$$

파장마다 스케일이 다르면 표준편차까지 나눈다. 

$$
\widetilde X_{ij} = \frac{X_{ij}-\overline X_j}{s_j}
$$

혈중 알코올 농도도 중심화한다. (타겟변수)

$$
\widetilde Z_i=Z_i-\overline Z
$$

중심화된 행렬과 벡터는

$$
\widetilde{\mathbf X}\in\mathbb R^{n\times p}, \qquad \widetilde{\mathbf Z}\in\mathbb R^n
$$

이다. PLS 반복을 시작할 때의 초기 잔여 NIR 행렬은

$$
\boxed{\mathbf X^{(0)}=\widetilde{\mathbf X}}
$$

로 둔다. 이후 각 반복에서는 이미 사용한 PLS 성분을 제거한 잔여 행렬 $\mathbf X^{(m)}$을 다음 성분 계산에 사용한다.

## 3. $m$ 번째 PLS 성분 계산

다음 과정을

$$
m=1,\ldots,q
$$

에 대해 반복한다. 

### Step 1. 각 파장과 알코올 농도의 관련성 계산

현재 남아 있는 NIR 행렬을 $\mathbf X^{(m-1)}$ 라고 하자.

각 파장과 알코올 농도의 내적을 계산한다.

$$
c_{mj} = \left\langle \mathbf X_j^{(m-1)},\widetilde{\mathbf Z} \right\rangle
$$

모든 파장의 값을 벡터로 모으면

$$
\boxed{ \mathbf c_m = \mathbf X^{(m-1)T}\widetilde{\mathbf Z} } \in\mathbb R^p
$$

$\mathbf c_m$ 은 각 NIR 파장이 혈중 알코올 농도와 얼마나 함께 움직이는지를 나타내는 벡터다.

- 큰 양수: 파장 신호와 알코올 농도가 함께 증가
- 큰 음수: 한쪽이 증가할 때 다른 쪽은 감소
- 0에 가까움: 선형 관계가 약함

### Step 2. PLS 가중치 계산

$\mathbf c_m$ 을 단위길이로 정규화한다.

$$
\boxed{ \widehat\phi_m = \frac{\mathbf c_m}{\|\mathbf c_m\|} = \frac{ \mathbf X^{(m-1)T}\widetilde{\mathbf Z} }{ \left\| \mathbf X^{(m-1)T}\widetilde{\mathbf Z} \right\| } }
$$

이다.

여기서

$$
\widehat\phi_m = \begin{pmatrix} \widehat\phi_{m1}\\ \vdots\\ \widehat\phi_{mp} \end{pmatrix}
$$

이며, $\widehat\phi_{mj}$ 는 $m$ 번째 PLS 성분에서 $j$ 번째 NIR 파장에 주어지는 가중치다.

### Step 3. PLS score 계산

현재 NIR 데이터를 $\widehat\phi_m$ 방향으로 투영한다.

$$
\boxed{ \mathbf T_m = \mathbf X^{(m-1)}\widehat\phi_m } \in\mathbb R^n
$$

시료 $i$ 의 PLS 점수는

$$
\boxed{ T_{im} = \sum_{j=1}^{p} X_{ij}^{(m-1)}\widehat\phi_{mj} }
$$

이다.

즉,

$$
T_{im} = X_{i1}^{(m-1)}\widehat\phi_{m1} +\cdots+ X_{ip}^{(m-1)}\widehat\phi_{mp}
$$

$\mathbf T_m$ 은 각 혈액 시료의 전체 NIR 스펙트럼을 알코올 관련 방향으로 압축한 결과다.

### Step 4. $T_m$ 에 대한 회귀계수 계산

중심화된 알코올 농도를 $\mathbf T_m$ 에 회귀한다. (OLS)

$$
\boxed{ \widehat\theta_m = \frac{ \mathbf T_m^T\widetilde{\mathbf Z} }{ \mathbf T_m^T\mathbf T_m } }
$$

이다.

$\widehat\theta_m$ 은 $m$ 번째 PLS 점수가 알코올 농도 예측에 얼마나 기여하는지를 나타낸다.

### Step 5. 알코올 농도 예측값 갱신

중심화된 척도에서 초기 적합값을

$$
\widehat{\widetilde{\mathbf Z}}^{(0)}=\mathbf0
$$

으로 둔다.

그다음

$$
\boxed{ \widehat{\widetilde{\mathbf Z}}^{(m)} = \widehat{\widetilde{\mathbf Z}}^{(m-1)} + \widehat\theta_m\mathbf T_m }
$$

으로 적합값을 갱신한다.

첫 번째 성분까지 사용하면

$$
\widehat{\widetilde{\mathbf Z}}^{(1)} = \widehat\theta_1\mathbf T_1
$$

두 번째 성분까지 사용하면

$$
\widehat{\widetilde{\mathbf Z}}^{(2)} = \widehat\theta_1\mathbf T_1 + \widehat\theta_2\mathbf T_2
$$

$q$ 개 성분을 사용하면

$$
\boxed{ \widehat{\mathbf Z}^{(q)} = \overline Z\mathbf1 + \sum_{m=1}^{q} \widehat\theta_m\mathbf T_m }
$$

이 된다.

### Step 6. 사용한 성분을 $X$ 에서 제거

다음 성분이 현재 성분과 같은 정보를 반복하지 않도록 $\mathbf T_m$ 방향을 NIR 데이터에서 제거한다.

먼저 loading vector를 계산한다.

$$
\boxed{ \widehat p_m = \frac{ \mathbf X^{(m-1)T}\mathbf T_m }{ \mathbf T_m^T\mathbf T_m } } \in\mathbb R^p
$$

그다음

$$
\boxed{ \mathbf X^{(m)} = \mathbf X^{(m-1)} - \mathbf T_m\widehat p_m^T }
$$

으로 NIR 행렬을 갱신한다.

열별로 쓰면

$$
\mathbf X_j^{(m)} = \mathbf X_j^{(m-1)} - \frac{ \mathbf T_m^T\mathbf X_j^{(m-1)} }{ \mathbf T_m^T\mathbf T_m } \mathbf T_m
$$

두 번째 항은 $\mathbf X_j^{(m-1)}$ 를 $\mathbf T_m$ 방향으로 투영한 부분이다.

이를 빼면

$$
\mathbf T_m^T\mathbf X_j^{(m)}=0
$$

따라서 다음 단계에서는 이미 사용한 PLS 성분과 겹치지 않는 NIR 정보만 남는다.

이 과정을 **deflation 또는 직교화**라고 한다.

> [!warning] 두 번째 이후 가중치의 좌표계
> 첫 번째 성분을 제거한 뒤 계산하는 두 번째 가중치 $\widehat\phi_2$는 원래 행렬 $\widetilde{\mathbf X}$가 아니라, deflation된 행렬 $\mathbf X^{(1)}$의 변수들을 결합하는 가중치다. 따라서
> $$ \mathbf T_2=\mathbf X^{(1)}\widehat\phi_2 $$
> 이며, 일반적으로 $\mathbf T_2\ne\widetilde{\mathbf X}\widehat\phi_2$이다. PDF에서는 첫 번째 deflation 뒤의 행렬을 $\widetilde{\mathbf X}^{(2)}$로 표기하지만, 여기의 $\mathbf X^{(1)}$과 같은 대상이다. 첨자만 서로 다르다.

## 4. 전체 반복식

PLS 알고리즘은 다음 계산을 $m=1,\ldots,q$ 에 대해 반복한다.

$$
\boxed{ \begin{aligned} \mathbf c_m &= \mathbf X^{(m-1)T}\widetilde{\mathbf Z},\\[2mm] \widehat\phi_m &= \frac{\mathbf c_m}{\|\mathbf c_m\|},\\[2mm] \mathbf T_m &= \mathbf X^{(m-1)}\widehat\phi_m,\\[2mm] \widehat\theta_m &= \frac{ \mathbf T_m^T\widetilde{\mathbf Z} }{ \mathbf T_m^T\mathbf T_m },\\[2mm] \widehat p_m &= \frac{ \mathbf X^{(m-1)T}\mathbf T_m }{ \mathbf T_m^T\mathbf T_m },\\[2mm] \mathbf X^{(m)} &= \mathbf X^{(m-1)} - \mathbf T_m\widehat p_m^T. \end{aligned} }
$$

흐름만 간단히 나타내면

$$
\begin{aligned} \mathbf X^{(0)} &\rightarrow \widehat\phi_1 \rightarrow \mathbf T_1 \rightarrow \mathbf X^{(1)}\\ \mathbf X^{(1)} &\rightarrow \widehat\phi_2 \rightarrow \mathbf T_2 \rightarrow \mathbf X^{(2)}\\ &\;\;\vdots\\ \mathbf X^{(q-1)} &\rightarrow \widehat\phi_q \rightarrow \mathbf T_q \end{aligned}
$$

앞에서 사용한 방향을 매번 제거하므로 서로 다른 PLS score는 직교한다.

$$
\mathbf T_k^T\mathbf T_m=0, \qquad k\ne m
$$

> [!note] PDF 29페이지와의 연결
> R의 `plsr` 결과에서 두 번째 score는 위 절차로 계산한 $\mathbf T_2$와 대응하며, 이후 성분도 같은 방식으로 반복해서 얻는다.
>
> 특히 중심화된 설명변수의 열들이 서로 직교하여
> $$ \widetilde{\mathbf X}^{T}\widetilde{\mathbf X}=\mathbf I $$
> 를 만족하면 PLS는 통상적인 선형회귀(OLS)와 일치한다. 이는 단순히 직교한 score들 위에서 OLS를 수행한다는 뜻을 넘어, 원래 $X$ 공간에서의 PLS 회귀 결과 자체가 OLS와 같아지는 특수한 경우를 말한다.

## PCR 과의 비교

### 비선형 회귀로의 확장

차원축소 단계에서 얻은 PLS score나 principal component는 선형회귀에만 사용할 필요가 없다. 첫 $q$개의 성분을 각각

$$
\mathbf T_{(q)}=(T_1,\ldots,T_q)^T, \qquad \mathbf Y_{(q)}=(Y_1,\ldots,Y_q)^T
$$

라고 하면, 다음과 같은 조건부 평균을 비선형 함수로 추정할 수도 있다.

$$
m_{\mathrm{PLS}}(t)=E\!\left(Z\mid \mathbf T_{(q)}=t\right), \qquad m_{\mathrm{PC}}(y)=E\!\left(Z\mid \mathbf Y_{(q)}=y\right)
$$

즉 PLS와 PCA는 입력 차원을 줄이는 역할을 하고, 줄어든 좌표와 반응변수 사이의 관계는 선형모형뿐 아니라 스플라인, 커널 회귀 등의 비선형 방법으로 학습할 수 있다.

### 선형회귀에서의 PCR과 PLS 비교

회귀 문제에서는 PLS 가 PCR 보다 잘 작동하는 경우가 많다. PCR 은 $X$ 의 변동만 보고 성분을 선택하지만, PLS 는 $X$ 와 $Z$ 의 관계를 이용해 성분을 선택하기 때문이다.

따라서 일반적으로 다음 두 경우를 기대할 수 있다.

1. 같은 수 $q$ 의 성분을 사용하면 $m_{\mathrm{PLS}}$ 가 $m_{\mathrm{PC}}$ 보다 $m(x)$ 를 더 정확하게 근사할 수 있다.
2. 두 방법이 같은 정확도를 달성한다면 PLS 가 더 적은 수의 성분을 필요로 할 수 있다.

더 적은 성분으로 같은 성능을 얻으면 모형이 단순해지고 계산도 효율적이다.

다만 **PLS 가 항상 PCR 보다 좋은 것은 아니다.** PLS 는 성분을 만들 때 $Z$ 를 사용하므로, 표본이 작거나 $Z$ 에 잡음이 많으면 우연한 관계를 학습할 수 있다. 따라서 실제 성능은 교차검증으로 비교해야 한다.

# Wrap-up

#### 컨셉: 

한 줄 요약: **PLS 는 $X$ 를 잘 설명하는 방향이 아니라 $Z$ 와 같이 움직이는 방향으로 차원을 줄이고, 그 성분에 OLS 를 붙이는 방법이다.**

#### 핵심 흐름:

1. 공선성 때문에 원변수 회귀가 불안정하다 → 차원축소가 필요
2. PCA 는 $\operatorname{Var}$ 를, PLS 는 $\lvert\operatorname{Cov}(Z,T)\rvert$ 를 최대화
3. Cauchy–Schwarz 로 $\widehat\phi_m=\mathbf c_m/\|\mathbf c_m\|$
4. deflation 으로 score 간 직교성 확보
5. $q$ 는 K-fold CV 로 선택 (모든 전처리를 fold 안에서)

#### 알고리즘 전체

**0. 중심화** (정규화가 아님)

$\mathbf X$의 각 열과 $\mathbf Z$를 함께 중심화한다.

$$
\widetilde{\mathbf X}_j=\mathbf X_j-\overline X_j\mathbf 1,
\qquad
\widetilde{\mathbf Z}=\mathbf Z-\overline Z\mathbf 1
$$

파장별 스케일이 다르면 각 열을 표준편차 $s_j$로 나누어 표준화한다. 초기 잔여 행렬은

$$
\mathbf X^{(0)}=\widetilde{\mathbf X}
$$

로 둔다.

**1. 공분산 계산** (correlation이 아니라 covariance)

$$
\mathbf c_m=\mathbf X^{(m-1)T}\widetilde{\mathbf Z}
$$

중심화했으므로 각 원소 $c_{mj}$는 표본 공분산의 $n-1$배이다.

$$
c_{mj}=\left\langle\mathbf X_j^{(m-1)},\widetilde{\mathbf Z}\right\rangle
=(n-1)\widehat{\operatorname{Cov}}\!\left(X_j^{(m-1)},Z\right)
$$

상관계수라면 표준편차로도 나누어야 하지만 PLS의 이 단계에서는 그렇게 하지 않는다.

**2. 정규화하여 가중치 계산**

$$
\widehat\phi_m=\frac{\mathbf c_m}{\|\mathbf c_m\|}
$$

Cauchy–Schwarz 부등식에 의해 이 방향은 **성분과 반응변수 사이의 공분산**

$$
\left|\operatorname{Cov}(Z,T_m)\right|
$$

을 최대화한다. 변수들 사이의 공분산을 최대화한다는 뜻은 아니다.

**3. 투영하여 score 계산**

$$
\mathbf T_m=\mathbf X^{(m-1)}\widehat\phi_m
$$

차원을 확인하면

$$
(n\times p)(p\times1)=n\times1
$$

이므로, $\mathbf T_m$은 모든 시료의 $m$번째 PLS score를 모은 벡터다.

**4. OLS 회귀계수 계산**

$$
\widehat\theta_m
=\frac{\mathbf T_m^T\widetilde{\mathbf Z}}
{\mathbf T_m^T\mathbf T_m}
$$

이는 $\widetilde{\mathbf Z}$를 $\mathbf T_m$에 단순회귀했을 때의 기울기다.

**5. 예측값 누적**

$$
\widehat{\widetilde{\mathbf Z}}^{(m)}
=\widehat{\widetilde{\mathbf Z}}^{(m-1)}
+\widehat\theta_m\mathbf T_m,
\qquad
\widehat{\widetilde{\mathbf Z}}^{(0)}=\mathbf0
$$

성분을 새로 구할 때마다 예측값을 교체하는 것이 아니라, 각 성분의 기여도를 계속 더한다.

**6. Deflation**

먼저 loading vector를 계산한다.

$$
\widehat p_m
=\frac{\mathbf X^{(m-1)T}\mathbf T_m}
{\mathbf T_m^T\mathbf T_m}
$$

그다음 현재 성분이 설명한 부분을 잔여 행렬에서 제거한다.

$$
\mathbf X^{(m)}
=\mathbf X^{(m-1)}-\mathbf T_m\widehat p_m^T
$$

여기서 실제로 빼는 것은 loading vector 자체가 아니라 외적

$$
\mathbf T_m\widehat p_m^T\in\mathbb R^{n\times p}
$$

이다.

**7. 1번으로 돌아가 반복**

$$
m=1,\ldots,q_{\max}
$$

에 대해 1–6단계를 반복한다. 매 반복에서 $\widetilde{\mathbf Z}$는 그대로 사용하고 $\mathbf X$만 deflation한다. $\mathbf X^{(m)}$이 앞서 구한 score들과 직교하기 때문에 $\widetilde{\mathbf Z}$를 사용하든 이전 단계의 반응변수 잔차를 사용하든 다음 방향은 동일하다.

**8. 성분 수 $q$ 선택**

$q_{\max}$까지 성분을 계산한 다음 K-fold CV를 이용해

$$
\widehat q
=\underset{q}{\operatorname{argmin}}\;\operatorname{RMSECV}(q)
$$

를 선택한다. 성분이 순차적으로 누적되므로 각 후보 $q$에 대해 처음 $q$개 성분을 사용한다. 데이터 누출을 막기 위해 중심화, 표준화, $\widehat\phi_m$ 계산은 매 fold의 훈련자료 안에서 모두 다시 수행해야 한다.

**9. 최종 재학습 및 예측**

선택한 $\widehat q$를 사용하여 전체 훈련자료에서 모형을 다시 학습한다. 원래 척도의 최종 적합값은

$$
\widehat{\mathbf Z}^{(\widehat q)}
=\overline Z\mathbf1
+\sum_{m=1}^{\widehat q}\widehat\theta_m\mathbf T_m
$$

이다. score들은 서로 직교하므로

$$
\mathbf T_k^T\mathbf T_m=0,
\qquad k\ne m
$$

순차적으로 구한 $\widehat\theta_m$은 $\widehat q$개의 score를 동시에 사용한 다중 OLS의 계수와 일치한다. 따라서 같은 score들로 마지막에 OLS를 다시 적합해도 결과는 변하지 않는다.

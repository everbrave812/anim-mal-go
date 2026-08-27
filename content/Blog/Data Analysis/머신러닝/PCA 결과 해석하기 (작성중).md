---
title: PCA 결과 해석하기
date: 2026-08-24
publish: false
description: 다변량 4주차
---
### Motivation

https://everbrave812.github.io/anim-mal-go/blog/%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B3%B5%EB%B6%80/%EB%A8%B8%EC%8B%A0%EB%9F%AC%EB%8B%9D/pca,-%EA%B3%A0%EC%B0%A8%EC%9B%90-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%A5%BC-%EA%B0%80%EC%9E%A5-%EC%9E%98-%EC%84%A4%EB%AA%85%ED%95%98%EB%8A%94-%EC%B6%95-%EC%B0%BE%EA%B8%B0 


(해당 글은 University of Melbourne, Multivariate Statistics for Data Science (MAST90138)의 4주차 수업내용을 기반으로 작성되었다)  
### Goal
### 목차



### PC를 몇 개 사용할 것인가

원래 변수가 $p$개라면 PC도 $p$개 만들어진다. 모든 PC를 사용하면 좌표만 바뀔 뿐 정보 손실은 없다. 차원축소를 하려면 앞의 일부 PC만 사용해야 한다.

전체 분산은:

$$
\sum_{j=1}^p\lambda_j
=\operatorname{tr}(\Sigma)
=\sum_{j=1}^p\operatorname{Var}(X_j)
$$

이고, 앞의 $q$개 PC가 설명하는 누적 분산 비율은:

$$
\boxed{
\psi_q=\frac{\lambda_1+\cdots+\lambda_q}
{\lambda_1+\cdots+\lambda_p}}
$$

이다. 고유값을 순서대로 그린 것이 scree plot이다. 급격한 감소가 완만해지는 elbow와 누적 설명분산 80%, 90%, 95% 등의 기준을 함께 이용해 PC 수를 결정한다.

작은 설명량의 PC가 특이한 구조를 포함할 수 있으므로 elbow만 기계적으로 사용하면 안 된다. 처음 몇 개 PC가 대부분의 분산을 설명하지 못하면 데이터의 저차원 구조가 약하므로 PCA 차원축소가 효과적이지 않을 수 있다.

표본 설명비율 $\hat\psi_q$는 표본에 따라 달라지는 확률변수이므로 모집단 설명비율에 대해 다음과 같은 가설검정도 가능하다.

$$
H_0:\psi_q=\psi_0
$$

### 원래 변수와 PC의 관계

PC 벡터는 $Y=G^TX$이고, $G$가 직교행렬이므로 역으로 $X=GY$이다. 원래 변수 $X_j$와 PC $Y_k$의 공분산은:

$$
\operatorname{Cov}(X_j,Y_k)=\gamma_{jk}\lambda_k
$$

이고 상관계수는:

$$
\boxed{
\rho_{X_j,Y_k}=\operatorname{Cor}(X_j,Y_k)
=\gamma_{jk}\sqrt{\frac{\lambda_k}{\sigma_{jj}}}}
$$

이다.

- Loading $\gamma_{jk}$는 PC를 만들 때 원래 변수에 주는 가중치이다.
- Correlation $\rho_{X_j,Y_k}$는 원래 변수와 PC가 실제로 얼마나 강하게 함께 움직이는지를 나타낸다.

상관계수의 제곱은 $X_j$의 분산 중 PC $k$가 설명하는 비율이다.

$$
\rho_{X_j,Y_k}^2=\frac{\gamma_{jk}^2\lambda_k}{\sigma_{jj}}
$$

모든 PC에 대해 합하면:

$$
\boxed{\sum_{k=1}^p\rho_{X_j,Y_k}^2=1}
$$

이다. 즉 모든 PC를 합치면 원래 변수의 분산을 100% 설명한다.

### Correlation Circle

각 원래 변수 $X_j$를 다음 좌표에 표시한다.

$$
\left(\operatorname{Cor}(X_j,PC1),
\operatorname{Cor}(X_j,PC2)\right)
$$

상관계수는 $-1$과 $1$ 사이이므로 모든 변수는 단위원 안에 위치한다.

화살표 끝까지 거리의 제곱:

$$
\operatorname{Cor}(X_j,PC1)^2
+\operatorname{Cor}(X_j,PC2)^2
$$

은 $X_j$의 분산 중 PC1과 PC2가 함께 설명하는 비율이다. 예를 들어 좌표가 $(-0.921,0.377)$이라면:

$$
(-0.921)^2+(0.377)^2\approx0.991
$$

이므로 처음 두 PC가 해당 변수 분산의 약 99.1%를 설명한다.

- 원의 둘레에 가까운 변수는 PC1과 PC2로 잘 설명된다.
- 원점에 가까운 변수는 PC3 이후에 정보가 많이 남아 있다.

두 변수가 원의 둘레에 충분히 가까울 때 같은 방향이면 강한 양의 상관, 반대 방향이면 강한 음의 상관, 약 $90^\circ$이면 상관이 0에 가깝다. 이는 상관 벡터의 내적이 원래 변수 사이의 상관계수가 되기 때문이다.

$$
\operatorname{Cor}(X_j,X_{j'})
=\boldsymbol\rho_j^T\boldsymbol\rho_{j'}
$$

화살표가 짧으면 PC1과 PC2가 해당 변수를 충분히 설명하지 못하므로 각도만 보고 상관관계를 판단하면 안 된다.

Correlation circle의 화살표는 변수이고 score plot의 점은 관측값이다. 관측값이 특정 화살표와 같은 방향에 있으면 해당 변수의 값이 큰 경향이 있고, 반대 방향에 있으면 작은 경향이 있다. 이 해석도 화살표가 길고 처음 두 PC의 설명량이 충분할 때 사용해야 한다.

### Banknote 사례

Banknote 자료에는 Length, Left, Right, Bottom, Top, Diagonal의 여섯 변수가 있다. PC1은:

$$
\begin{aligned}
PC1={}&0.044(Length)-0.112(Left)-0.139(Right)\\
&-0.768(Bottom)-0.202(Top)+0.579(Diagonal)
\end{aligned}
$$

이다. 절댓값이 큰 계수만 보면:

$$
\boxed{PC1\approx0.579(Diagonal)-0.768(Bottom)}
$$

따라서 PC1이 크면 Diagonal이 크고 Bottom이 작은 경향이 있고, PC1이 작으면 Bottom이 크고 Diagonal이 작은 경향이 있다.

해당 부호 선택에서는 PC1의 양의 방향에 genuine과 큰 Diagonal이, 음의 방향에 fake와 큰 Bottom·Top이 나타난다. Correlation circle에서도 Diagonal과 Bottom이 반대 방향을 향하므로 두 변수는 음의 상관을 가진다.

PCA는 fake/genuine 라벨을 사용하지 않는 비지도학습 방법이다. 분산이 가장 큰 방향이 우연히 집단 차이와 관련되어 있기 때문에 score plot에서 두 집단이 분리된 것이다. PCA 그래프를 해석한 후에는 반드시 원래 raw data에서 Diagonal과 Bottom이 실제로 집단을 구분하는지 확인해야 한다.

### Scale 문제와 표준화 PCA

PCA는 분산이 큰 방향을 찾으므로 숫자 범위가 큰 변수가 PC를 지배할 수 있다. 예를 들어 키를 cm로 측정하느냐 m로 측정하느냐에 따라 데이터의 의미는 같아도 공분산의 크기와 PCA 결과가 바뀔 수 있다.

Banknote 데이터에서 Length만 100배 하면:

$$
\operatorname{Var}(100X_1)=10000\operatorname{Var}(X_1)
$$

이 되어 PC1이 Length에 집중한다. 그러면 Bottom과 Diagonal을 통해 fake와 genuine을 구별하던 구조가 흐려질 수 있다.

각 변수를 평균 0, 분산 1로 표준화하면:

$$
Z_j=\frac{X_j-\mu_j}{\sqrt{\sigma_{jj}}}
$$

이고 행렬로는:

$$
Z=D^{-1/2}(X-\mu),
\qquad
D=\operatorname{diag}(\sigma_{11},\ldots,\sigma_{pp})
$$

이다. 표준화된 데이터의 공분산행렬은:

$$
\operatorname{Var}(Z)
=D^{-1/2}\Sigma D^{-1/2}=P
$$

이며 $P$는 원래 변수의 상관행렬이다.

$$
\boxed{\text{표준화 PCA}=\text{상관행렬 기반 PCA}}
$$

표준화는 무조건 수행하는 절차가 아니다.

- 단위가 서로 다르면 일반적으로 표준화를 고려한다.
- 단위가 같아도 각 변수를 동일한 상대적 중요도로 비교하려면 표준화할 수 있다.
- 큰 분산 자체가 중요한 정보라면 공분산 기반 PCA를 사용할 수 있다.

분석자는 원래 분산의 차이를 의미 있는 것으로 볼 것인지 단순한 scale 차이로 볼 것인지 판단해야 한다.

![[Pasted image 20260826132055.png]]
### Wrap-up
## 관련 글

<!-- AUTO-RELATED:START -->
<!-- 블로그 게시 시 자동으로 채워지는 영역 -->
<!-- AUTO-RELATED:END -->

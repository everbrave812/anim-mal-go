---
title: Ridge, Lasso와 Overfitting
date: 2026-08-23
publish: true
---
### Motivation   

나는 중,고등학교때 수학을 싫어했다. 사실 그럴만도 한게 수학을 공부하는 방법 자체를 전혀 몰랐다.  
지금 생각해보면 최악의 공부방법을 사용해서 수학을 접근했는데 그 방법은 다음과 같다   
일단 문제집을 피고 -> 문제를 읽고 모르겠다면 바로 답을 본다 -> **답지의 풀이 방법을 통으로 암기한다** -> 다음 문제로 넘어간다   
이렇게 되면 난 이해보다 **문제집의 답**을 외우게 되고, 실제 시험장에 들어가서 보는 문제들은 전부 나한테 새로운 문제들이었다.   
이런 문제는 머신러닝에도 똑같이 적용이 된다. '**문제집의 답을 과도하게 암기해서, 실제 시험 문제를 못푸는 상황', 이게 흔히 말하는 over fitting 이다.**   
  
하지만, 오늘 over-fitting 이라는 주제는 글의 마지막에야 등장할 것이다. 'over-fitting을 단순히 수학문제를 많이 외운것' 이라는 비유 하나로 설명하긴 싫다. 시작은 아마 선형회귀의 본질적인 문제 (ill posed prob) 로 접근해 보고자 한다. 이후 해당 문제를 어떻게 풀어낼수 있는지, 그리고 그 해법인 Ridge Lasso 회귀의 작동원리, 자연스럽게 이어지는 모델복잡도를 기반으로한 Bias-Variance Trade-off 로 over fitting 에 대해 설명해볼 것이며 최근의 개념인 Double Descent 로 글을 마무리 지어보고자 한다.  
  
분명히 말하고 싶은건 도착 지점이 over fitting 이라는 것이지, 그 과정속에서 우리가 거쳐가는 많은 개념들이 단순히 'over-fitting 을 이해하기 위한 무언가' 라고 생각하진 않았으면 좋겠다. 하나하나 그 과정을 온전히 경험하길 바란다.   
  
(해당 글은 University of Melbourne, Statistical Machine Learning (COMP90051)의 3주차 1차시 수업내용을 기반으로 작성되었다)  
  
### 목차  
  
ill posed prob 이란 무엇인가   
어떻게 해결할수 있을까   
L1 Regularization / L2 Regularization   
Ridge - Lasso Graph 이해하기  
Bias-Variance Trade-off 와 double descent 

### ILL posed prob 이란 무엇인가  
  
기억을 더듬어 보자, 선형회귀의 일반식을 생각해 보는거다.    
물론 그냥 일반 회귀식 말고, 선형대수로 표현된 그 방식을 말하는거다.   
  
아마 이런 식이 머리에 떠오를 것이다.  

$$
y=Xw+\epsilon
$$

하나씩 펼쳐서 보면 다음과 같다.

$$
\begin{bmatrix}
y_1\\
y_2\\
\vdots\\
y_n
\end{bmatrix}
=
\begin{bmatrix}
x_{11} & x_{12} & \cdots & x_{1p}\\
x_{21} & x_{22} & \cdots & x_{2p}\\
\vdots & \vdots & \ddots & \vdots\\
x_{n1} & x_{n2} & \cdots & x_{np}
\end{bmatrix}
\begin{bmatrix}
w_1\\
w_2\\
\vdots\\
w_p
\end{bmatrix}
+
\begin{bmatrix}
\epsilon_1\\
\epsilon_2\\
\vdots\\
\epsilon_n
\end{bmatrix}
$$

여기서 $y$는 우리가 예측하고 싶은 값, $X$는 데이터, $w$는 각 변수에 부여되는 가중치, 그리고 $\epsilon$은 모델이 설명하지 못한 오차이다.

선형회귀가 원하는 것은 단순하다. 실제값 $y$와 예측값 $Xw$ 사이의 차이, 즉 잔차를 가장 작게 만드는 $w$를 찾는 것이다.

$$
\hat w
=
\arg\min_w \|y-Xw\|_2^2
$$

이를 $w$에 대해 미분하면:

$$
\nabla_w\|y-Xw\|_2^2
=
-2X^\top(y-Xw)
$$

해를 구하기 위해 미분값을 0으로 두면:

$$
-2X^\top(y-Xw)=0
$$

따라서:

$$
X^\top Xw=X^\top y
$$

마지막으로 $(X^\top X)^{-1}$이 존재한다면 다음과 같은 OLS의 해를 얻을 수 있다.

$$
\boxed{
\hat w_{\mathrm{OLS}}
=
(X^\top X)^{-1}X^\top y
}
$$

오늘 배울 모든건 이 식에서 시작된다.  
  
회귀분석의 메커니즘은 단순하다. **'잔차의 제곱을 최소화 한다',** 흔히 말하는 OLS 라는 이 방식은 가정들을 기반으로 작동한다. 그렇기에 학부 회귀분석에서 교수님들이 '가정들' 에 대해 열변을 토하시는것도 다 그 이유 때문이다. 크게 4가지의 가정이 있는데 (선형성, 독립성, 등분산성, 정규성) 우린 이제 이 가정을 하나씩 부셔볼 것이다. 그리고 짧은 나의 식견에 의존한 직관으로 보았을때 **회귀 파생 모델의 대부분이 이 부셔진 가정을 어떻게 처리할 것인가? 에 대한 질문을 답하기 위해 만들어 졌다고 봐도 무관할듯 싶다.**   
  
가정을 먼저 부셔도 되지만, 나는 수식을 먼저 부셔볼까 한다.    
사실 달걀과 닭의 문제 처럼 수식이 부셔지면 가정도 무너지는 구조라, 뭘 먼저 어떻게 부셔도 상관이 없다.   
  
**만약 우리가 앞서본 회귀식에서 역행렬이 존재하지 않게 된다고 하자**,     
그럼 아주 쉽게 해당 식을 무력화 시킬수 있다. 더 이상 선형 Equation 은 작동하지 않는다. ill posed problem은 해가 존재하지 않거나, 유일하지 않거나, 입력의 작은 변화에 해가 불안정하게 변하는 문제를 말한다. 역행렬이 존재하지 않는 경우는 그중 해가 유일하지 않게 되는 대표적인 경우이다.   
    
**그래서 뭐 어쩌라는 걸까? 이렇듯 수식만 보면 현실세계에서 점점 멀어진다. (늘 우린 수식과 현실의 세계를 왔다갔다 해야한다)    
역행렬이 존재하지 않는 경우를 현실 데이터 분석의 세계로 가져와 보면,** 다음 두가지 경우에서 역행렬이 존재하지 않을수 있다.     

**1\. 완전 다중공선성 문제가 있는 경우 (변수들 간 독립이 아닌 경우)**  
**2\. 변수 수 $p$가 관측치 수 $n$보다 많은 경우

둘 다 현실 세계에서 너무나 있을 법한 문제이다. 따라서 우린 이 문제, 그리고 무너진 Equation을 해결해야 하는것이다. 
  
### 어떻게 해결할수 있을까   

![409](https://blog.kakaocdn.net/dna/cv3IJF/dJMcaaNffJt/AAAAAAAAAAAAAAAAAAAAAAkmCkIobgpdYBGhqsxCWjVpjirZ_d3NfjPXv2SbeOo7/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=GmJQRxLXk%2FA2nA4wWYOq9cI%2F6XY%3D)

**문제 해결의 idea : 역행렬이 없어서 문제가 발생했다면, 역행렬을 강제로 존재하게 하면 되는거 아닌가?**     
놀랍게도 이게 해결 방법이다. 이번 목차에서 배울 내용은 역행렬을 강제하는 방법이다.   
  
사실 선형대수학 과목을 잘 들었다면, 아마 해법을 알것이다.  
$X^\top X$의 대각성분에 $\lambda>0$을 더해주면, 역행렬을 보장할수 있다
직관적 이해를 돕기 위해 2\*2 toy sample 을 가져왔다   
  
다음과 같은 matrix 가 있다.  

$$
A=
\begin{bmatrix}
5 & 5\\
5 & 5
\end{bmatrix}
$$
  
해당경우 determinant 가 0 이기에 역행렬이 없다  

$$
\det(A)
=
(5\times5)-(5\times5)
=0
$$
  
이제 대각행렬에 1씩 더해보자  

$$
A+I
=
\begin{bmatrix}
5 & 5\\
5 & 5
\end{bmatrix}
+
\begin{bmatrix}
1 & 0\\
0 & 1
\end{bmatrix}
=
\begin{bmatrix}
6 & 5\\
5 & 6
\end{bmatrix}
$$
  
가중치를 더한 matrix 의 determinant 는 11 따라서 역행렬이 존재하게 된다  

$$
\det(A+I)
=
(6\times6)-(5\times5)
=36-25
=11
$$
  
아이디어를 꼭 기억해두자, **이제 이슈는 더 좁혀지게 된다. 그렇다면 도대체 어떤 가중치를 어떻게 둘것인가 의 문제**로 넘어가게 된다 
  
### L1 Regularization / L2 Regularization 그리고 목적함수  
지금부터는 약간 헷갈릴 수 있는 내용이라, 결론부터 이야기할 테니 일단 그 흐름에 익숙해지자.

$$
\boxed{
\text{목적함수}
=
\text{기존 오차}
+
\lambda\times\text{가중치에 대한 벌점}
}
$$

이게 전부다.

기존의 선형회귀는 오차의 제곱합만을 최소화했다. Ridge와 Lasso는 여기에 **가중치가 너무 커지지 않도록 벌점을 하나 추가한다.** 그리고 그 벌점을 얼마나 강하게 적용할지는 $\lambda$가 결정한다.

이제 벌점의 형태에 따라 모델이 나누어진다.

가중치 제곱의 합을 벌점으로 사용하면 L2 Regularization이고:

$$
\lambda\|w\|_2^2
=
\lambda\sum_{j=1}^{p}w_j^2
$$

이를 사용하는 것이 Ridge 회귀이다.

반대로 가중치 절댓값의 합을 벌점으로 사용하면 L1 Regularization이고:

$$
\lambda\|w\|_1
=
\lambda\sum_{j=1}^{p}|w_j|
$$

이를 사용하는 것이 Lasso 회귀이다.

결국 차이는 단순하다.

$$
\boxed{\text{L2 Regularization}\rightarrow\text{Ridge}}
$$

$$
\boxed{\text{L1 Regularization}\rightarrow\text{Lasso}}
$$

참고로 절편에는 규제를 적용하지 않는다. 절편을 제외한 가중치에만 규제를 적용한다 
  
이제 하나씩 목적함수를 유도해 보겠다   
  
**직관적 이해를 위해 2\*2 즉 가중치가 2개인 선형회귀를 기준으로 하였으며, 모든 matrix 를 펼쳐서 보여주는 형식으로 진행했다**  
  
2\. Ridge를 행렬로 펼치기  
Ridge 목적함수는:  
  
$$ J(w) = \|y-Xw\|_2^2+\lambda\|w\|_2^2 $$  
  
이다.  
  
L2 벌점(제곱벌점)을 펼치면:  
  
$$ \|w\|_2^2=w^\top w $$  
$$ = \begin{bmatrix} w_1&w_2 \end{bmatrix} \begin{bmatrix} w_1\\ w_2 \end{bmatrix} = w_1^2+w_2^2 $$
따라서 전체 목적함수는:  
$$ \boxed{ J(w_1,w_2) = \sum_{i=1}^n (y_i-x_{i1}w_1-x_{i2}w_2)^2 + \lambda(w_1^2+w_2^2) } $$
이다. 이제 0으로 두고 W(가중치)에 대해 편미분을 진행하면 해를 구할수 있다.   
또한 **convex 함수이기 때문에 전역 최적해**를 보장하며, 미분을 통해 closed-form solution을 구할 수 있다.  
  
Ridge 미분  (w 에 대해 편미분 = set 0)
$$ \nabla_wJ(w) = -2X^\top(y-Xw)+2\lambda w $$
0으로 놓으면:  
$$ -2X^\top y+2X^\top Xw+2\lambda w=0 $$
2를 제거하면:  
$$ X^\top Xw+\lambda w=X^\top y $$ 여기서:  
$$ \lambda w = \lambda \begin{bmatrix} w_1\\ w_2 \end{bmatrix} $$
이고:  
$$ \lambda Iw = \lambda \begin{bmatrix} 1&0\\ 0&1 \end{bmatrix} \begin{bmatrix} w_1\\ w_2 \end{bmatrix} = \lambda \begin{bmatrix} w_1\\ w_2 \end{bmatrix} $$  이므로:  
$$ X^\top Xw+\lambda Iw=X^\top y $$
$$ \boxed{ (X^\top X+\lambda I)w=X^\top y } $$ 가 된다.   
  
3\. Lasso를 펼치기  
Lasso 목적함수는:  
  
$$ J(w) = \|y-Xw\|_2^2+\lambda\|w\|_1 $$
이다.  
L1 norm은:  
  
$$ \|w\|_1=|w_1|+|w_2| $$
이므로:  
$$ \boxed{ J(w_1,w_2) = \sum_{i=1}^{n} (y_i-x_{i1}w_1-x_{i2}w_2)^2 + \lambda(|w_1|+|w_2|) } $$
이다.  

여기서 Ridge처럼:  
$$ X^\top X+\lambda I $$  
형태로 단순하게 정리할 수 없다.  
  
이유는 절댓값 때문이다. convex 함수이므로 전역 최적해는 보장되지만, $w_j=0$에서 미분이 존재하지 않아 Ridge와 같은 closed-form solution으로 단순하게 정리할 수 없다. 
  
$$ \frac{d}{dw_j}|w_j| = \begin{cases} 1,&w_j>0\\ -1,&w_j<0 \end{cases} $$    
$w_j=0$에서는 일반적인 미분이 존재하지 않는다.  
따라서, subgradient, coordinate descent, proximal gradient 등의 최적화 방법론을 적용하여 해를 구해야 한다 .   
    
우린 목적함수를 정의하고, 해를 구할수 있게 되었다.   

![](https://blog.kakaocdn.net/dna/qxDqw/dJMcags7q1l/AAAAAAAAAAAAAAAAAAAAAIP9gSk1-QiKNvW9obpONNr06MGFf4p8i-biJxz1IAYm/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=OWOk4rnj8s%2FpFa63txNh%2FkUI31w%3D)

prior 는 해당 과정을 베이지안 측면에서 설명한 것이다. 계수의 사전분포가 Gaussian이면 MAP 추정이 Ridge에, Laplace이면 Lasso에 대응한다는 설명이다. 

#### 현실의 데이터는 어떻게 작동하는가

자 이제 다시 현실로 돌아올 시간이다. 다음은 실제 존재할만한 스프레드 시트를 matrix 형태로 구현한 것이다. 앞서 배운 과정을 통해 Ridge Lasso 를 구현해보고자 하니 그 과정 하나하나를 온전히 따라가길 바란다 (사실 앞으로 설명할 이 부분이 가장 중요하다고 생각한다)

아래 8개의 데이터를 사용해보자.

| 관측치 | $x_1$ | $x_2$ | $y$ |
|---:|---:|---:|---:|
| 1 | -1 | -1 | 15.2 |
| 2 | -1 | -1 | 14.8 |
| 3 | -1 | 1 | 16.4 |
| 4 | -1 | 1 | 16.0 |
| 5 | 1 | -1 | 23.8 |
| 6 | 1 | -1 | 24.2 |
| 7 | 1 | 1 | 26.1 |
| 8 | 1 | 1 | 25.5 |

절편까지 포함하면 모델은 다음과 같다.

$$
\hat y=b+w_1x_1+w_2x_2
$$

따라서 실제 설계행렬 $X$, 가중치 $w$, 정답 $y$는 다음과 같다.

$$
X=
\begin{bmatrix}
1&-1&-1\\
1&-1&-1\\
1&-1&1\\
1&-1&1\\
1&1&-1\\
1&1&-1\\
1&1&1\\
1&1&1
\end{bmatrix},
\qquad
w=
\begin{bmatrix}
b\\
w_1\\
w_2
\end{bmatrix},
\qquad
y=
\begin{bmatrix}
15.2\\
14.8\\
16.4\\
16.0\\
23.8\\
24.2\\
26.1\\
25.5
\end{bmatrix}
$$

예측값 전체를 행렬로 쓰면:

$$
Xw=
\begin{bmatrix}
1&-1&-1\\
1&-1&-1\\
1&-1&1\\
1&-1&1\\
1&1&-1\\
1&1&-1\\
1&1&1\\
1&1&1
\end{bmatrix}
\begin{bmatrix}
b\\
w_1\\
w_2
\end{bmatrix}
=
\begin{bmatrix}
b-w_1-w_2\\
b-w_1-w_2\\
b-w_1+w_2\\
b-w_1+w_2\\
b+w_1-w_2\\
b+w_1-w_2\\
b+w_1+w_2\\
b+w_1+w_2
\end{bmatrix}
$$

#### 1. OLS 계산

OLS의 해는 다음과 같다.

$$
\hat w_{\mathrm{OLS}}
=
(X^\top X)^{-1}X^\top y
$$

실제 숫자를 넣어 $X^\top X$를 계산하면:

$$
X^\top X
=
\begin{bmatrix}
1&1&1&1&1&1&1&1\\
-1&-1&-1&-1&1&1&1&1\\
-1&-1&1&1&-1&-1&1&1
\end{bmatrix}
\begin{bmatrix}
1&-1&-1\\
1&-1&-1\\
1&-1&1\\
1&-1&1\\
1&1&-1\\
1&1&-1\\
1&1&1\\
1&1&1
\end{bmatrix}
=
\begin{bmatrix}
8&0&0\\
0&8&0\\
0&0&8
\end{bmatrix}
$$

그리고 $X^\top y$는:

$$
X^\top y
=
\begin{bmatrix}
1&1&1&1&1&1&1&1\\
-1&-1&-1&-1&1&1&1&1\\
-1&-1&1&1&-1&-1&1&1
\end{bmatrix}
\begin{bmatrix}
15.2\\
14.8\\
16.4\\
16.0\\
23.8\\
24.2\\
26.1\\
25.5
\end{bmatrix}
=
\begin{bmatrix}
162\\
37.2\\
6
\end{bmatrix}
$$

따라서 OLS의 가중치는:

$$
\hat w_{\mathrm{OLS}}
=
\begin{bmatrix}
8&0&0\\
0&8&0\\
0&0&8
\end{bmatrix}^{-1}
\begin{bmatrix}
162\\
37.2\\
6
\end{bmatrix}
=
\begin{bmatrix}
1/8&0&0\\
0&1/8&0\\
0&0&1/8
\end{bmatrix}
\begin{bmatrix}
162\\
37.2\\
6
\end{bmatrix}
=
\begin{bmatrix}
20.25\\
4.65\\
0.75
\end{bmatrix}
$$

즉, OLS 모델은 다음과 같다.

$$
\boxed{
\hat y=20.25+4.65x_1+0.75x_2
}
$$

#### 2. Ridge 계산

이번에는 $\lambda=4$인 Ridge를 적용해보자.

절편은 규제하지 않으므로 단위행렬 $I$를 그대로 사용하는 것이 아니라 다음 행렬을 사용한다.

$$
P=
\begin{bmatrix}
0&0&0\\
0&1&0\\
0&0&1
\end{bmatrix}
$$

Ridge의 해는:

$$
\hat w_{\mathrm{Ridge}}
=
(X^\top X+\lambda P)^{-1}X^\top y
$$

실제 숫자를 넣으면:

$$
X^\top X+\lambda P
=
\begin{bmatrix}
8&0&0\\
0&8&0\\
0&0&8
\end{bmatrix}
+
4
\begin{bmatrix}
0&0&0\\
0&1&0\\
0&0&1
\end{bmatrix}
=
\begin{bmatrix}
8&0&0\\
0&12&0\\
0&0&12
\end{bmatrix}
$$

따라서:

$$
\hat w_{\mathrm{Ridge}}
=
\begin{bmatrix}
8&0&0\\
0&12&0\\
0&0&12
\end{bmatrix}^{-1}
\begin{bmatrix}
162\\
37.2\\
6
\end{bmatrix}
=
\begin{bmatrix}
1/8&0&0\\
0&1/12&0\\
0&0&1/12
\end{bmatrix}
\begin{bmatrix}
162\\
37.2\\
6
\end{bmatrix}
=
\begin{bmatrix}
20.25\\
3.10\\
0.50
\end{bmatrix}
$$

따라서 Ridge 모델은:

$$
\boxed{
\hat y_{\mathrm{Ridge}}
=
20.25+3.10x_1+0.50x_2
}
$$

OLS와 비교해보면:

$$
\begin{bmatrix}
20.25\\
4.65\\
0.75
\end{bmatrix}
\quad\longrightarrow\quad
\begin{bmatrix}
20.25\\
3.10\\
0.50
\end{bmatrix}
$$

절편 $20.25$는 그대로지만, $w_1$과 $w_2$는 모두 0에 가까워졌다. 이게 Ridge가 가중치를 축소하는 실제 과정이다.

#### 3. Lasso 계산

Lasso의 목적함수는 다음과 같다.

$$
J(b,w_1,w_2)
=
\|y-Xw\|_2^2
+
\lambda(|w_1|+|w_2|)
$$

여기서 중요한 차이가 있다.

Lasso는 절댓값 때문에 Ridge처럼 다음 형태의 역행렬로 풀리지 않는다.

$$
(X^\top X+\lambda I)^{-1}X^\top y
$$

다만 지금 데이터처럼 $x_1$과 $x_2$가 서로 직교하면, Lasso의 해를 soft-thresholding으로 직접 볼 수 있다.

$$
\hat w_j^{\mathrm{Lasso}}
=
\frac{
\operatorname{sign}(x_j^\top y)
\max\left(
|x_j^\top y|-\lambda/2,\ 0
\right)
}{
x_j^\top x_j
}
$$

현재 데이터에서는:

$$
x_1^\top y=37.2,
\qquad
x_2^\top y=6
$$

그리고:

$$
x_1^\top x_1=x_2^\top x_2=8
$$

$\lambda=4$를 적용하면 $\lambda/2=2$이다.

첫 번째 가중치는:

$$
\hat w_1^{\mathrm{Lasso}}
=
\frac{
\max(37.2-2,0)
}{8}
=
\frac{35.2}{8}
=
4.40
$$

두 번째 가중치는:

$$
\hat w_2^{\mathrm{Lasso}}
=
\frac{
\max(6-2,0)
}{8}
=
\frac{4}{8}
=
0.50
$$

절편은 규제하지 않으므로 그대로 $20.25$이다.

$$
\boxed{
\hat y_{\mathrm{Lasso}}
=
20.25+4.40x_1+0.50x_2
}
$$

##### Lasso가 가중치를 0으로 만드는 모습

이번에는 $\lambda=12$로 올려보자.

$$
\frac{\lambda}{2}=6
$$

첫 번째 가중치는:

$$
\hat w_1
=
\frac{\max(37.2-6,0)}{8}
=
3.90
$$

두 번째 가중치는:

$$
\hat w_2
=
\frac{\max(6-6,0)}{8}
=
0
$$

따라서:

$$
\boxed{
\hat y_{\mathrm{Lasso}}
=
20.25+3.90x_1+0x_2
}
$$

결국 $x_2$가 모델에서 완전히 사라진다.

세 모델의 가중치를 한 번에 비교하면 다음과 같다.

$$
\begin{array}{c|ccc}
 & b & w_1 & w_2\\
\hline
\text{OLS} & 20.25 & 4.65 & 0.75\\
\text{Ridge }(\lambda=4) & 20.25 & 3.10 & 0.50\\
\text{Lasso }(\lambda=4) & 20.25 & 4.40 & 0.50\\
\text{Lasso }(\lambda=12) & 20.25 & 3.90 & 0
\end{array}
$$

핵심은 이렇다.

- Ridge: $X^\top X$의 대각성분에 $\lambda$를 더해 모든 가중치를 부드럽게 축소한다.
- Lasso: 각 가중치에서 일정한 크기를 깎고, 그 값이 0을 넘어가면 정확히 0에서 멈춘다.
- 절편: 규제 행렬의 첫 번째 대각성분을 0으로 두기 때문에 축소되지 않는다.
  
### Ridge-Lasso Graph 에 대해  

사실 Ridge, Lasso 를 배우면서 빠질수 없는 부분이 시각화 이다. **정말 모든 교과서에 실려있는 그래프 이지만**  
**그 원리를 설명할수 있는 사람은 많지 않은거 같다**. 이번 기회에 그래프도 확실하게 이해 해보자  
일단 뭐든 그래프를 보면, 무작정 보고 겁먹는게 아니라, 체계적으로 어떻게 읽어야 할지 계획을 세워야 한다   

![](https://blog.kakaocdn.net/dna/ylc39/dJMb99OdE5A/AAAAAAAAAAAAAAAAAAAAAI4Fc8Y7l8uTrQ79Df2LHWI98oQviNt8-M6k2Nyp_5LJ/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=nqwi0yqwGn8AEZMglzMonRuf0zk%3D)

나는 다음과 같은 과정을 거쳐 그래프를 읽을거다   
1\. 축의 의미   
2\. 저 빨간 타원은 뭔가   
3\. 빨간 타원의 중심은 뭔가   
4\. 도형은 어떤 의미를 가지는가   
5\. 도형과 타원의 접점은 뭔가   
6\. 접점이 축 위에 있는 경우는 무엇인가   
  
1\. 축의 의미 : 가로축과 세로축은 가중치이다. 
$\hat y=\beta_1x_1+\beta_2x_2$ 가로축: $\beta_1$ 세로축: $\beta_2$ 
따라서 점 하나가 모델 하나이다.     
$$ (3,2) \quad\Longleftrightarrow\quad \hat y=3x_1+2x_2 $$
우리는 이 평면에서 가장 좋은 가중치 조합을 찾고 있다  

2\. 저 빨간 타원은 뭔가 : 각 가중치 조합 $(\beta_1,\beta_2)$에 대해 훈련오차를 계산할 수 있다.    
$$ RSS(\beta_1,\beta_2) = \sum_{i=1}^n \left( y_i-\beta_1x_{i1}-\beta_2x_{i2} \right)^2 $$  빨간 타원 하나는 **동일한 RSS를 만드는 가중치 조합들을 연결한 등고선**이다. 
예를 들어 서로 다른 모델:  
$$ (\beta_1,\beta_2)=(1,3) $$
$$ (\beta_1,\beta_2)=(2,2) $$가 똑같은 RSS를 만든다면 같은 빨간 타원 위에 위치할 수 있다.  
같은 고도를 칠해놓은 등고선 지도로 생각하면 쉽다.  
  
-   같은 등고선: 같은 높이  
-   같은 빨간 타원: 같은 RSS  
-   안쪽 타원: 작은 RSS  
-   바깥쪽 타원: 큰 RSS  
  
3\. 빨간 타원의 중심은 무엇인가? : 타원의 중심에 있는 $\hat\beta$는 **제약이 없을 때 RSS를 가장 작게 만드는 OLS 해**이다.  $$ \hat\beta_{\mathrm{OLS}} = \arg\min_\beta RSS(\beta) $$ 즉:   
$$ \hat\beta_{\mathrm{OLS}} = \begin{bmatrix} \hat\beta_1\\ \hat\beta_2 \end{bmatrix} $$는 훈련 데이터를 가장 잘 맞추는 가중치 조합이다.  
중심에서 멀어질수록 RSS가 증가한다.  
Ridge나 Lasso 같은 제약이 없다면 타원의 중심인 OLS 해를 선택하면 된다.  
  
4\. 파란색 도형은 어떤 의미를 가지는가?: 파란색 도형은 **사용이 허용된 가중치의 범위**, 즉 feasible region이다.  
Ridge의 제약은:  $$ \beta_1^2+\beta_2^2\leq t $$이다. (생긴게 그냥 원 그래프 같이 생겼다)
이를 그래프로 그리면 원 내부가 된다. $$ \boxed{\text{Ridge}=L2=\text{원}} $$Ridge는 가중치 제곱의 합이 일정 크기를 넘지 못하게 한다. 이제 라쏘를 한번 봐보자

Lasso의 제약은:   $$ |\beta_1|+|\beta_2|\leq t $$이다.  
이를 그래프로 그리면 마름모 내부가 된다.  $$ \boxed{\text{Lasso}=L1=\text{마름모}} $$즉, Ridge와 Lasso 모두 다음과 같이 말한다.  
OLS처럼 아무 가중치나 선택하지 말고, 파란색 영역 안에서만 선택해야 한다.  

5\. 도형과 타원의 접점은 무엇인가?

앞서 파란색 도형은 사용이 허용된 가중치의 범위라고 했다. 그렇다면 이제 이 영역 안에 있는 수많은 점 중 하나를 선택해야 한다.

당연히 아무 점이나 선택하면 안 된다. 허용된 영역 안에서 RSS가 가장 작은 점을 선택해야 한다.

이를 찾기 위해 OLS 해가 있는 타원의 중심에서부터 생각해보자. 중심에 가까운 타원일수록 RSS가 작지만, OLS 해가 파란색 영역 밖에 있다면 그 점은 선택할 수 없다.

따라서 OLS 해를 중심으로 RSS 등고선을 작은 것부터 바깥쪽으로 확장한다.

그러다 빨간 타원이 파란색 영역과 처음 만나는 순간이 생긴다.

바로 이 최초의 접점이 허용 영역 안에서 가장 작은 RSS를 만드는 가중치 조합이다.

$$
\boxed{
\hat\beta_{\mathrm{regularized}}
=
\arg\min_{\beta\in\text{feasible region}}RSS(\beta)
}
$$

여기서 한 가지 연결하고 넘어가자.

앞에서는 목적함수에 벌점을 더하는 방식으로 Ridge와 Lasso를 표현했다.

$$
RSS(\beta)+\lambda\|\beta\|
$$

하지만 지금 그래프에서는 가중치가 들어갈 수 있는 영역을 제한하는 방식으로 표현하고 있다.

$$
\|\beta\|\leq t
$$

두 방식은 서로 다른 이야기가 아니다. 적절한 $\lambda$와 $t$를 선택하면 같은 해를 만든다.

$\lambda$가 커질수록 가중치에 강한 벌점이 적용되고, 이에 대응하는 허용 영역의 크기 $t$는 작아진다.

즉,

$$
\lambda\uparrow
\quad\Longleftrightarrow\quad
t\downarrow
$$

결국 목적함수에 벌점을 추가한다는 말과, 가중치가 움직일 수 있는 영역을 제한한다는 말은 같은 현상을 서로 다른 관점에서 표현한 것이다.

6\. 접점이 축 위에 있는 경우는 무엇인가?  
접점이 축 위에 있으면 가중치 중 하나가 정확히 0이라는 뜻이다.  
세로축 $\beta_2$ 위에서 접한 경우 
점이:  $$ (\beta_1,\beta_2)=(0,c) $$이므로:  $$ \beta_1=0 $$이다.  
모델은:  
$$ \hat y=0x_1+cx_2=cx_2 $$
가 되어 $x_1$을 사용하지 않는다.  (해당 원리가 Lasso 의 Feature selection 기능이다)

Lasso와 Ridge의 차이  
Lasso의 마름모는 꼭짓점이 축 위에 있다.  
따라서 빨간 타원이 꼭짓점에 접할 가능성이 높고:  
$$ \beta_j=0 $$인 해가 잘 만들어진다.  
즉, Lasso는 feature selection을 수행한다.  
Ridge의 원은 매끄럽고 꼭짓점이 없다. 따라서 보통 축에서 약간 떨어진 곳에 접한다.예를 들어: $$ (\beta_1,\beta_2)=(0.05,0.8) $$처럼 $\beta_1$이 매우 작아질 수는 있지만 보통 정확히 0이 되지는 않는다.  
$$ \boxed{\text{Lasso: 일부 가중치를 0으로}} $$
$$ \boxed{\text{Ridge: 모든 가중치를 작게 축소}} $$
So-what?     
이제 이 각 요소를 하나로 묶어 스토리로 이해하면 된다  

> 그래프의 점 하나는 하나의 가중치 조합, 즉 하나의 모델이다. 빨간 타원은 같은 훈련오차를 만드는 모델들을 연결한 등고선이고, 그 중심은 훈련오차가 가장 작은 OLS 해이다. 하지만 OLS는 훈련오차만 최소화하므로, multicollinearity나 데이터 부족 상황에서는 큰 가중치를 가진 불안정한 해를 선택할 수 있다. Ridge와 Lasso는 이를 막기 위해 목적함수에 가중치 크기에 대한 벌점을 추가한다. 이 벌점을 제약식으로 표현하면 Ridge는 원(제곱), Lasso는 마름모(절댓값) 형태의 허용 영역이 된다. OLS 해가 이 영역 밖에 있다면, 영역 안에서 RSS가 가장 작은 지점인 빨간 타원과 도형의 최초 접점을 선택한다. Ridge의 L2 벌점을 미분하면 $X^\top X+\lambda I$가 나타나며, 이는 가중치를 축소하는 동시에 행렬을 invertible하게 만든다. Lasso의 L1 제약은 마름모의 꼭짓점이 축 위에 있으므로 일부 가중치를 정확히 0으로 만들기 쉽다. 결국 훈련오차를 약간 희생하는 대신 모델을 안정화하고 새로운 데이터에서의 오차를 줄이는 것이 목적이다.  
### Bias-Variance trade-off 와 double descent

![[Pasted image 20260822154015.png|439]]

앞선 설명에서 우린 람다를 모델의 복잡도라는 말로 퉁치고 넘어갔다. 이제부터 motivation에서 말한 overfitting에 대해 말해볼까 한다. 그걸 이제야 말한다고 원망한다면... 내 나름대로 이유가 있다. 처음 overfitting에 대해 배우게 되면 직관적으로 쉬운 개념이라 이해했다고 착각하기 쉽다. 막상 모델에서 해당 직관이 어떻게 작동하는지 수식으로 이해하는 건 다른 문제인 것 같다. 따라서 앞서 말한 Ridge Lasso 에 대해 설명해 줄 필요가 있었으며, 해당 모델과 복잡도 그리고 bias-variance trade-off 를 한대 묶어 설명하면 조금 더 수식속에서 직관이 어떻게 작동하는지 이해를 도울 수 있지 않을까 하는 나의 생각이었다. 부디 너그럽게 읽어주길 바란다

![[Pasted image 20260823004756.png|365]]

위 그래프를 살펴보자.

먼저 하나를 확실히 구분해야 한다. 모델의 복잡도와 $\lambda$는 같은 방향으로 움직이지 않는다. 둘은 반대로 움직인다.

$\lambda$가 증가하면 가중치에 더 강한 벌점이 적용된다. 가중치가 작아지면서 모델은 단순해지고, Bias²는 증가하지만 Variance는 감소한다.

$$
\lambda\uparrow
\quad\Longrightarrow\quad
\text{모델 복잡도}\downarrow
\quad\Longrightarrow\quad
\text{Bias}^2\uparrow,\quad
\text{Variance}\downarrow
$$

반대로 $\lambda$가 감소하면 벌점이 약해진다. 모델은 훈련 데이터에 더 자유롭게 맞춰질 수 있으므로 복잡해지고, Bias²는 감소하지만 Variance는 증가한다.

$$
\lambda\downarrow
\quad\Longrightarrow\quad
\text{모델 복잡도}\uparrow
\quad\Longrightarrow\quad
\text{Bias}^2\downarrow,\quad
\text{Variance}\uparrow
$$

또한 전체 오류는 무조건 그래프의 한가운데에서 가장 작아지는 것이 아니다. Bias²와 Variance의 합이 가장 작아지는 어떤 지점에서 최소가 된다. 우리가 찾고 싶은 것도 바로 그 지점이다.

이걸 어떻게 읽어야 할까? 다시 글의 처음에 했던 문제집 이야기로 돌아가보자.

가장 단순한 경우는 문제집의 답을 거의 외우지 않고, 아주 기본적인 공식 몇 개만 알고 시험장에 들어가는 학생이다. 이 학생은 어떤 문제를 만나더라도 자신이 아는 몇 개의 공식만 반복해서 사용한다.

문제집이 바뀌어도 풀이 방식은 크게 달라지지 않는다. 즉, 학습 데이터가 달라져도 결과가 크게 흔들리지 않으므로 Variance는 낮다.

하지만 너무 적은 공식만 알고 있기 때문에 문제의 구조를 충분히 설명하지 못한다. 쉬운 문제조차 제대로 풀지 못할 수 있다. 즉, Bias는 높다.

$$
\boxed{
\text{너무 단순한 공부}
\rightarrow
\text{High Bias, Low Variance}
}
$$

반대로 문제집의 모든 문제와 답을 통째로 외운 학생을 생각해보자.

이 학생은 자신이 공부한 문제집에서는 거의 모든 문제를 맞힐 수 있다. 훈련오차만 보면 완벽한 모델이다. 따라서 현재 문제집에 대한 Bias는 매우 낮다.

하지만 숫자나 조건이 조금만 바뀌어도 외워둔 답을 사용할 수 없게 된다. 어떤 문제집으로 공부했는지에 따라 시험 결과가 크게 달라지는 것이다.

즉, 학습 데이터의 작은 변화에 결과가 크게 흔들리므로 Variance가 높다.

$$
\boxed{
\text{문제집의 답을 전부 암기}
\rightarrow
\text{Low Bias, High Variance}
}
$$

그렇다면 좋은 공부는 무엇일까?

공식을 몇 개만 외우고 모든 문제에 억지로 적용하는 것도 아니고, 문제집의 답을 전부 외우는 것도 아니다.

여러 문제를 직접 풀어보면서 반복해서 등장하는 구조와 원리를 이해해야 한다. 그래야 처음 보는 문제가 나와도 지금까지 배운 원리를 사용해 해결할 수 있다.

머신러닝도 똑같다.

모델이 너무 단순하면 데이터의 구조를 제대로 학습하지 못한다. 반대로 모델이 너무 복잡하면 데이터 속의 원리가 아니라 학습 데이터의 답과 noise까지 외워버린다.

우리가 원하는 것은 훈련 데이터를 완벽하게 외우는 모델이 아니다. 훈련 데이터에서 반복되는 구조를 학습하고, 처음 보는 데이터에서도 그 구조를 사용할 수 있는 모델이다.

$$
\boxed{
\text{좋은 모델}
=
\text{적절한 Bias}
+
\text{적절한 Variance}
}
$$

Regularization에서 $\lambda$를 조절하는 것은 결국 모델이 어느 정도까지 문제집을 외우도록 허용할 것인지를 결정하는 일이다.

$\lambda$가 너무 크면 모델에게 사용할 수 있는 풀이 방법을 지나치게 제한한다. 모델은 단순하고 안정적이지만 문제를 충분히 설명하지 못한다.

반대로 $\lambda$가 너무 작으면 모델이 문제집의 세부적인 답과 noise까지 외우도록 내버려 둔다. 훈련 데이터에서는 뛰어나지만 새로운 데이터에서는 결과가 흔들릴 수 있다.

결국 적절한 $\lambda$를 찾는다는 것은, 문제집의 답을 외우는 것과 문제의 원리를 이해하는 것 사이에서 가장 적절한 지점을 찾는 일이다.

#### Bias Variance decomposition
![[Pasted image 20260823004807.png|363]]

그럼 결국 적절함이란 추상적인 개념을 판단하는 문제로 넘어가게 된다.

단순히 “Bias는 조금 높고 Variance는 조금 낮은 것 같다”라는 감각만으로 모델을 선택할 수는 없다. 우리가 궁금한 것은 결국 새로운 데이터에서 발생하는 전체 오차이며, 그 오차가 정확히 무엇으로 구성되어 있는지를 확인해야 한다.

놀랍게도 새로운 데이터에 대한 모델의 전체 오차는 크게 세 부분으로 분해할 수 있다.

$$
\boxed{
\mathbb{E}\left[(y-\hat f(x))^2\right]
=
\operatorname{Bias}[\hat f(x)]^2
+
\operatorname{Var}[\hat f(x)]
+
\sigma^2
}
$$

하나씩 살펴보자.

왼쪽에 있는 식부터 시작하겠다.

$$
\mathbb{E}\left[(y-\hat f(x))^2\right]
$$

$y$는 실제값이고, $\hat f(x)$는 우리가 학습한 모델의 예측값이다. 따라서 $y-\hat f(x)$는 실제값과 예측값의 차이, 즉 예측오차이다.

이를 제곱하고 평균을 구했으니 왼쪽 식은 새로운 데이터에서 발생할 것으로 기대되는 전체 예측오차를 의미한다.

그렇다면 오른쪽에 있는 세 항은 무엇일까?

$$
\operatorname{Bias}[\hat f(x)]^2
$$

첫 번째는 Bias²이다.

Bias는 여러 학습 데이터로 모델을 반복해서 만들었을 때, 모델들의 평균적인 예측이 실제 함수로부터 얼마나 떨어져 있는지를 의미한다.

$$
\operatorname{Bias}[\hat f(x)]
=
\mathbb{E}[\hat f(x)]-f(x)
$$

여기서 $f(x)$는 현실에 존재하는 진짜 함수이고, $\mathbb{E}[\hat f(x)]$는 서로 다른 학습 데이터로 만든 모델들의 평균적인 예측이다.

즉, 모델을 여러 번 학습하더라도 평균적으로 계속 정답에서 벗어나 있다면 Bias가 높은 것이다.

문제집 비유로 돌아가면, 기본 공식 몇 개만 가지고 모든 문제를 풀려고 하는 학생이다. 문제집이 바뀌어도 늘 비슷하게 풀지만, 풀이 방식 자체가 지나치게 단순하기 때문에 평균적으로 계속 오답을 낸다.

두 번째는 Variance이다.

$$
\operatorname{Var}[\hat f(x)]
=
\mathbb{E}
\left[
\left(
\hat f(x)-\mathbb{E}[\hat f(x)]
\right)^2
\right]
$$

Variance는 학습 데이터가 달라질 때 모델의 예측이 얼마나 크게 변하는지를 나타낸다.

문제집 A로 공부했을 때와 문제집 B로 공부했을 때 학생의 풀이 방식이 완전히 달라진다면 Variance가 높은 것이다.

문제집의 답을 통째로 외운 학생이 여기에 해당한다. 자신이 외운 문제집에서는 완벽하지만, 문제집이 바뀌면 결과가 크게 흔들린다.

마지막은 $\sigma^2$이다.

$$
\sigma^2
=
\operatorname{Var}(\epsilon)
$$

이는 irreducible error, 즉 모델이 아무리 좋아도 제거할 수 없는 오차이다.

현실의 데이터는 다음과 같이 만들어졌다고 가정한다.

$$
y=f(x)+\epsilon
$$

$f(x)$는 우리가 학습하고 싶은 진짜 패턴이고, $\epsilon$은 측정오차나 관찰하지 못한 변수처럼 데이터에 포함된 우연한 noise이다.

아무리 완벽한 모델을 만들더라도 이 noise까지 정확하게 예측할 수는 없다. 따라서 $\sigma^2$은 모델의 복잡도를 조절한다고 해서 제거할 수 있는 오차가 아니다.

정리하면 다음과 같다.

$$
\boxed{
\begin{aligned}
\text{Bias}^2
&=\text{모델이 지나치게 단순해서 발생하는 오차}\\
\text{Variance}
&=\text{학습 데이터의 변화에 민감해서 발생하는 오차}\\
\sigma^2
&=\text{모델이 제거할 수 없는 데이터 자체의 noise}
\end{aligned}
}
$$

그런데 대체 왜 전체 오차가 이 세 가지로 분해되는 걸까?

직접 수식을 펼쳐보자.

실제값은 다음과 같이 표현할 수 있다.

$$
y=f(x)+\epsilon
$$

이를 전체 예측오차에 대입하면:

$$
\mathbb{E}\left[(y-\hat f(x))^2\right]
=
\mathbb{E}
\left[
\left(
f(x)+\epsilon-\hat f(x)
\right)^2
\right]
$$

여기서 Bias와 Variance를 분리하기 위해 모델들의 평균 예측인 $\mathbb{E}[\hat f(x)]$를 더했다가 다시 빼준다.

$$
f(x)+\epsilon-\hat f(x)
=
\left(
f(x)-\mathbb{E}[\hat f(x)]
\right)
+
\left(
\mathbb{E}[\hat f(x)]-\hat f(x)
\right)
+
\epsilon
$$

이제 각각의 의미가 보이기 시작한다.

$$
f(x)-\mathbb{E}[\hat f(x)]
$$

이 부분은 진짜 함수와 모델들의 평균 예측 사이의 차이이므로 Bias에 해당한다.

$$
\mathbb{E}[\hat f(x)]-\hat f(x)
$$

이 부분은 개별 모델이 모델들의 평균으로부터 얼마나 벗어났는지를 나타내므로 Variance와 연결된다.

마지막 $\epsilon$은 데이터 자체의 noise이다.

이 세 항을 제곱하여 전개하면 교차항들이 생긴다. 하지만 noise의 평균이 0이고:

$$
\mathbb{E}[\epsilon]=0
$$

개별 모델이 평균 예측에서 벗어난 값의 평균도 0이므로:

$$
\mathbb{E}
\left[
\hat f(x)-\mathbb{E}[\hat f(x)]
\right]
=0
$$

기댓값을 취했을 때 교차항들은 모두 사라진다.

결국 남는 것은 다음 세 항이다.

$$
\mathbb{E}\left[(y-\hat f(x))^2\right]
=
\left(
f(x)-\mathbb{E}[\hat f(x)]
\right)^2
+
\mathbb{E}
\left[
\left(
\hat f(x)-\mathbb{E}[\hat f(x)]
\right)^2
\right]
+
\mathbb{E}[\epsilon^2]
$$

각 항의 이름을 다시 붙이면:

$$
\boxed{
\text{Expected Test Error}
=
\text{Bias}^2
+
\text{Variance}
+
\text{Irreducible Error}
}
$$

이제 앞에서 보았던 그래프를 조금 더 정확하게 읽을 수 있다.

$\lambda$를 크게 하면 모델이 단순해진다. 모델이 학습 데이터의 변화에는 덜 흔들리므로 Variance는 감소하지만, 현실의 복잡한 패턴을 충분히 표현하지 못해 Bias²는 증가한다.

반대로 $\lambda$를 작게 하면 모델이 복잡해진다. 훈련 데이터에 더 세밀하게 맞출 수 있으므로 Bias²는 감소하지만, 학습 데이터가 조금만 달라져도 모델이 크게 변하기 때문에 Variance는 증가한다.

따라서 우리가 찾는 적절한 $\lambda$는 Bias와 Variance가 같아지는 지점이 아니다.

$$
\boxed{
\lambda^*
=
\arg\min_\lambda
\left[
\operatorname{Bias}_\lambda^2
+
\operatorname{Variance}_\lambda
\right]
}
$$

Bias²와 Variance의 합, 즉 새로운 데이터에 대한 전체 오차가 가장 작아지는 지점이 우리가 찾는 적절한 $\lambda$이다.

결국 Regularization은 단순히 가중치를 작게 만드는 기술이 아니다.

**조금의 Bias를 의도적으로 받아들이는 대신 Variance를 크게 줄여, 새로운 데이터에서의 전체 오차를 낮추는 방법이다.**

### Wrap-up

길게 돌아왔다.

시작은 단순한 역행렬 문제였다.

OLS의 해는 다음과 같이 구할 수 있었다.

$$
\hat w_{\mathrm{OLS}}
=
(X^\top X)^{-1}X^\top y
$$

하지만 $X^\top X$의 역행렬이 존재하지 않거나, 존재하더라도 데이터의 작은 변화에 해가 크게 흔들린다면 이 식을 그대로 믿기는 어렵다.

이 문제를 해결하기 위해 우린 가중치에 벌점을 추가했다.

$$
\text{목적함수}
=
\text{기존 오차}
+
\lambda\times\text{가중치에 대한 벌점}
$$

가중치 제곱의 합을 벌점으로 사용하면 Ridge가 되고:

$$
\lambda\|w\|_2^2
$$

가중치 절댓값의 합을 벌점으로 사용하면 Lasso가 된다.

$$
\lambda\|w\|_1
$$

Ridge는 모든 가중치를 0에 가깝게 축소해 모델을 안정화한다. Lasso는 일부 가중치를 정확히 0으로 만들면서 feature selection의 효과까지 만들어낸다.

처음에는 단순히 목적함수 뒤에 벌점 하나를 추가한 것처럼 보였다. 하지만 실제 행렬을 펼쳐보고, 그래프의 원과 마름모를 따라가다 보니 이 작은 벌점이 모델의 해 자체를 어떻게 바꾸는지 확인할 수 있었다.

그리고 마지막에는 그 변화가 새로운 데이터에 대한 오차와 어떤 관계를 가지는지 살펴보았다.

$$
\text{Expected Test Error}
=
\text{Bias}^2
+
\text{Variance}
+
\text{Irreducible Error}
$$

$\lambda$를 크게 하면 모델은 단순해진다. Variance는 감소하지만 Bias²는 증가한다.

반대로 $\lambda$를 작게 하면 모델은 복잡해진다. Bias²는 감소하지만 Variance는 증가한다.

따라서 좋은 모델은 Bias가 가장 작은 모델도 아니고, Variance가 가장 작은 모델도 아니다.

새로운 데이터에 대한 전체 오차가 가장 작은 모델이다.

$$
\boxed{
\lambda^*
=
\arg\min_\lambda
\left[
\operatorname{Bias}_\lambda^2
+
\operatorname{Variance}_\lambda
\right]
}
$$

이제 글의 처음에 했던 문제집 이야기로 다시 돌아가보자.

나는 수학을 공부하면서 문제의 원리를 이해하기보다 답지의 풀이를 통째로 외웠다. 당시에는 문제집의 답을 많이 기억할수록 수학을 잘하게 된다고 생각했다.

하지만 시험장에서는 내가 외운 문제와 조금만 다른 문제가 나와도 풀지 못했다.

지금 생각해보면 나는 훈련 데이터에는 너무나 잘 맞지만, 새로운 데이터에는 제대로 대응하지 못하는 모델과 비슷했다.

그렇다면 overfitting은 단순히 “많이 외운 상태”일까?

이제는 조금 더 정확하게 대답할 수 있다.

> Overfitting은 모델이 학습 데이터의 구조뿐만 아니라 그 데이터에만 존재하는 우연한 noise까지 학습하여, 학습 데이터가 조금만 달라져도 예측이 크게 흔들리는 상태이다.

즉, 낮은 훈련오차 그 자체가 문제인 것은 아니다.

그 낮은 훈련오차를 얻기 위해 모델이 무엇을 학습했는지가 중요하다. 데이터 안에 반복해서 나타나는 구조를 학습했다면 새로운 데이터에서도 사용할 수 있다. 하지만 특정 데이터의 답과 noise를 외웠다면 문제집이 바뀌는 순간 무너진다.

Regularization은 모델에게 아무것도 외우지 말라고 하는 방법이 아니다.

무엇까지 학습하고, 무엇부터는 포기해야 하는지 경계를 만들어주는 방법이다.

$$
\boxed{
\text{Regularization}
=
\text{훈련오차를 조금 포기하고 일반화 성능을 얻는 것}
}
$$

결국 Ridge와 Lasso가 던지는 질문은 같다.

**훈련 데이터를 얼마나 완벽하게 설명할 것인가가 아니라, 아직 보지 못한 데이터에서도 작동하는 해를 어떻게 선택할 것인가?**

이 질문은 선형회귀에서 끝나지 않는다.

앞으로 만나게 될 거의 모든 머신러닝 모델은 서로 다른 방식으로 모델의 복잡도를 조절하고, 수많은 가능한 해 중 일반화가 잘되는 해를 찾으려고 한다.

물론 현대의 거대한 모델로 넘어가면 이야기는 다시 복잡해진다.

전통적인 Bias-Variance Trade-off에 따르면 모델이 지나치게 복잡해질수록 test error는 다시 증가해야 한다. 그런데 parameter가 데이터보다 훨씬 많은 일부 현대 모델에서는, 복잡도를 더 높였더니 test error가 다시 감소하는 현상이 관찰된다.

이것이 Double Descent이다.

하지만 이 이야기를 제대로 이해하려면 단순히 “큰 모델이 더 좋다”라는 결론으로 넘어가서는 안 된다. 모델의 크기, 학습 알고리즘, 데이터의 구조 그리고 implicit regularization이 어떤 관계를 가지는지 다시 살펴봐야 한다.

긴 여정을 한 문장으로 정리해보자.

> 좋은 모델은 문제집의 답을 가장 많이 외운 모델이 아니라, 처음 보는 문제에도 사용할 수 있는 원리를 학습한 모델이다.

처음 수학을 공부할 때 이 사실을 알았다면 조금 덜 헤맸을지도 모르겠다.

뭐, 이제라도 알았으니 됐다.

## 관련 글

- [[회귀분석 시작 전 꼭 알아야 할 개념과 흐름]]
- [[SLR, 단순선형회귀 이해하기]]
- [[회귀분석의 가정]]
- [[MLE는 신이에요]]

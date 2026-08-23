---
title: 'MLE는 신이에요'
date: 2025-07-14
publish: true
---

<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-filename="스크린샷 2025-07-13 오전 12.00.55.png" data-origin-width="1988" data-origin-height="1110"><span data-url="https://blog.kakaocdn.net/dna/zKsbj/btsPfuSrSmR/AAAAAAAAAAAAAAAAAAAAAOWAed6wG7Re5HFKEJK8yjchfglINojPbFuJMyw2Gq4d/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=n5cOzvFxAB2lc%2Ffsb3ievXl7mJo%3D" data-phocus="https://blog.kakaocdn.net/dna/zKsbj/btsPfuSrSmR/AAAAAAAAAAAAAAAAAAAAAOWAed6wG7Re5HFKEJK8yjchfglINojPbFuJMyw2Gq4d/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=n5cOzvFxAB2lc%2Ffsb3ievXl7mJo%3D" data-alt="MLE는 항상 강했고, 앞으로도 그럴거다"><img src="../../../Attachments/Tistory/38-01.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="518" height="289" data-filename="스크린샷 2025-07-13 오전 12.00.55.png" data-origin-width="1988" data-origin-height="1110"/></span><figcaption>MLE는 항상 강했고, 앞으로도 그럴거다</figcaption>
</figure>
</p>
<h2 data-ke-size="size26"><span>0. Intro</span></h2>
<p data-ke-size="size16"><span>데이터를 분석한다는 건 <b>결국 모수(파라미터)를 추정하는 일이다.</b></span><br /><span>모집단의 평균, 분산, 성공확률 같은 값들은 직접 관찰할 수 없기 때문에,</span><br /><span>우리는 <b>표본을 통해 그 값들을 '추정'</b>해야만 한다.</span></p>
<p data-start="374" data-end="485" data-ke-size="size16"><span>이런 추정을 <b>숫자 하나로 표현하면 그걸 점추정(point estimation)이라고 불렀다</b></span></p>
<p data-start="374" data-end="485" data-ke-size="size16"><span><a href="https://nevermind22.tistory.com/32" target="_blank" rel="noopener&nbsp;noreferrer">https://nevermind22.tistory.com/32</a></span></p>
<p data-start="374" data-end="485" data-ke-size="size16">&nbsp;</p>
<p data-start="374" data-end="485" data-ke-size="size16"><span>그런데...</span><br /><span><b>그 점은 대체 어떻게, 어떤 기준으로 골라야 가장 "그럴듯"할까?</b></span></p>
<p data-start="490" data-end="573" data-ke-size="size16"><span>이 질문에 답하는 <b>고전적이면서도 <u>'강력한'</u> 방법</b>이 바로&nbsp;</span></p>
<p data-start="490" data-end="573" data-ke-size="size16"><span><b>최대우도추정법(MLE, Maximum Likelihood Estimation)이다.</b></span></p>
<h2 data-start="490" data-end="573" data-ke-size="size26"><span>1. MLE 의 아이디어&nbsp;</span></h2>
<p data-start="490" data-end="573" data-ke-size="size16"><span>최대우도추정법의 아이디어는 단순하다.</span><br /><span><b>&ldquo;현재 내가 관측한 데이터가, 특정 파라미터 하에서 발생했을 가능성이 가장 높은 값이 뭘까?&rdquo;</b></span><br /><span>바로 그 가능성(우도, Likelihood)을 최대화해주는 파라미터를 찾는 것이 MLE의 핵심이다.</span></p>
<p data-start="490" data-end="573" data-ke-size="size16">&nbsp;</p>
<p data-start="490" data-end="573" data-ke-size="size16"><span>아이디어는 단순해도, 그걸정확히 이해하고 활용하는건 또 다른 문제이다.&nbsp;</span></p>
<p data-start="490" data-end="573" data-ke-size="size16"><span>MLE 의 아이디어를 알기 위해서는 <b>Maximum Likelihood Estimation 단어 하나하나를 뜯어보며 그 구동방식을 살펴볼 필요가 있다</b></span></p>
<h2 data-start="490" data-end="573" data-ke-size="size26"><span>2. MLE 뜯어보기, 우도 함수에 대해</span></h2>
<blockquote data-ke-style="style3"><span>Maximum Likelihood Estimation</span><br /><span>이 말을 그대로 직역하면</span><br /><span>&ldquo;우도(Likelihood)를 최대화(Maximum)하는 추정(E-stimation)&rdquo;이라는 뜻이다.</span></blockquote>
<p data-start="490" data-end="573" data-ke-size="size16">&nbsp;</p>
<p data-start="490" data-end="573" data-ke-size="size16"><span><span>그런데 여기서 말하는&nbsp;</span><b><span>&lsquo;우도&rsquo;가 뭐길래</span><span>&nbsp;우리가 굳이 이걸 최대화하려는 걸까?&nbsp;</span></b></span></p>
<h3 data-start="490" data-end="573" data-ke-size="size23"><span><span>2.1 Likelihood VS</span><span> PD</span><span>F</span></span></h3>
<p data-ke-size="size16"><span><span>지금부터 이야기할 내용은 '아' 다르고 '어' 다른 내용이라 헷갈리기 아주 쉬운 내용이다. 조금 집중할 필요가 있다&nbsp;</span></span></p>
<h4 data-end="419" data-start="398" data-ke-size="size20"><span>PDF (확률밀도함수):</span></h4>
<p data-ke-size="size16"><span>우리가 흔히 아는 분포들을 말하는거다</span></p>
<blockquote data-end="445" data-start="420" data-ke-style="style3">
<p data-end="445" data-start="422" data-ke-size="size16"><span>&ldquo;&theta;가 주어졌을 때, x가 나올 확률은?&rdquo;<br /><b>&ldquo;모수(&theta;)를 알고 있을 때, 이 데이터(x)가 나올 확률은?&rdquo;</b><br /></span></p>
</blockquote>
<p data-end="575" data-start="447" data-ke-size="size16">&nbsp;</p>
<p data-end="575" data-start="447" data-ke-size="size16"><span>예를 들어,</span><br /><span>어떤 동전의 앞면 확률이 &theta; = 0.5라고 <b>이미 주어졌을 때</b>,</span><br /><span>앞면이 7번 나올 <b>확률</b>을 계산하는 것이 PDF다.</span><br /><span>즉, 모수 &theta;는 고정되어 있고,</span><br /><span>우리는 <b>x가 어떻게 바뀌는지</b>를 본다.</span></p>
<h3 data-end="606" data-start="582" data-ke-size="size23"><span>&nbsp;Likelihood (우도):</span></h3>
<blockquote data-end="606" data-start="582" data-ke-style="style3"><span><b>&ldquo;x는 이미 나왔고, 이걸 설명해주는 가장 그럴듯한 &theta;는 뭐지?&rdquo;</b></span></blockquote>
<p data-end="748" data-start="647" data-ke-size="size16">&nbsp;</p>
<p data-end="748" data-start="647" data-ke-size="size16"><span>이제는 <u><b>시각이 반대다.(이게 중요하다)&nbsp;</b></u></span><br /><span><b>데이터 x는 이미 관측되었고</b>,</span><br /><span>우리는 &ldquo;이 데이터를 잘 설명해주는 &theta;는 무엇인가?&rdquo;를 찾는다.</span><br /><span>같은 식이지만, <b>&theta;가 변수</b>가 된다.</span></p>
<blockquote data-end="748" data-start="647" data-ke-style="style3"><span><b>PDF는 파라미터고정 -&gt; 데이터가 나올 확률 , </b></span><br /><span><b>Likelihood는 데이터고정 -&gt; 파라미터가 맞을 확률&nbsp;</b></span></blockquote>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>바로 이해하는건 쉽지 않다, 반복해서 읽어보자..&nbsp;</span></p>
<p data-ke-size="size16"><span>개념을 이해했다면 거의 다 온거다.&nbsp;</span></p>
<p data-ke-size="size16"><span>사실 생겨먹은건 PDF 나 liklihood 나 똑같이 생겼다 왜 그럴까? 다음의 예시를 봐 보자&nbsp;</span></p>
<h3 data-end="275" data-start="242" data-ke-size="size23"><span>2.2 정규분포 예시로 보는 Likelihood 함수</span></h3>
<p data-end="372" data-start="277" data-ke-size="size16"><span>우리는 관측 데이터를 통해 모수(파라미터)를 추정하고 싶다.</span><br /><span>정규분포라면 대표적인 모수가 평균 &mu; (mu)와 분산 &sigma;&sup2; (sigma squared)이다.</span></p>
<p data-end="520" data-start="374" data-ke-size="size16"><span>우리가 모르는 건 &mu;, &sigma;&sup2;이고, 알고 있는 건 데이터 x₁, x₂, ..., xₙ이다.</span><br /><span>(MLE에서는 보통 &sigma;&sup2;는 이미 알고 있다고 가정하고 &mu;만 추정하거나, 둘 다 모를 경우엔 둘 다 추정할 수도 있다. 여기서는 단순화를 위해 &sigma;&sup2;는 알고 있다고 하자.)</span></p>
<h4 data-end="537" data-start="527" data-ke-size="size20"><span>상황 설정</span></h4>
<ul data-end="718" data-start="539" data-ke-list-type="disc">
<li data-end="597" data-start="539"><span>관측한 데이터:</span><br /><span>x={7.2, 6.8, 7.6, 7.0, 7.4}</span></li>
<li data-end="672" data-start="598"><span>우리는 이 데이터들이 어떤 <b>정규분포</b>에서 나왔다고 가정한다.</span></li>
<li data-end="718" data-start="673"><span>단, 분산 &sigma;&sup2;는 알고 있고, 평균 &mu;만 모른다고 하자 (예: &sigma;&sup2; = 1).</span></li>
</ul>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1140" data-origin-height="1000"><span data-url="https://blog.kakaocdn.net/dna/N228Q/btsPgT5f7Ju/AAAAAAAAAAAAAAAAAAAAAM3pR7DDQdj7N-XbHsqhq-xUIHCY5hLMYDZ_LhnCcWgc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=u6CAPbZf4KeDYgAM%2BYcFwSZIy7o%3D" data-phocus="https://blog.kakaocdn.net/dna/N228Q/btsPgT5f7Ju/AAAAAAAAAAAAAAAAAAAAAM3pR7DDQdj7N-XbHsqhq-xUIHCY5hLMYDZ_LhnCcWgc/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=u6CAPbZf4KeDYgAM%2BYcFwSZIy7o%3D"><img src="../../../Attachments/Tistory/38-02.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="532" height="467" data-origin-width="1140" data-origin-height="1000"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>이렇게 나온 likelihood 공식은 다음과 같다&nbsp;</span></p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1271" data-origin-height="1000"><span data-url="https://blog.kakaocdn.net/dna/QrlS1/btsPgUXsNUj/AAAAAAAAAAAAAAAAAAAAABXit_-s97AByzGF4AVxOzMueizRlin6AxnCas7YfTwR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=Ktln3NVNJEwb1chgFUnb9ymNns8%3D" data-phocus="https://blog.kakaocdn.net/dna/QrlS1/btsPgUXsNUj/AAAAAAAAAAAAAAAAAAAAABXit_-s97AByzGF4AVxOzMueizRlin6AxnCas7YfTwR/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=Ktln3NVNJEwb1chgFUnb9ymNns8%3D"><img src="../../../Attachments/Tistory/38-03.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="526" height="1000" data-origin-width="1271" data-origin-height="1000"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>식이 좀 복잡할수 있는데 겁낼거 없다. 막상 바뀐건 x 고정시키고 앞에 파이 하나 붙은거다.&nbsp;</span><br /><span><b>다만 왜 그렇게 되었는지 그 의미만 확실히 파악하면 된다&nbsp;</b></span></p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>자 우린 이제 likelihood function 에 대해 알았다..!</span></p>
<p data-ke-size="size16"><span>하지만 MLE를 이해한건 아니다... 아직 가야할 길이 더 있다..&nbsp;</span></p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="820" data-origin-height="456"><span data-url="https://blog.kakaocdn.net/dna/YAM7F/btsPghMpYAX/AAAAAAAAAAAAAAAAAAAAAKftopNe-foTddjaw6aZWC64Sk-l1qqtaCAzQEHP_Et6/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=DEhLcoZvTuRGEqdknhXQ4Ul0F98%3D" data-phocus="https://blog.kakaocdn.net/dna/YAM7F/btsPghMpYAX/AAAAAAAAAAAAAAAAAAAAAKftopNe-foTddjaw6aZWC64Sk-l1qqtaCAzQEHP_Et6/img.jpg?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=DEhLcoZvTuRGEqdknhXQ4Ul0F98%3D" data-alt="log를 넣는 달인..!"><img src="../../../Attachments/Tistory/38-04.jpg" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="590" height="328" data-origin-width="820" data-origin-height="456"/></span><figcaption>log를 넣는 달인..!</figcaption>
</figure>
</p>
<h3 data-ke-size="size23" data-start="242" data-end="275"><span>2.3 Log_Likelihood_function&nbsp;</span></h3>
<p data-ke-size="size16"><span>사실 아주 상식적인 내용이다. </span></p>
<p data-ke-size="size16"><span>말은 안했지만 위에 저 괴랄한 Likelihood를 <b>n번 '곱한다'</b>고 생각하면 생각만 해도 어지럽다</span></p>
<p data-ke-size="size16"><span>실제로 컴퓨터도 쉽지 않은 문제이다. </span></p>
<p data-ke-size="size16"><span><span>예를 들어, </span>정규분포나 베르누이 분포처럼 <b>0과 1 사이의 확률 밀도값을 곱한다고 생각해보자</b>&nbsp;&nbsp;</span></p>
<p data-ke-size="size16"><span>각 항이 0.01만 되어도 100개 곱하면 (0.01)^100&asymp;10^&minus;200(0.01)^{100}... </span></p>
<p data-ke-size="size16"><span>-&gt; 값이 말도 안되게 작아져서 under flow 문제가 발생한다.</span></p>
<h4 data-end="694" data-start="676" data-ke-size="size20"><span>해결책: log를 취하자! , 곱을 로그로 바꾸면, <b>덧셈</b>으로 바뀐다:</span></h4>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1170" data-origin-height="1000"><span data-url="https://blog.kakaocdn.net/dna/cj9uZv/btsPhOWJJoy/AAAAAAAAAAAAAAAAAAAAANUxZw3lPOeAcFsSEQTin-lErMwE2js_R2AplKGZbIuK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=u8unpznDzVDAtHjQoA1E6u%2FfzYM%3D" data-phocus="https://blog.kakaocdn.net/dna/cj9uZv/btsPhOWJJoy/AAAAAAAAAAAAAAAAAAAAANUxZw3lPOeAcFsSEQTin-lErMwE2js_R2AplKGZbIuK/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=u8unpznDzVDAtHjQoA1E6u%2FfzYM%3D" data-alt="우도함수의 정상화.."><img src="../../../Attachments/Tistory/38-05.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="426" height="1000" data-origin-width="1170" data-origin-height="1000"/></span><figcaption>우도함수의 정상화..</figcaption>
</figure>
</p>
<p data-start="490" data-end="573" data-ke-size="size16">&nbsp;</p>
<p data-start="490" data-end="573" data-ke-size="size16"><span>놀랍게도 log를 써서 얻는 이점은 게산이 쉬워지는거 말고도 다양하다. -&gt; 이 내용은 MLE 가 왜 강력한지에 대한 내용과 연관되어 있기에 기억해두자</span></p>
<h4 data-end="275" data-start="242" data-ke-size="size20"><span>2.3.1. <b>수학적으로 간단해진다</b></span></h4>
<blockquote data-ke-style="style3"><span>곱셈 &rarr; 덧셈 &rarr; 계산이 쉬워지고,</span><br /><span>지수함수가 사라지므로 미분이 쉬워진다</span></blockquote>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-end="1097" data-start="1050" data-ke-size="size20"><span>2.3.2. <b>최적화가 쉬워진다</b> (Optimization Simplicity)</span></h4>
<blockquote data-ke-style="style3"><span>로그 함수는 단조 증가 함수</span><br /><span>&rarr; log를 씌우든 안 씌우든 최댓값 위치는 같다!</span></blockquote>
<blockquote data-ke-style="style3"><span>게다가 log-likelihood는 많은 경우 concave(오목한) 함수가 되기 때문에,</span><br /><span>최댓값이 유일하게 존재하고, -&gt; 항상 전역 최댓값으로 수렴 (local 걱정을 할 필요 없음)&nbsp;</span><br /><span>경사하강법 같은 최적화 알고리즘에서도 더 빠르게 수렴</span></blockquote>
<p data-start="490" data-end="573" data-ke-size="size16">&nbsp;</p>
<p data-start="490" data-end="573" data-ke-size="size16"><span>다시 돌아오면, 이제 우린<span>. pdf가 주어졌을때</span> log_likelihood_function을 구할수 있다.&nbsp;</span></p>
<p data-start="490" data-end="573" data-ke-size="size16"><span><b>이제 진짜 MLE 구해보자 </b></span></p>
<h2 data-ke-size="size26"><span>4. MLE 직접 유도해 보기&nbsp;</span></h2>
<p data-ke-size="size16"><span>앞서 활용한 정규분포의 <span>log_likelihood_function 을 활용해서 MLE 를 구해보자</span></span></p>
<p data-ke-size="size16">&nbsp;</p>
<table border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td><span><b>① Likelihood 함수 설정</b></span></td>
<td><span>데이터의 분포 가정을 바탕으로 likelihood 식을 세운다.</span></td>
</tr>
<tr>
<td><span><b>② Log-likelihood로 변환</b></span></td>
<td><span>계산 편의성과 최적화를 위해 log를 취한다.</span></td>
</tr>
<tr>
<td><span><b>③ 파라미터별로 미분</b></span></td>
<td><span>평균(&mu;), 분산(&sigma;&sup2;)에 대해 각각 편미분 한다.</span></td>
</tr>
<tr>
<td><span><b>④ 극댓값 찾기</b></span></td>
<td><span>미분한 값을 0으로 놓고 극댓값을 주는 해를 찾는다.</span></td>
</tr>
<tr>
<td><span><b>⑤ 추정치 정리</b></span></td>
<td><span>얻어진 &mu;, &sigma;&sup2;에 대한 MLE 추정치를 정리한다.</span></td>
</tr>
</tbody>
</table>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>이러한 프로세스로 진행이 되며 일단 우린 2번까지 해놨다 3번부터 해보자&nbsp;</span></p>
<h4 data-ke-size="size20"><span>3. 파라미터별로 미분,</span></h4>
<p data-ke-size="size16"><span>(MLE에서는 보통 &sigma;&sup2;는 이미 알고 있다고 가정하고 &mu;만 추정하거나, 둘 다 모를 경우엔 둘 다 추정할 수도 있다. 여기서는 계산 단순화를 위해 &sigma;&sup2;는 알고 있다고 하자.)&nbsp;</span></p>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1131" data-origin-height="999"><span data-url="https://blog.kakaocdn.net/dna/db2aGl/btsPgE1ZmJx/AAAAAAAAAAAAAAAAAAAAANSdyJz4FcH7csD437v9PUGV_Z5_n3fJhY5HHfiB8GDt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=jOsdbxsdiE9GrysqWwAMXtW5oS8%3D" data-phocus="https://blog.kakaocdn.net/dna/db2aGl/btsPgE1ZmJx/AAAAAAAAAAAAAAAAAAAAANSdyJz4FcH7csD437v9PUGV_Z5_n3fJhY5HHfiB8GDt/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=jOsdbxsdiE9GrysqWwAMXtW5oS8%3D" data-alt="이 또한 log의 은총이겠지요..."><img src="../../../Attachments/Tistory/38-06.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="443" height="391" data-origin-width="1131" data-origin-height="999"/></span><figcaption>이 또한 log의 은총이겠지요...</figcaption>
</figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1000" data-origin-height="1160"><span data-url="https://blog.kakaocdn.net/dna/bhZ6fl/btsPhmmfX0d/AAAAAAAAAAAAAAAAAAAAAPxtiQ-3Mtw9zz8sU1GZsBrQ9fDxaoAhJ4Ix46MZgUcd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=CXFbNg%2BZlR%2Fm3trcsljtKBVr5rs%3D" data-phocus="https://blog.kakaocdn.net/dna/bhZ6fl/btsPhmmfX0d/AAAAAAAAAAAAAAAAAAAAAPxtiQ-3Mtw9zz8sU1GZsBrQ9fDxaoAhJ4Ix46MZgUcd/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=CXFbNg%2BZlR%2Fm3trcsljtKBVr5rs%3D"><img src="../../../Attachments/Tistory/38-07.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="629" height="730" data-origin-width="1000" data-origin-height="1160"/></span></figure>
</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>이제 0이 되는 지점을 찾으면 그것이 MLE 이다&nbsp;</span></p>
<h4 data-ke-size="size20"><span>&nbsp;4<b>&nbsp;극댓값 찾기 , 5. <b>&nbsp;추정치 정리</b></b></span></h4>
<p data-ke-size="size16"><span>사실 이제부턴 전개만 제대로 해도 답을 구할수 있다 </span></p>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="2523" data-origin-height="1000"><span data-url="https://blog.kakaocdn.net/dna/bi2sdT/btsPitZe8LT/AAAAAAAAAAAAAAAAAAAAACEXBCrajPSiLsMcHHH8L_TH32Y8X2FZ9dKlJm8bUnz7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=aATedQ8478f%2Bwo7UfMB%2BmWg2Nms%3D" data-phocus="https://blog.kakaocdn.net/dna/bi2sdT/btsPitZe8LT/AAAAAAAAAAAAAAAAAAAAACEXBCrajPSiLsMcHHH8L_TH32Y8X2FZ9dKlJm8bUnz7/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=aATedQ8478f%2Bwo7UfMB%2BmWg2Nms%3D" data-alt="드디어 끝..."><img src="../../../Attachments/Tistory/38-08.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="663" height="263" data-origin-width="2523" data-origin-height="1000"/></span><figcaption>드디어 끝...</figcaption>
</figure>
</p>
<p data-ke-size="size16"><span>따라서&nbsp;</span></p>
<p data-ke-size="size16"><span>뮤의 MLE 는 평균이 된다 -&gt; 같은 방식으로 시그마 제곱도 구할수 있다 (시그마 제곱에 대해 편미분, set 0)&nbsp;</span></p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span><b>수학적으로 합리적</b>일 뿐만 아니라, 우리의 <b>직관과도 정확히 일치한다.</b></span></p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>&rarr; 관측값들을 가장 잘 설명하는 평균은? &rarr; 당연히 "그 값들의 평균"</span></p>
<h2 data-ke-size="size26"><span>5. MLE가 강력한 이유&nbsp;</span></h2>
<blockquote data-ke-style="style3"><span>데이터를 만든 확률모형을 정확히 알고 있다면,</span><br /><span>그 상황에서 MLE는 이론상 최강의 모수 추정법</span></blockquote>
<p data-ke-size="size16">&nbsp;</p>
<h4 data-ke-size="size20"><span>5.1. 모델이 맞다면 (well-specified model)</span></h4>
<p data-end="297" data-start="279" data-ke-size="size16"><span>MLE는 다음 세 가지를 만족하게 된다</span></p>
<table border="1" data-ke-align="alignLeft">
<tbody>
<tr>
<td><span><b>일치성</b> (Consistency)</span></td>
<td><span>데이터가 많아질수록 진짜 모수에 수렴</span></td>
</tr>
<tr>
<td><span><b>점근적 정규성</b></span></td>
<td><span>n &rarr; &infin;일 때 정규분포로 수렴 &rarr; 신뢰구간 가능</span></td>
</tr>
<tr>
<td><span><b>점근적 효율성</b></span></td>
<td><span><b>Cram&eacute;r&ndash;Rao 하한선</b>을 달성 &rarr; 그 어떤 추정량보다 더 작은 분산을 갖지 못함</span></td>
</tr>
</tbody>
</table>
<div>
<div>&nbsp;</div>
</div>
<p data-end="537" data-start="494" data-ke-size="size16"><span>&rarr; <b>데이터가 많아질수록 MLE는 정확하고, 안정적이며, 수학적으로 최적</b></span></p>
<p data-end="537" data-start="494" data-ke-size="size16">&nbsp;</p>
<p data-end="537" data-start="494" data-ke-size="size16"><span><b>Cram&eacute;r&ndash;Rao 하한선에 대해 (fisher finformation과 같은 선행지식이 기반이 되어야 하기에 따로 추가공부를 해보자)&nbsp;</b></span></p>
<p data-end="537" data-start="494" data-ke-size="size16"><span><b><a href="https://pgstarter.tistory.com/6" target="_blank" rel="noopener&nbsp;noreferrer">https://pgstarter.tistory.com/6</a></b></span></p>
<figure id="og_1752473516122" contenteditable="false" data-ke-type="opengraph" data-ke-align="alignCenter" data-og-type="article" data-og-title="Fisher Information, Cramer-Rao bound" data-og-description="어떤 실험이 있어서 그 실험이 미지의 확률분포를 따라 결과를 반환한다고 해보자. 예를 들어, 그 실험결과 $X$가 $X\sim N(\mu,\sigma)$ 인데 $\mu,\sigma$를 모르는 상황을 생각해볼 수 있다. 유한한 수, $" data-og-host="pgstarter.tistory.com" data-og-source-url="https://pgstarter.tistory.com/6" data-og-url="https://pgstarter.tistory.com/6" data-og-image="https://blog.kakaocdn.net/dna/p71us/hyZm7YqW7f/AAAAAAAAAAAAAAAAAAAAACnG0LJrbqno1-bWmPKd-aKVBHOJGJ6FNc9Hh32_r-mw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=mev6OM%2FhKq%2FOd2ZwAZM0kXI1z00%3D"><a href="https://pgstarter.tistory.com/6" target="_blank" rel="noopener" data-source-url="https://pgstarter.tistory.com/6">
<div class="og-image" style="background-image: url('https://blog.kakaocdn.net/dna/p71us/hyZm7YqW7f/AAAAAAAAAAAAAAAAAAAAACnG0LJrbqno1-bWmPKd-aKVBHOJGJ6FNc9Hh32_r-mw/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=mev6OM%2FhKq%2FOd2ZwAZM0kXI1z00%3D');">&nbsp;</div>
<div class="og-text">
<p class="og-title" data-ke-size="size16">Fisher Information, Cramer-Rao bound</p>
<p class="og-desc" data-ke-size="size16">어떤 실험이 있어서 그 실험이 미지의 확률분포를 따라 결과를 반환한다고 해보자. 예를 들어, 그 실험결과 $X$가 $X\sim N(\mu,\sigma)$ 인데 $\mu,\sigma$를 모르는 상황을 생각해볼 수 있다. 유한한 수, $</p>
<p class="og-host" data-ke-size="size16">pgstarter.tistory.com</p>
</div>
</a></figure>
<p data-end="537" data-start="494" data-ke-size="size16">&nbsp;</p>
<h4 data-end="537" data-start="494" data-ke-size="size20"><span>5.2 대수의 법칙(Law of Large Numbers)과 중심극한정리(Central Limit Theorem, CLT) </span></h4>
<blockquote data-end="537" data-start="494" data-ke-style="style3"><span><span aria-hidden="true">MLE​</span>는 n이 충분히 커질수록, 정규분포를 따른다</span></blockquote>
<p data-end="537" data-start="494" data-ke-size="size16">&nbsp;</p>
<p data-end="537" data-start="494" data-ke-size="size16"><span><b>분포를 따르기에 </b><b>신뢰구간(confidence interval)</b> 생성과 더불어 여러가지 Test 를 할수 있다&nbsp;</span></p>
<p data-end="537" data-start="494" data-ke-size="size16">&nbsp;</p>
<h2 data-end="537" data-start="494" data-ke-size="size26"><span>6. 마무리</span></h2>
<p data-ke-size="size16"><span>우리는 지금까지 하나의 질문에서 출발했다:</span></p>
<blockquote data-end="282" data-start="239" data-ke-style="style3">
<p data-end="282" data-start="241" data-ke-size="size16"><span>"데이터가 나왔을 때, 이걸 가장 그럴듯하게 설명해주는 파라미터는 뭘까?"</span></p>
</blockquote>
<p data-end="325" data-start="284" data-ke-size="size16">&nbsp;</p>
<p data-end="325" data-start="284" data-ke-size="size16"><span>바로 이 질문에 대답하는 방법이</span><br /><span><b>최대우도추정법(MLE)</b> 이었다.</span></p>
<ol data-end="509" data-start="358" data-ke-list-type="decimal">
<li data-end="395" data-start="358"><span>점추정(point estimation)이란 무엇이고</span></li>
<li data-end="429" data-start="396"><span><b>Likelihood vs PDF</b> 차이는 뭔지</span></li>
<li data-end="462" data-start="430"><span>왜 likelihood를 <b>log로 바꾸는지</b></span></li>
<li data-end="509" data-start="463"><span>그리고 정규분포 예제를 통해</span><br /><span>직접 MLE를 <b>수식으로 유도</b>해봤다</span></li>
</ol>
<p data-end="534" data-start="516" data-ke-size="size16"><span>그 과정에서 우리는 다음 사실을 알게 되었다:</span></p>
<blockquote data-ke-style="style3"><span>MLE는 단순히 &ldquo;제일 높은 확률&rdquo;을 찍는 게 아니라</span><br /><span>수학적으로도 강하고, 이론적으로도 최적에 가까운 추정량이다</span></blockquote>
<blockquote data-ke-style="style3"><span>데이터가 많아지면 진짜 모수로 수렴하고 (일치성)</span><br /><span>추정치의 분포가 정규분포로 수렴하고 (점근적 정규성)</span><br /><span>어떤 추정량보다 분산이 작다 (Cram&eacute;r&ndash;Rao 하한 달성)</span></blockquote>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16"><span>MLE 는 무궁무진하게 활용할수 있다. </span></p>
<p data-ke-size="size16"><span>지금까지 배운 회귀분석도 OLS 로 파라미터를 구하는게 아닌 MLE 로 구할수도 있다 (물론 OLS = MLE 값이 같다)&nbsp;</span></p>
<p data-ke-size="size16"><span>앞으로 계속 사용될 이론이니 확실히 이해해야 한다</span></p>

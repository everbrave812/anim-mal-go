---
title: '가설검정 : p-value로 통계적 의미를 해석하는 법'
date: 2025-07-03
publish: true
---

<h2 data-ke-size="size26">Chapter 09. 가설검정 (Hypothesis Testing)</h2>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1280" data-origin-height="720"><span data-url="https://blog.kakaocdn.net/dna/bWmIKP/btsO2v4dG8z/AAAAAAAAAAAAAAAAAAAAAEBK5TPfVWRNcfg05GwMslFODJGCxGxiRSqLsQL1-vio/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=3ZMoC82r%2FFHnn2T0EQQkhcTSUIA%3D" data-phocus="https://blog.kakaocdn.net/dna/bWmIKP/btsO2v4dG8z/AAAAAAAAAAAAAAAAAAAAAEBK5TPfVWRNcfg05GwMslFODJGCxGxiRSqLsQL1-vio/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=3ZMoC82r%2FFHnn2T0EQQkhcTSUIA%3D" data-alt="우리의 만남의 p-value는 0.05보다 적어"><img src="../../../Attachments/Tistory/33-01.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="586" height="330" data-origin-width="1280" data-origin-height="720"/></span><figcaption>우리의 만남의 p-value는 0.05보다 적어</figcaption>
</figure>
</p>
<p data-ke-size="size16">: 연구자가 내린 주장(가설)이 통계적으로 의미가 있는지를 판단하는 방법</p>
<p data-ke-size="size16">&nbsp;</p>
<p data-ke-size="size16">우리는 데이터를 분석하면서 늘 질문을 던진다.<br /><b>&ldquo;이게 정말 우연이 아닐까?&rdquo;</b><br />&ldquo;눈에 보이는 이 차이가 &lsquo;진짜&rsquo;일까, 아니면 그냥 운이었을까?&rdquo;</p>
<p data-end="356" data-start="284" data-ke-size="size16">가설검정은 바로 이 질문에 답하는 절차다.<br />실험에서 어떤 결과가 나왔을 때, 그걸 <b>&lsquo;믿어도 되는지&rsquo; 결정해주는 논리적 장치다.</b></p>
<p data-end="479" data-start="358" data-ke-size="size16">예를 들어, 어떤 약을 먹고 나서 평균 체중이 줄었다고 하자.<br />이 결과가 단순한 우연인지, 아니면 정말 약의 효과인지를 판단하는 것 &mdash;<br />그게 바로 가설검정(Hypothesis Testing)의 역할이다.</p>
<p data-end="579" data-start="481" data-ke-size="size16">이 장에서는 가설을 세우고, 그 가설을 검정하며,<br />그 결과를 가지고 통계적으로 "기각할 것인가, 유지할 것인가"를 판단하는<br />그 기본적인 아이디어를 다뤄보고자 한다&nbsp;</p>
<p data-ke-size="size16">&nbsp;</p>
<h2 data-end="217" data-start="197" data-ke-size="size26">9.1 가설검정의 기본 아이디어</h2>
<p data-end="289" data-start="219" data-ke-size="size16">우리는 통계적 추론을 통해 "어떤 주장이 사실인지 아닌지"를 검정하려 한다.<br />이때의 전제는 다음 두 가지 가설로 시작된다:</p>
<ul style="list-style-type: disc;" data-end="373" data-start="291" data-ke-list-type="disc">
<li data-end="332" data-start="291"><b>귀무가설 (H₀)</b>: 변화나 차이가 없다. 기존 상태를 유지.</li>
<li data-end="373" data-start="333"><b>대립가설 (H₁)</b>: 변화나 차이가 있다. 새로운 주장이 맞다.</li>
</ul>
<p data-end="433" data-start="375" data-ke-size="size16">예를 들어, "이 약이 효과가 없다"는 것이 H₀라면,<br />"이 약은 효과가 있다"는 것이 H₁이 된다.</p>
<h3 style="color: #000000; text-align: start;" data-ke-size="size23" data-start="197" data-end="217">9.1<span> .</span>1 오류(Error)의 개념</h3>
<p data-end="489" data-start="464" data-ke-size="size16">가설검정에는 두 가지 오류가 발생할 수 있다:</p>
<ul style="list-style-type: disc;" data-end="662" data-start="491" data-ke-list-type="disc">
<li data-end="577" data-start="491"><b>1종 오류 (Type I Error, &alpha;)</b>:<br />H₀가 사실인데, H₀를 기각해버리는 오류<br />&rarr; 잘못된 것을 옳다고 한 것처럼 착각</li>
<li data-end="662" data-start="578"><b>2종 오류 (Type II Error, &beta;)</b>:<br />H₁이 사실인데, H₀를 기각하지 못한 오류<br />&rarr; 진짜 변화를 못 알아본 상황</li>
</ul>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1296" data-origin-height="1000"><span data-url="https://blog.kakaocdn.net/dna/bSHacn/btsO2TKhzMo/AAAAAAAAAAAAAAAAAAAAAM2vZSRkfOZ2IjOY018n6Uvz7VRSY32_qd6aG9RZ2uOz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=ODFdRxxkKYYvBZvmqycVOpKNkZY%3D" data-phocus="https://blog.kakaocdn.net/dna/bSHacn/btsO2TKhzMo/AAAAAAAAAAAAAAAAAAAAAM2vZSRkfOZ2IjOY018n6Uvz7VRSY32_qd6aG9RZ2uOz/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=ODFdRxxkKYYvBZvmqycVOpKNkZY%3D"><img src="../../../Attachments/Tistory/33-02.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="488" height="1000" data-origin-width="1296" data-origin-height="1000"/></span></figure>
<figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="1573" data-origin-height="1000"><span data-url="https://blog.kakaocdn.net/dna/sA9JS/btsO0K86Ufq/AAAAAAAAAAAAAAAAAAAAAKAvMi-36z-lBbCCjT9OwmA1JpC5EFxxTCki-cuKuLvp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=kD8rwBmYUhmxgYRsatPr66RhL7g%3D" data-phocus="https://blog.kakaocdn.net/dna/sA9JS/btsO0K86Ufq/AAAAAAAAAAAAAAAAAAAAAKAvMi-36z-lBbCCjT9OwmA1JpC5EFxxTCki-cuKuLvp/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=kD8rwBmYUhmxgYRsatPr66RhL7g%3D"><img src="../../../Attachments/Tistory/33-03.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="491" height="1000" data-origin-width="1573" data-origin-height="1000"/></span></figure>
</p>
<p data-ke-size="size16">이제 그림을 보면, 어떤 <b>임계값(critical value)</b> 기준이 등장한다.<br />이 임계값을 기준으로 결과가 기각될지, 유지될지가 결정되는데,<br />문제는 이 기준이 <b>유의수준(&alpha;)</b> 에 따라 계속 바뀐다는 점이다.</p>
<p data-end="253" data-start="173" data-ke-size="size16">유의수준이 0.05일 땐 이만큼, 0.01일 땐 또 다르게&hellip;<br />매번 <b>새 기준선에 맞춰 계산하고 판단</b>해야 한다면 꽤 번거로운 일이 된다.</p>
<p data-end="301" data-start="255" data-ke-size="size16">바로 이 불편함을 해결하기 위해 등장한 것이 <b>p-value(유의확률)</b> 이다.</p>
<h3 style="color: #000000; text-align: start;" data-end="217" data-start="197" data-ke-size="size23">9.1<span><span>&nbsp;</span>.</span>1 P 값의 등장&nbsp;</h3>
<p data-ke-size="size16">p-value의 p는 <b>probability</b>, 즉 &lsquo;확률&rsquo;을 의미한다.<br />많은 사람들이 p-value를 자주 사용하면서도, 정작 "이 확률이 정확히 무엇을 의미하느냐"는 질문에 선뜻 대답하지 못하는 경우가 많다.</p>
<p data-end="224" data-start="205" data-ke-size="size16">이제 중요한 질문을 던져보자.</p>
<blockquote data-end="266" data-start="226" data-ke-style="style2">
<p data-end="266" data-start="228" data-ke-size="size16">&ldquo;이 사건이 단순한 우연으로 발생했을 가능성은 얼마나 될까?&rdquo;</p>
</blockquote>
<p data-end="338" data-start="268" data-ke-size="size16">바로 이 질문에서 말하는 <b>&lsquo;우연히 발생했을 가능성&rsquo;</b>,<br />그것이 통계에서 말하는 p-value(유의확률)이다.</p>
<h3 data-end="368" data-start="345" data-ke-size="size23">통계적 사고는 일상적 사고와 다르다</h3>
<p data-ke-size="size16">유의확률을 정확하게 이해하기 위해선 우린 통계적 사고에 대해 생각해볼 필요가 있다&nbsp;</p>
<p data-end="425" data-start="370" data-ke-size="size16">우리는 일상에서 어떤 일이 발생하면 보통<br />&ldquo;무슨 이유가 있었겠지?&rdquo; 하고 원인을 찾으려 합니다.</p>
<p data-end="461" data-start="427" data-ke-size="size16">하지만 통계적 접근은 다르다<br />오히려 이렇게 질문합니다:</p>
<blockquote data-end="531" data-start="463" data-ke-style="style2">
<p data-end="531" data-start="465" data-ke-size="size16">&ldquo;혹시 이건 단순히 우연히 발생한 현상은 아닐까?&rdquo;<br />&ldquo;그리고, 그런 우연이 발생할 확률은 얼마나 드문 일인가?&rdquo;</p>
</blockquote>
<p data-end="619" data-start="533" data-ke-size="size16">이렇게 출발하는 것이 바로 통계적 사고이며,<br />우리는 이 &lsquo;우연의 가능성&rsquo;을 수치(p-value)로 계산해서 판단하게 된다.</p>
<h3 data-end="644" data-start="626" data-ke-size="size23">요약하면 다음과 같다:</h3>
<ul style="list-style-type: disc;" data-end="922" data-start="646" data-ke-list-type="disc">
<li data-end="667" data-start="646"><b>p-value는 확률이다.</b></li>
<li data-end="759" data-start="668">더 정확히 말하면, <b>귀무가설(H₀)이 참이라는 전제</b> 하에,<br />우리가 실제로 관측한 통계량보다 <b>동일하거나 더 극단적인 결과가 나올 확률</b>입니다.</li>
<li data-end="848" data-start="760">이 확률이 <b>매우 작다면</b>, 우리는 이렇게 판단합니다: &ldquo;이 정도로 극단적인 결과가 우연히 나올 가능성은 매우 낮다. &rarr; 귀무가설을 기각하자.&rdquo;</li>
<li data-end="922" data-start="849">반대로, p-value가 <b>충분히 크다면</b>: &ldquo;이 정도 결과는 우연히 자주 나올 수 있다. &rarr; 귀무가설을 유지하자.&rdquo;</li>
</ul>
<p data-ke-size="size16">진짜 마지막 정리이다.</p>
<p data-ke-size="size16">Data가 알려주는 1종오류의 최대 상한값 = P value&nbsp;</p>
<p data-ke-size="size16"><b>귀무가설(H₀)이 True 일때 <b>귀무가설(H₀)을 기각할수 있는 최대 가능성을 말한다&nbsp;</b></b></p>
<p><figure class="imageblock alignLeft" data-ke-mobileStyle="widthOrigin" data-origin-width="999" data-origin-height="1098"><span data-url="https://blog.kakaocdn.net/dna/EqGIh/btsO2lUNZZD/AAAAAAAAAAAAAAAAAAAAAJNJI_pKr8WohMnXtmIkgwYmroohaMDpkh7D_CbvPE-1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=VWdNWFWWOZ0Kvizkxod7zbgyYzY%3D" data-phocus="https://blog.kakaocdn.net/dna/EqGIh/btsO2lUNZZD/AAAAAAAAAAAAAAAAAAAAAJNJI_pKr8WohMnXtmIkgwYmroohaMDpkh7D_CbvPE-1/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1788188399&allow_ip=&allow_referer=&signature=VWdNWFWWOZ0Kvizkxod7zbgyYzY%3D"><img src="../../../Attachments/Tistory/33-04.png" onerror="this.onerror=null; this.src='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png'; this.srcset='//t1.daumcdn.net/tistory_admin/static/images/no-image-v1.png';" loading="lazy" width="494" height="543" data-origin-width="999" data-origin-height="1098"/></span></figure>
</p>
<h2 data-end="87" data-start="71" data-ke-size="size26">9.2 가설검정의 절차</h2>
<p data-ke-size="size16">가설검정에 관련된 본격적인 글은 다음글에 바로 작성할 예정이지만&nbsp;</p>
<p data-end="184" data-start="89" data-ke-size="size16">그과정을 미리 설명하는것 자체에 대해 의의가 있다 생각해 따로 정리를 해 보았다&nbsp;</p>
<h4 data-end="235" data-start="191" data-ke-size="size20">1. <b>가설 설정 (Hypotheses Formulation)</b></h4>
<p data-end="264" data-start="236" data-ke-size="size16">먼저 검정할 두 가지 가설을 명확히 설정한다.</p>
<ul style="list-style-type: disc;" data-end="353" data-start="265" data-ke-list-type="disc">
<li data-end="309" data-start="265"><b>귀무가설 (H₀)</b>: 변화나 차이가 없다는 주장 (기존 상태 유지)</li>
<li data-end="353" data-start="310"><b>대립가설 (H₁)</b>: 변화나 차이가 있다는 주장 (새로운 효과 존재)</li>
</ul>
<p data-end="359" data-start="355" data-ke-size="size16">예:</p>
<ul style="list-style-type: disc;" data-end="417" data-start="360" data-ke-list-type="disc">
<li data-end="389" data-start="360">H₀: &ldquo;이 약은 체중 감량에 효과가 없다.&rdquo;</li>
<li data-end="417" data-start="390">H₁: &ldquo;이 약은 체중 감량에 효과가 있다.&rdquo;</li>
</ul>
<h4 data-end="463" data-start="424" data-ke-size="size20">2. <b>검정 유형 결정 (Test Direction)</b></h4>
<p data-end="495" data-start="464" data-ke-size="size16">비교하고자 하는 방향에 따라 검정 유형을 선택한다.</p>
<ul style="list-style-type: disc;" data-end="606" data-start="496" data-ke-list-type="disc">
<li data-end="553" data-start="496"><b>단측검정 (One-tailed test)</b>: 한 방향의 효과만 관심 있는 경우 (&gt;, &lt;) &gt;0&lt;~</li>
<li data-end="606" data-start="554"><b>양측검정 (Two-tailed test)</b>: 양쪽 모두 가능성을 고려하는 경우 (&ne;)</li>
</ul>
<h4 data-end="662" data-start="613" data-ke-size="size20">3. <b>검정통계량 선택 (Test Statistic Selection)</b></h4>
<p data-end="692" data-start="663" data-ke-size="size16">데이터의 성격에 따라 적절한 통계량을 선택합니다.</p>
<ul style="list-style-type: disc;" data-end="776" data-start="693" data-ke-list-type="disc">
<li data-end="751" data-start="693"><b>평균 비교</b>: 표준편차를 알고 있다면 <b>Z-검정</b>, 모르고 추정해야 하면 <b>T-검정</b></li>
<li data-end="776" data-start="752"><b>비율 비교</b>: 보통 <b>Z-검정</b></li>
</ul>
<h4 data-end="828" data-start="783" data-ke-size="size20">4. <b>유의수준(&alpha;) 설정 (Significance Level)</b></h4>
<p data-end="863" data-start="829" data-ke-size="size16">어느 정도의 확률까지 &lsquo;우연&rsquo;으로 볼지를 사전에 정한다.</p>
<ul style="list-style-type: disc;" data-end="913" data-start="864" data-ke-list-type="disc">
<li data-end="913" data-start="864">일반적으로 <b>0.05 (5%)</b> 또는 <b>0.01 (1%)</b> 수준을 사용한다.</li>
</ul>
<h4 data-end="955" data-start="920" data-ke-size="size20">5. <b>검정통계량 계산 및 p-value 산출</b></h4>
<p data-end="1007" data-start="956" data-ke-size="size16">표본 데이터로부터 검정통계량을 계산하고,<br />이를 바탕으로 <b>p-value</b>를 구한다.</p>
<h4 data-end="1051" data-start="1014" data-ke-size="size20">6. <b>판단: p-value와 유의수준(&alpha;) 비교</b></h4>
<ul style="list-style-type: disc;" data-end="1151" data-start="1052" data-ke-list-type="disc">
<li data-end="1101" data-start="1052"><b>p-value &lt; &alpha;</b>: 관측된 결과가 너무 극단적 &rarr; <b>귀무가설 기각</b></li>
<li data-end="1151" data-start="1102"><b>p-value &ge; &alpha;</b>: 관측된 결과가 우연일 수 있음 &rarr; <b>귀무가설 유지</b></li>
</ul>
<p data-end="1233" data-start="1158" data-ke-size="size16">이러한 절차를 통해 우리는 주어진 데이터가 <b>단순한 우연인지, 아니면 실제로 의미 있는 변화인지</b>를 통계적으로 판단할 수 있다.</p>
<p data-end="1233" data-start="1158" data-ke-size="size16">&nbsp;</p>
<h2 style="color: #000000; text-align: start;" data-ke-size="size26" data-start="71" data-end="87">결론(오늘 배운거)&nbsp;</h2>
<p data-ke-size="size16">통계는 결국 <b>"우연"을 의심하는 학문</b>이다.<br />데이터에 나타난 결과가 단지 운이었는지, 아니면 뭔가 &lsquo;진짜&rsquo;가 있는지 &mdash;<br />그 판단을 돕기 위해 <b>가설을 세우고</b>, <b>p-value를 계산하며</b>,<br />그 결과에 따라 <b>귀무가설을 기각하거나 유지</b>한다.</p>
<p data-end="297" data-start="282" data-ke-size="size16">p-value는 말 그대로,</p>
<blockquote data-end="353" data-start="298" data-ke-style="style2">
<p data-end="353" data-start="300" data-ke-size="size16">&ldquo;이 결과가 그냥 우연히 나타날 확률이 얼마나 되는가?&rdquo;<br />를 수치로 보여주는 도구다.</p>
</blockquote>
<p data-end="364" data-start="355" data-ke-size="size16">그 값이 작다면,</p>
<blockquote data-end="400" data-start="365" data-ke-style="style2">
<p data-end="400" data-start="367" data-ke-size="size16">&ldquo;이건 우연이라 보기엔 너무 극단적인데?&rdquo; &rarr; 귀무가설 기각</p>
</blockquote>
<p data-end="411" data-start="402" data-ke-size="size16">그 값이 크다면,</p>
<blockquote data-end="452" data-start="412" data-ke-style="style2">
<p data-end="452" data-start="414" data-ke-size="size16">&ldquo;이 정도 결과는 우연히도 자주 일어날 수 있어.&rdquo; &rarr; 귀무가설 유지</p>
</blockquote>
<p data-end="557" data-start="454" data-ke-size="size16">이처럼 가설검정은 <b>불확실한 세상에서 조금 더 신중하게 말하기 위한 과정</b>이다.</p>

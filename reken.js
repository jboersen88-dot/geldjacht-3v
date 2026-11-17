/* Rekenvragen 3 vwo H1 + H2. Elke functie maakt een nieuwe vraag met nieuwe getallen:
   {v: vraagtekst, fig: html (grafiek/tabel, mag ontbreken), ant: juist antwoord, soort: "euro"|"procent"|"aantal"|"getal",
    tol: toegestane afwijking (afronden via tussenstappen), formule: aanpak (alleen voor de AI, nooit in beeld), uitw: uitwerking (zelftest)} */
function rnd(a,b){return a+Math.floor(Math.random()*(b-a+1));}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function rd(x,d){var f=Math.pow(10,d||0);return Math.round(x*f+(x>=0?1e-9:-1e-9))/f;}
function getalNL(x,d){return Number(x).toLocaleString("nl-NL",{minimumFractionDigits:d||0,maximumFractionDigits:d==null?2:d});}
function eu(x){var c=Math.abs(rd(x,2)%1)>0.0001;return (x<0?"− ":"")+"€ "+getalNL(Math.abs(x),c?2:0);}
function pc(x){return getalNL(x,1)+"%";}
var NAMEN=["Lotte","Bram","Sara","Daan","Noor","Ayoub","Femke","Milan","Yara","Sem","Lina","Thijs"];
var PAREN=[["bioscoopkaartjes","pizza's","bioscoopkaartje","pizza"],["bekers koffie","broodjes","beker koffie","broodje"],["ijsjes","blikjes fris","ijsje","blikje fris"],
  ["tijdschriften","boeken","tijdschrift","boek"],["zwemkaartjes","patatjes","zwemkaartje","patatje"],["songs","films","song","film"],["sokken","T-shirts","paar sokken","T-shirt"]];
function heel4(x){return Math.abs(x*4-Math.round(x*4))<1e-9;} // prijs in hele kwartjes
function blCombo(){for(var k=0;k<500;k++){var B=pick([24,30,36,40,48,60,72,80,90,120]),nx=rnd(3,12),ny=rnd(3,12);
  if(nx!==ny&&heel4(B/nx)&&heel4(B/ny))return {B:B,nx:nx,ny:ny,px:B/nx,py:B/ny};}return {B:48,nx:4,ny:6,px:12,py:8};}

var REKEN=[
// 1.3 Na een eerste aankoop: hoeveel kun je nog kopen?
function(){for(var k=0;k<500;k++){var c=blCombo(),a=rnd(1,c.nx-1),rest=c.B-a*c.px,ant=Math.floor(rest/c.py+1e-9);if(ant>=1)break;}
  var pr=pick(PAREN),n=pick(NAMEN);
  return {v:n+" heeft € "+c.B+" te besteden aan "+pr[0]+" en "+pr[1]+". In de grafiek zie je de budgetlijn.\n"+n+" koopt eerst "+a+" "+(a===1?pr[2]:pr[0])+". Hoeveel "+pr[1]+" kan "+n+" daarna maximaal nog kopen?",
   fig:budgetSvg({xlab:pr[0],ylab:pr[1],lijnen:[{x0:c.nx,y0:c.ny,kleur:GK.blauw}]}),ant:ant,soort:"aantal",tol:0.01,
   formule:"prijs = budget : maximale aantal (snijpunt); wat over is = budget − uitgegeven; aantal = wat over is : prijs, naar beneden afronden",
   uitw:"prijs "+pr[2]+" = "+c.B+" : "+c.nx+" = "+eu(c.px)+"; prijs "+pr[3]+" = "+c.B+" : "+c.ny+" = "+eu(c.py)+"; over: "+c.B+" − "+a+" × "+getalNL(c.px)+" = "+getalNL(rest)+"; "+getalNL(rest)+" : "+getalNL(c.py)+" → "+ant};},
// 1.3 Budgetlijn draait: met hoeveel procent veranderde de prijs? (favoriet van de docent)
function(){for(var k=0;k<500;k++){var c=blCombo(),opY=Math.random()<0.5,oud=opY?c.ny:c.nx,nieuw=rnd(3,13);
    if(nieuw!==oud&&Math.abs(nieuw-oud)<=Math.max(1,oud*0.5)&&heel4(c.B/nieuw))break;}
  var pr=pick(PAREN),n=pick(NAMEN),p1=c.B/oud,p2=c.B/nieuw,ant=rd((p2-p1)/p1*100,1),prod=opY?pr[3]:pr[2];
  var B2=opY?{x0:c.nx,y0:nieuw}:{x0:nieuw,y0:c.ny};
  return {v:n+" besteedt elke week € "+c.B+" aan "+pr[0]+" en "+pr[1]+". Door een prijsverandering verschuift de budgetlijn van A naar B. Het budget blijft € "+c.B+".\nMet hoeveel procent is de prijs van een "+prod+" veranderd? Rond af op 1 decimaal. Typ een min-teken als de prijs is gedaald.",
   fig:budgetSvg({xlab:pr[0],ylab:pr[1],lijnen:[{x0:c.nx,y0:c.ny,kleur:GK.blauw,label:"A"},{x0:B2.x0,y0:B2.y0,kleur:GK.oranje,stip:true,label:"B"}]}),ant:ant,soort:"procent",tol:0.06,
   formule:"oude prijs = budget : oud snijpunt; nieuwe prijs = budget : nieuw snijpunt; (nieuw − oud) : oud × 100",
   uitw:"oud "+c.B+" : "+oud+" = "+getalNL(p1)+"; nieuw "+c.B+" : "+nieuw+" = "+getalNL(p2)+"; ("+getalNL(p2)+" − "+getalNL(p1)+") : "+getalNL(p1)+" × 100 = "+pc(ant)};},
// 1.3 Budgetlijn evenwijdig verschoven: hoeveel euro is het budget veranderd?
function(){for(var k=0;k<500;k++){var px=pick([2,2.5,3,4,5,6]),py=pick([2,3,4,5,6,8]),n1=rnd(3,12),n2=rnd(3,12),
    y1=n1*px/py,y2=n2*px/py;if(n1!==n2&&Number.isInteger(y1)&&Number.isInteger(y2)&&y1>=2&&y2>=2&&y1<=14&&y2<=14)break;}
  var pr=pick(PAREN),n=pick(NAMEN),ant=rd((n2-n1)*px,2);
  return {v:"De budgetlijn van "+n+" voor "+pr[0]+" en "+pr[1]+" verschuift van A naar B. De prijzen veranderen niet. Een "+pr[2]+" kost "+eu(px)+".\nMet hoeveel euro is het budget van "+n+" veranderd? Typ een min-teken als het budget is gedaald.",
   fig:budgetSvg({xlab:pr[0],ylab:pr[1],lijnen:[{x0:n1,y0:y1,kleur:GK.blauw,label:"A"},{x0:n2,y0:y2,kleur:GK.oranje,stip:true,label:"B"}]}),ant:ant,soort:"euro",
   formule:"budget = maximale aantal × prijs; verandering = nieuw budget − oud budget",
   uitw:"oud "+n1+" × "+getalNL(px)+" = "+getalNL(n1*px)+"; nieuw "+n2+" × "+getalNL(px)+" = "+getalNL(n2*px)+"; verschil "+eu(ant)};},
// 1.3 Wat moet je opgeven voor één extra?
function(){for(var k=0;k<500;k++){var nx=rnd(3,12),ny=rnd(3,12);if(nx!==ny&&Number.isInteger(ny/nx*100))break;}
  var pr=pick(PAREN),n=pick(NAMEN),ant=rd(ny/nx,2);
  return {v:n+" geeft haar hele budget uit aan "+pr[0]+" en "+pr[1]+", dus ze zit op de budgetlijn.\nZe wil 1 "+pr[2]+" meer kopen en blijft binnen haar budget. Hoeveel "+pr[1]+" moet ze daarvoor inleveren? Rond af op 2 decimalen.",
   fig:budgetSvg({xlab:pr[0],ylab:pr[1],lijnen:[{x0:nx,y0:ny,kleur:GK.blauw}]}),ant:ant,soort:"getal",tol:0.011,
   formule:"als je alles uitgeeft aan y krijg je het snijpunt op de y-as, alles aan x het snijpunt op de x-as; voor 1 x lever je (snijpunt y : snijpunt x) y in (= prijs x : prijs y)",
   uitw:ny+" : "+nx+" = "+getalNL(ant,2)};},
// 1.2 Secundair inkomen per maand (perioden omrekenen, valkuil woonhuur)
function(){var L=rnd(52,76)*50,rj=rnd(2,9)*60,gar=pick([0,60,75,90,120]),bel=Math.round(L*pick([0.22,0.25,0.28])/10)*10,kb=pick([270,540,810,1080]),huur=rnd(18,32)*50,zt=gar?0:pick([45,90,120]);
  var rij=[["Loon","€ "+getalNL(L)+" per maand"],["Rente op de spaarrekening","€ "+getalNL(rj)+" per jaar"]];
  if(gar)rij.push(["Verhuur van een garagebox","€ "+gar+" per maand"]);
  rij.push(["Huur die ze zelf betalen voor hun woning","€ "+getalNL(huur)+" per maand"],["Belastingen","€ "+getalNL(bel)+" per maand"],["Kinderbijslag","€ "+getalNL(kb)+" per kwartaal"]);
  if(zt)rij.push(["Zorgtoeslag","€ "+zt+" per maand"]);
  var ant=L+rj/12+gar-bel+kb/3+zt,fam=pick(["Bakker","De Vries","El Amrani","Visser","Jansen","Öztürk"]);
  return {v:"Hieronder zie je de geldstromen van de familie "+fam+". Let op: niet alle bedragen gaan over dezelfde periode, en niet alles is inkomen.\nBereken het secundaire inkomen per maand van de familie "+fam+".",
   fig:tabelDoc(["Geldstroom familie "+fam,"Bedrag"],rij),ant:ant,soort:"euro",
   formule:"alles per maand; inkomen uit arbeid + inkomen uit bezit = primair inkomen; − belastingen + overdrachtsinkomen = secundair inkomen; de huur van de eigen woning is een uitgave en telt niet mee",
   uitw:L+" + "+rj+"/12"+(gar?" + "+gar:"")+" − "+bel+" + "+kb+"/3"+(zt?" + "+zt:"")+" = "+eu(ant)};},
// 1.2 Primair inkomen per jaar
function(){var L=rnd(50,80)*50,vg=Math.round(L*12*0.08),rk=rnd(3,15)*5,h=pick([0,250,350,450]),kb=pick([270,540,810]),bel=Math.round(L*0.25/10)*10;
  var rij=[["Loon","€ "+getalNL(L)+" per maand"],["Vakantiegeld","€ "+getalNL(vg)+" per jaar"],["Rente op spaargeld","€ "+rk+" per kwartaal"]];
  if(h)rij.push(["Verhuur van een vakantiehuisje","€ "+h+" per maand"]);
  rij.push(["Kinderbijslag","€ "+kb+" per kwartaal"],["Belastingen","€ "+getalNL(bel)+" per maand"]);
  var ant=L*12+vg+rk*4+h*12,n=pick(["meneer Peters","mevrouw Kaya","meneer De Boer","mevrouw Smit"]);
  return {v:"Hieronder zie je wat er binnenkomt en weggaat bij "+n+".\nBereken het primaire inkomen per jaar van "+n+".",
   fig:tabelDoc(["Geldstroom "+n,"Bedrag"],rij),ant:ant,soort:"euro",
   formule:"primair inkomen = inkomen uit arbeid + inkomen uit bezit, alles per jaar; belasting en overdrachtsinkomen tellen niet mee",
   uitw:L+"×12 + "+vg+" + "+rk+"×4"+(h?" + "+h+"×12":"")+" = "+eu(ant)};},
// 1.2 Saldo van een maandbegroting met verschillende perioden
function(){var w=rnd(5,20)*3,z=pick([0,20,30,40]),t=rnd(10,25),s=rnd(10,30)*3,k=rnd(20,50)*12,u=rnd(4,12)*3,n=pick(NAMEN);
  var ant=rd(w*13/3+z-t-s/3-k/12-u*13/3,2);
  var rij=[["Bijbaan (inkomsten)","€ "+w+" per week"]];if(z)rij.push(["Zakgeld (inkomsten)","€ "+z+" per maand"]);
  rij.push(["Telefoonabonnement","€ "+t+" per maand"],["Contributie sportclub","€ "+s+" per kwartaal"],["Kleding","€ "+getalNL(k)+" per jaar"],["Uitgaan en eten met vrienden","€ "+u+" per week"]);
  return {v:"Hieronder zie je de begroting van "+n+". Reken met 52 weken in een jaar.\nBereken het saldo per maand: hoeveel houdt "+n+" over, of komt "+n+" tekort? Typ een min-teken bij een tekort.",
   fig:tabelDoc(["Begroting van "+n,"Bedrag"],rij),ant:ant,soort:"euro",tol:0.06,
   formule:"alles omrekenen naar per maand (per week × 52 : 12, per kwartaal : 3, per jaar : 12); saldo = inkomsten − uitgaven",
   uitw:"in "+getalNL(rd(w*13/3+z,2))+", uit "+getalNL(rd(t+s/3+k/12+u*13/3,2))+" → "+eu(ant)};},
// 1.2 Begroting volgend jaar met prijs- en loonstijgingen
function(){for(var k=0;k<200;k++){var I=rnd(26,38)*100,i=pick([2,3]),H=rnd(16,24)*50,E=rnd(15,26)*10,e=pick([10,20]),G=rnd(8,14)*50,O=rnd(6,14)*50;
    if(I-H-E-G-O>40&&I-H-E-G-O<400)break;}
  var nu=I-H-E-G-O,ant=I*(1+i/100)-H*1.04-E*(1+e/100)-G*1.06-O;ant=rd(ant,2);
  var rij=[["Netto inkomen","€ "+getalNL(I),"+"+i+"%"],["Huur","€ "+getalNL(H),"+4%"],["Energie","€ "+E,"+"+e+"%"],["Boodschappen","€ "+G,"+6%"],["Overige uitgaven","€ "+O,"gelijk"]];
  return {v:"De familie Mertens heeft nu elke maand € "+getalNL(nu)+" over. In de tabel zie je de bedragen per maand en wat er volgend jaar met elk bedrag gebeurt.\nBereken het overschot (of tekort) per maand van volgend jaar. Typ een min-teken bij een tekort.",
   fig:'<table class="doc"><tr><th>Per maand</th><th class="n">Nu</th><th class="n">Volgend jaar</th></tr>'+rij.map(function(r){return '<tr><td>'+r[0]+'</td><td class="n">'+r[1]+'</td><td class="n">'+r[2]+'</td></tr>';}).join("")+'</table>',
   ant:ant,soort:"euro",tol:0.06,
   formule:"elk bedrag × (1 + stijging/100); nieuw saldo = nieuw inkomen − alle nieuwe uitgaven",
   uitw:"in "+getalNL(I*(1+i/100))+", uit "+getalNL(H*1.04+E*(1+e/100)+G*1.06+O)+" → "+eu(ant)};},
// 1.2 Terugrekenen: oude prijs na een stijging of korting
function(){var p=pick([4,5,8,10,12.5,20,25]),O=rnd(5,40)*8,op=Math.random()<0.65,N=rd(O*(op?1+p/100:1-p/100),2),d=pick([["Een sportabonnement","per jaar"],["Een paar sneakers",""],["Een concertkaartje",""],["Een treinabonnement","per maand"]]);
  return {v:d[0]+" kost na "+(op?"een prijsstijging van ":"een korting van ")+getalNL(p)+"% nu "+eu(N)+" "+d[1]+".\nBereken de prijs van vóór de "+(op?"stijging":"korting")+".",
   ant:O,soort:"euro",tol:0.011,
   formule:op?"nieuwe prijs = oude prijs × (1 + p/100), dus oude prijs = nieuwe prijs : (1 + p/100); NIET de nieuwe prijs min p%":"nieuwe prijs = oude prijs × (1 − p/100), dus oude prijs = nieuwe prijs : (1 − p/100)",
   uitw:getalNL(N)+" : "+getalNL(op?1+p/100:1-p/100,3)+" = "+eu(O)};},
// 2.2 Geldhoeveelheid uit een staafdiagram: procentuele verandering
function(){var c1=rnd(50,70),g1=rnd(30,40)*10,s1=rnd(46,60)*10,c2=c1+pick([-4,-3,-2,2,3,4]),g2=g1+pick([-16,-8,8,16,24,32,40]),s2=s1+rnd(1,5)*10,j=rnd(2022,2024);
  var M1=c1+g1,M2=c2+g2,ant=rd((M2-M1)/M1*100,1),ym=Math.ceil((Math.max(s1,s2)+60)/100)*100;
  return {v:"Het staafdiagram laat zien hoeveel geld er in een land was in "+j+" en "+(j+1)+" (in miljarden euro's).\nBereken met hoeveel procent de maatschappelijke geldhoeveelheid is veranderd van "+j+" naar "+(j+1)+". Rond af op 1 decimaal. Typ een min-teken bij een daling.",
   fig:staafSvg({ylab:"miljard euro",ymax:ym,ystep:100,reeksen:[{naam:"chartaal geld",kleur:GK.oranje},{naam:"giraal geld",kleur:GK.blauw},{naam:"spaartegoeden",kleur:GK.grijs}],groepen:[{label:String(j),waarden:[c1,g1,s1]},{label:String(j+1),waarden:[c2,g2,s2]}]}),
   ant:ant,soort:"procent",tol:0.06,
   formule:"geldhoeveelheid = chartaal + giraal (spaartegoeden tellen NIET mee); (nieuw − oud) : oud × 100",
   uitw:c1+"+"+g1+"="+M1+"; "+c2+"+"+g2+"="+M2+"; "+pc(ant)+" (met spaargeld fout: "+pc(rd((M2+s2-M1-s1)/(M1+s1)*100,1))+")"};},
// 2.2 Aandeel giraal geld in de geldhoeveelheid (tabel met valkuilen)
function(){var cg=rnd(40,60),co=rnd(3,9),g=rnd(30,45)*10,sp=rnd(45,70)*10,dp=rnd(8,18)*10,kl=rnd(6,20),M=cg+co+g,ant=rd(g/M*100,1);
  var rij=[["Chartaal geld bij gezinnen en bedrijven",cg],["Chartaal geld bij de overheid",co],["Giraal geld op betaalrekeningen",g],["Geld op spaarrekeningen",sp],["Spaardeposito's",dp],["Chartaal geld in de kluizen van banken",kl]].sort(function(){return Math.random()-0.5;}).map(function(r){return [r[0],"€ "+r[1]+" mld"];});
  return {v:"In de tabel zie je gegevens over het geld in een land.\nHoeveel procent van de maatschappelijke geldhoeveelheid bestaat uit giraal geld? Rond af op 1 decimaal.",
   fig:tabelDoc(["Geld in een land","Bedrag"],rij),ant:ant,soort:"procent",tol:0.06,
   formule:"geldhoeveelheid = chartaal geld buiten de banken (gezinnen, bedrijven, overheid) + giraal geld; spaargeld, deposito's en geld in de kluis van de bank tellen niet mee; deel = giraal : geldhoeveelheid × 100",
   uitw:"M = "+cg+"+"+co+"+"+g+" = "+M+"; "+g+" : "+M+" × 100 = "+pc(ant)};},
// 2.2 Intrinsieke waarde van een munt in procenten
function(){var m=pick([["€ 2",2,8.5],["€ 1",1,7.5],["50 cent",0.5,7.8],["20 cent",0.2,5.7]]),k=rnd(8,16),intr=m[2]*k/1000,ant=rd(intr/m[1]*100,1);
  return {v:"Een munt van "+m[0]+" weegt "+getalNL(m[2])+" gram. Het metaal waarvan de munt gemaakt is, kost € "+k+" per kilo.\nHoeveel procent van de nominale waarde is de intrinsieke waarde? Rond af op 1 decimaal.",
   ant:ant,soort:"procent",tol:0.06,
   formule:"intrinsieke waarde = gewicht in kilo × prijs per kilo (1 kilo = 1000 gram); percentage = intrinsieke waarde : nominale waarde × 100",
   uitw:getalNL(m[2])+" : 1000 × "+k+" = "+getalNL(rd(intr,4),4)+"; : "+getalNL(m[1])+" × 100 = "+pc(ant)};},
// 2.3 Van indexcijfer naar prijs (of terug)
function(){var idx=rd(100+rnd(40,320)/10,1),d=pick([["een fiets",rnd(40,90)*10],["een spijkerbroek",rnd(60,110)],["een maand huur van een studio",rnd(55,90)*10],["een volle boodschappenkar",rnd(80,160)]]),terug=Math.random()<0.4;
  var nu=rd(d[1]*idx/100,2);
  if(terug)return {v:"Het prijsindexcijfer (2020 = 100) is in 2025 "+getalNL(idx,1)+". In 2025 kost "+d[0]+" "+eu(nu)+". De prijs is precies zo hard gestegen als het indexcijfer.\nWat kostte "+d[0]+" in 2020? Rond af op hele centen.",
   ant:rd(nu/idx*100,2),soort:"euro",tol:0.02,formule:"prijs 2025 = prijs 2020 × index : 100, dus prijs 2020 = prijs 2025 : index × 100",uitw:getalNL(nu)+" : "+getalNL(idx,1)+" × 100"};
  return {v:"In 2020 kostte "+d[0]+" "+eu(d[1])+". Het prijsindexcijfer (2020 = 100) is in 2025 "+getalNL(idx,1)+". De prijs is precies zo hard gestegen als het indexcijfer.\nWat kost "+d[0]+" in 2025? Rond af op hele centen.",
   ant:nu,soort:"euro",tol:0.011,formule:"prijs 2025 = prijs 2020 × indexcijfer : 100",uitw:d[1]+" × "+getalNL(idx,1)+" : 100 = "+eu(nu)};},
// 2.3 Koopkracht uit een lijngrafiek met cao-lonen en prijzen
function(){var jr=[2021,2022,2023,2024,2025],P=[100],W=[100],prijsHoger=Math.random()<0.6;
  for(var i=1;i<5;i++){var a=P[i-1]+rnd(15,60)/10,b=W[i-1]+rnd(15,60)/10;P.push(rd(a,1));W.push(rd(b,1));
    var hoog=prijsHoger?P:W,laag=prijsHoger?W:P;if(hoog[i]-laag[i]<2.5)hoog[i]=rd(laag[i]+rnd(25,45)/10,1);}
  var j=rnd(2,4),ric=rd(W[j]/P[j]*100,1),ant=rd(ric-100,1),mn=95,mx=Math.ceil((Math.max(P[4],W[4])+3)/5)*5;
  return {v:"De grafiek laat de indexcijfers zien van de cao-lonen en van de consumentenprijzen (2021 = 100).\nBereken met hoeveel procent de koopkracht van een werknemer met een cao-loon is veranderd van 2021 tot en met "+jr[j]+". Rond af op 1 decimaal. Typ een min-teken bij een daling.",
   fig:lijnSvg({jaren:jr,ymin:mn,ymax:mx,ystep:5,ylab:"indexcijfer (2021 = 100)",reeksen:[{naam:"consumentenprijzen",kleur:GK.oranje,w:P,boven:prijsHoger},{naam:"cao-lonen",kleur:GK.blauw,w:W,boven:!prijsHoger}]}),
   ant:ant,soort:"procent",tol:0.15,
   formule:"RIC = NIC : PIC × 100 (lonen gedeeld door prijzen, niet andersom); koopkracht = RIC − 100",
   uitw:getalNL(W[j],1)+" : "+getalNL(P[j],1)+" × 100 = "+getalNL(ric,1)+" → "+pc(ant)};},
// 2.3 Ander basisjaar + loonstijging → koopkracht (valkuil: indexpunten ≠ procent)
function(){var i1=rd(110+rnd(0,200)/10,1),i2=rd(i1*(1+rnd(15,70)/1000),1),l1=rnd(50,70)*50,g=pick([2,3,3.5,4,4.5,5,6]),l2=rd(l1*(1+g/100),2),n=pick(NAMEN);
  var NIC=rd(l2/l1*100,1),PIC=rd(i2/i1*100,1),ant=rd(rd(NIC/PIC*100,1)-100,1);
  return {v:"Het prijsindexcijfer (2020 = 100) was in 2023 "+getalNL(i1,1)+" en in 2025 "+getalNL(i2,1)+". Het loon van "+n+" steeg in diezelfde periode van "+eu(l1)+" naar "+eu(l2)+" per maand.\nBereken met hoeveel procent de koopkracht van "+n+" is veranderd tussen 2023 en 2025. Rond af op 1 decimaal. Typ een min-teken bij een daling.",
   ant:ant,soort:"procent",tol:0.15,
   formule:"prijsstijging = index 2025 : index 2023 × 100 (NIET het verschil in indexpunten); NIC = loon 2025 : loon 2023 × 100; RIC = NIC : PIC × 100; koopkracht = RIC − 100",
   uitw:"PIC "+getalNL(PIC,1)+", NIC "+getalNL(NIC,1)+" → "+pc(ant)};},
// 2.3 Koopkracht over twee jaar
function(){var l1=pick([1.5,2,2.5,3,4,5]),p1=pick([1,2,3,4,5,6]),l2=pick([1.5,2,3,3.5,4,5]),p2=pick([1,1.5,2,3,4]);
  var N=(1+l1/100)*(1+l2/100),P=(1+p1/100)*(1+p2/100),ant=rd(N/P*100-100,1);
  return {v:"In 2024 stegen de lonen met "+getalNL(l1)+"% en de prijzen met "+getalNL(p1)+"%. In 2025 stegen de lonen met "+getalNL(l2)+"% en de prijzen met "+getalNL(p2)+"%.\nBereken met hoeveel procent de koopkracht over deze twee jaar samen is veranderd. Rond af op 1 decimaal. Typ een min-teken bij een daling.",
   ant:ant,soort:"procent",tol:0.15,
   formule:"NIC over twee jaar = 100 × (1 + l1) × (1 + l2); PIC idem met de prijzen; RIC = NIC : PIC × 100; koopkracht = RIC − 100",
   uitw:"NIC "+getalNL(rd(N*100,2),2)+", PIC "+getalNL(rd(P*100,2),2)+" → "+pc(ant)};},
// 2.3 Reële rente uit spaarbedragen
function(){var S=rnd(10,40)*100,r=pick([1,1.5,2,2.25,2.5,3,3.5]),inf=pick([1.2,2.1,2.8,3.1,3.6,4.2]),eind=rd(S*(1+r/100),2),n=pick(NAMEN),ant=rd(r-inf,2);
  return {v:n+" had op 1 januari "+eu(S)+" op een spaarrekening. Op 31 december staat er "+eu(eind)+" op. "+n+" heeft niets gestort en niets opgenomen. De inflatie was dat jaar "+getalNL(inf)+"%.\nBereken de reële rente. Typ een min-teken als hij negatief is.",
   ant:ant,soort:"procent",tol:0.051,
   formule:"nominale rente = (eind − begin) : begin × 100; reële rente ≈ nominale rente − inflatie",
   uitw:"rente "+getalNL(r)+"% − "+getalNL(inf)+"% = "+getalNL(ant)+"%"};},
// 2.3 Indexcijfer uit een prijstabel met een ander basisjaar
function(){var d=pick([["Huur studio (per maand)",rnd(55,75)*10,[2,6]],["Bioscoopkaartje",rnd(90,120)/10,[3,9]],["Liter benzine",rnd(170,200)/100,[-6,8]],["Kilo kaas",rnd(110,150)/10,[2,10]]]),p=[d[1]];
  for(var i=1;i<5;i++)p.push(rd(p[i-1]*(1+rnd(d[2][0],d[2][1])/100),2));
  var jr=[2021,2022,2023,2024,2025],b=rnd(1,2),doel=4,ant=rd(p[doel]/p[b]*100,1);
  return {v:"In de tabel zie je de prijs van een product in vijf jaren.\nBereken het indexcijfer van de prijs in "+jr[doel]+" met "+jr[b]+" als basisjaar. Rond af op 1 decimaal.",
   fig:tabelJaren(jr,[[d[0]].concat(p.map(function(x){return eu(x);}))]),ant:ant,soort:"getal",tol:0.06,
   formule:"indexcijfer = prijs in het gevraagde jaar : prijs in het basisjaar × 100",
   uitw:getalNL(p[doel])+" : "+getalNL(p[b])+" × 100 = "+getalNL(ant,1)};}
];
